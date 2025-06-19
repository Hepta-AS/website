"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { getLocalStorage, setLocalStorage, removeLocalStorage } from "@/lib/utils"

export type AuthContextType = {
  user: User | null
  sessionToken: string | null
  userRole: string | null
  stripeCustomerId: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<{ isLoggedIn: boolean; user: User | null }>
  createTestSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  sessionToken: null,
  userRole: null,
  stripeCustomerId: null,
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => ({ isLoggedIn: false, user: null }),
  createTestSession: async () => {},
})

// Add role to the TEST_USER object
const TEST_USER = {
  id: "test-user-id",
  email: "test@example.com",
  user_metadata: {
    full_name: "Test User",
  },
  app_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
  role: "admin",
} as User

// Generate a random token for test sessions
const generateTestToken = () => {
  return "test_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
  serverSession?: any | null;
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null)
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))
  const router = useRouter()

  // Use a ref to track if initial auth check has been performed
  const initialAuthCheckDone = useRef(false)

  const ensureStripeCustomer = useCallback(async (user: User) => {
    console.log("[AUTH DEBUG] ensureStripeCustomer called for user:", user.id)
    if (!user || !user.email) {
      console.log("[AUTH DEBUG] ensureStripeCustomer: no user or email, returning.")
      return null
    }

    try {
      const response = await fetch("/api/stripe/create-customer-for-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split("@")[0],
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[AUTH DEBUG] Failed to create Stripe customer:", errorText)
        return null
      }

      const { customerId } = await response.json()
      console.log("[AUTH DEBUG] ensureStripeCustomer success, customerId:", customerId)
      return customerId
    } catch (error) {
      console.error("[AUTH DEBUG] Error in ensureStripeCustomer:", error)
      return null
    }
  }, [])

  // Update the checkAuth function to fetch and set the user's role
  const checkAuth = useCallback(async () => {
    console.log("[AUTH DEBUG] checkAuth: Starting...")

    // First check for a test session from localStorage
    const testSession = getLocalStorage("testSession")
    if (testSession && typeof testSession === "object" && testSession !== null && "user" in testSession) {
      try {
        console.log("[AUTH DEBUG] checkAuth: Found valid test session:", testSession)
        const testUser = testSession.user as User
        setUser(testUser)
        setSessionToken(testSession.token as string)
        // @ts-ignore
        setUserRole(testUser.role || "customer") // Set role from test session
        document.cookie = "hasTestSession=true; path=/"
        console.log("[AUTH DEBUG] checkAuth: Test session state set.")
        return { isLoggedIn: true, user: testUser }
      } catch (error) {
        console.error("[AUTH DEBUG] checkAuth: Error parsing test session:", error)
        removeLocalStorage("testSession")
      }
    }

    // If no test session, check Supabase for a real session
    console.log("[AUTH DEBUG] checkAuth: No test session, checking Supabase...")
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("[AUTH DEBUG] checkAuth: Error getting session:", sessionError)
      return { isLoggedIn: false, user: null }
    }

    if (session) {
      console.log("[AUTH DEBUG] checkAuth: Supabase session found for user:", session.user.id)
      setUser(session.user)
      setSessionToken(session.access_token)
      document.cookie = `session=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`

      // Fetch user profile from Supabase
      console.log("[AUTH DEBUG] checkAuth: Fetching profile for user:", session.user.id)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, stripe_customer_id")
        .eq("user_id", session.user.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        console.error("[AUTH DEBUG] checkAuth: Error fetching user profile:", profileError)
        // Don't block login if profile fetch fails, but log the error
        setUserRole("customer") // Default role
        setStripeCustomerId(null)
      } else if (profile) {
        console.log("[AUTH DEBUG] checkAuth: Profile found:", profile)
        setUserRole(profile.role || "customer")
        setStripeCustomerId(profile.stripe_customer_id)

        // If stripe_customer_id is missing, create it
        if (!profile.stripe_customer_id) {
          console.log("[AUTH DEBUG] checkAuth: Stripe customer ID missing, creating one...")
          const newCustomerId = await ensureStripeCustomer(session.user)
          if (newCustomerId) {
            setStripeCustomerId(newCustomerId)
          }
        }
      } else {
        // Profile not found, this might be a new user
        console.log("[AUTH DEBUG] checkAuth: No profile found for user, treating as new user.")
        setUserRole("customer") // Default role
        const newCustomerId = await ensureStripeCustomer(session.user)
        if (newCustomerId) {
          setStripeCustomerId(newCustomerId)
        }
      }
    } else {
      console.log("[AUTH DEBUG] checkAuth: No Supabase session found.")
      setUser(null)
      setSessionToken(null)
      setUserRole(null)
      setStripeCustomerId(null)
      document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure"
    }

    console.log("[AUTH DEBUG] checkAuth: Finished.")
    return { isLoggedIn: !!session, user: session?.user || null }
  }, [supabase.auth, ensureStripeCustomer])

  // Only run the initial auth check once when the component mounts
  useEffect(() => {
    if (!initialAuthCheckDone.current) {
      console.log("[AUTH DEBUG] useEffect: Performing initial auth check.")
      checkAuth()
      initialAuthCheckDone.current = true
    }
  }, [checkAuth])

  // Set up auth state change listener
  useEffect(() => {
    console.log("[AUTH DEBUG] useEffect: Setting up onAuthStateChange listener.")
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[AUTH DEBUG] onAuthStateChange: Event received: ${event}`, { session })
      if (event === "SIGNED_IN") {
        console.log("[AUTH DEBUG] onAuthStateChange: SIGNED_IN event, calling checkAuth().")
        await checkAuth()
      } else if (event === "SIGNED_OUT") {
        // Don't log out if we have a test session
        if (!getLocalStorage("testSession")) {
          console.log("[AUTH DEBUG] onAuthStateChange: SIGNED_OUT event.")
          setUser(null)
          setSessionToken(null)
          setUserRole(null)
          setStripeCustomerId(null)
          removeLocalStorage("sessionToken")

          // Clear session cookie
          document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure"
        }
      }
    })

    return () => {
      console.log("[AUTH DEBUG] useEffect: Unsubscribing from onAuthStateChange listener.")
      subscription.unsubscribe()
    }
  }, [supabase.auth, checkAuth])

  // Update the createTestSession function to include role
  const createTestSession = async () => {
    console.log("Creating test session")

    const token = generateTestToken()
    const testSession = {
      user: {
        ...TEST_USER,
        role: "admin", // Ensure the test user has admin role
      },
      token: token,
      created_at: new Date().toISOString(),
    }

    // Store the test session in localStorage
    setLocalStorage("testSession", testSession)
    setLocalStorage("sessionToken", token)

    // Set a cookie to indicate we have a test session
    document.cookie = "hasTestSession=true; path=/; SameSite=Strict; Secure"

    // Set a session cookie that expires in 7 days
    document.cookie = `session=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`

    // Update the auth state
    setUser(TEST_USER as User)
    setSessionToken(token)
    setUserRole("admin") // Set role for test session

    console.log("Test session created:", testSession)

    // Ensure the test user has a Stripe customer ID
    if (process.env.NODE_ENV === "development") {
      await ensureStripeCustomer(TEST_USER as User)
    }
  }

  // Update the login function to match the AuthContextType
  const login = async (email: string, password: string): Promise<void> => {
    console.log("[AUTH DEBUG] login: Attempting login for", email)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("[AUTH DEBUG] login: Supabase login error:", error)
      throw error
    }

    console.log("[AUTH DEBUG] login: Supabase login successful, calling checkAuth()")
    // Manually trigger a re-check of auth state after successful login
    await checkAuth()
  }

  const logout = async () => {
    console.log("[AUTH DEBUG] logout: Logging out.")
    // Clear test session if it exists
    removeLocalStorage("testSession")
    removeLocalStorage("sessionToken")

    // Clear the test session cookie
    document.cookie = "hasTestSession=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure"

    // Clear session cookie
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure"

    // Also clear Supabase session
    await supabase.auth.signOut()

    // Reset auth state
    setUser(null)
    setSessionToken(null)
    setUserRole(null)
    setStripeCustomerId(null)

    // Redirect to home
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionToken,
        userRole,
        stripeCustomerId,
        login,
        logout,
        checkAuth,
        createTestSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

