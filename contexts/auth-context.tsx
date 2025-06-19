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
    if (!user || !user.email) return null

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
        console.error("Failed to create Stripe customer:", errorText)
        return null
      }

      const { customerId } = await response.json()
      return customerId
    } catch (error) {
      console.error("Error ensuring Stripe customer:", error)
      return null
    }
  }, [])

  // Update the checkAuth function to fetch and set the user's role
  const checkAuth = useCallback(async () => {
    console.log("Checking auth state...")

    // First check for a session cookie
    const sessionCookie = getCookie("session")
    if (sessionCookie === "authenticated") {
      console.log("Found authenticated session cookie")
    }

    // First check for a test session
    const testSession = getLocalStorage("testSession")
    if (testSession) {
      try {
        console.log("Found test session:", testSession)
        setUser(testSession.user as User)
        setSessionToken(testSession.token)
        setUserRole(testSession.user.role || "customer") // Set role from test session

        // Set a cookie to indicate we have a test session
        document.cookie = "hasTestSession=true; path=/"

        return { isLoggedIn: true, user: testSession.user as User }
      } catch (error) {
        console.error("Error parsing test session:", error)
        removeLocalStorage("testSession")
      }
    }

    // If no test session, check Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log("Auth session:", session ? "Exists" : "None")

    if (session) {
      console.log("Setting logged in state to true")
      setUser(session.user)
      setSessionToken(session.access_token)

      // Set session cookie
      document.cookie = `session=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`

      // Fetch user role from profiles table
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role, stripe_customer_id")
          .eq("id", session.user.id)
          .single()

        if (!error && profile) {
          setUserRole(profile.role || "customer")
          setStripeCustomerId(profile.stripe_customer_id)
          if (!profile?.stripe_customer_id) {
            const newCustomerId = await ensureStripeCustomer(session.user)
            if (newCustomerId) {
              setStripeCustomerId(newCustomerId)
            }
          }
        } else {
          setUserRole("customer") // Default role
          setStripeCustomerId(null)
          const newCustomerId = await ensureStripeCustomer(session.user)
          if (newCustomerId) {
            setStripeCustomerId(newCustomerId)
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error)
        setUserRole("customer") // Default role
        setStripeCustomerId(null)
        const newCustomerId = await ensureStripeCustomer(session.user)
        if (newCustomerId) {
          setStripeCustomerId(newCustomerId)
        }
      }
    } else {
      console.log("Setting logged in state to false")
      setUser(null)
      setSessionToken(null)
      setUserRole(null)
      setStripeCustomerId(null)

      // Clear session cookie
      document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure"
    }

    return { isLoggedIn: !!session, user: session?.user || null }
  }, [supabase.auth, ensureStripeCustomer])

  // Only run the initial auth check once when the component mounts
  useEffect(() => {
    if (!initialAuthCheckDone.current) {
      checkAuth()
      initialAuthCheckDone.current = true
    }
  }, [checkAuth])

  // Set up auth state change listener
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", { event, session })
      if (event === "SIGNED_IN") {
        await checkAuth()
      } else if (event === "SIGNED_OUT") {
        // Don't log out if we have a test session
        if (!getLocalStorage("testSession")) {
          console.log("Auth state change: User logged out")
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
      subscription.unsubscribe()
    }
  }, [supabase.auth])

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
    console.log("Attempting login with email:", email)

    try {
      // Add a small delay before login attempt
      await new Promise((resolve) => setTimeout(resolve, 500))

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        console.error("Login error:", error)
        throw error
      }

      console.log("Login successful:", data.session ? "Session exists" : "No session")

      if (data.session) {
        setUser(data.session.user)
        setSessionToken(data.session.access_token)

        // Store session token in localStorage for easy access
        setLocalStorage("sessionToken", data.session.access_token)

        // Set session cookie
        document.cookie = `session=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`

        console.log("Auth state updated after login")
      }
    } catch (error: any) {
      console.error("Login process error:", error)
      throw error
    }
  }

  const logout = async () => {
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

