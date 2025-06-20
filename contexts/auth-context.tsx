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
    console.log("[AuthContext] ensureStripeCustomer: Called for user:", user.id);
    if (!user || !user.email) {
      console.log("[AuthContext] ensureStripeCustomer: No user or email, returning.");
      return null;
    }

    try {
      console.log("[AuthContext] ensureStripeCustomer: Fetching /api/stripe/create-customer-for-user...");
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
        const errorText = await response.text();
        console.error(`[AuthContext] ensureStripeCustomer: Failed to create Stripe customer. Status: ${response.status}`, errorText);
        return null;
      }

      const { customerId } = await response.json();
      console.log("[AuthContext] ensureStripeCustomer: Successfully created Stripe customer:", customerId);
      return customerId;
    } catch (error) {
      console.error("[AuthContext] ensureStripeCustomer: An unexpected error occurred:", error);
      return null;
    }
  }, [])

  // Update the checkAuth function to fetch and set the user's role
  const checkAuth = useCallback(async () => {
    console.log("[AuthContext] ===== CHECKAUTH FUNCTION STARTED =====");
    console.log("[AuthContext] checkAuth: Starting authentication check...");

    const testSession = getLocalStorage("testSession");
    console.log("[AuthContext] checkAuth: Test session from localStorage:", testSession);
    
    if (testSession && typeof testSession === "object" && testSession !== null && "user" in testSession) {
      try {
        console.log("[AuthContext] checkAuth: Found valid test session in localStorage.");
        const testUser = testSession.user as User;
        console.log("[AuthContext] checkAuth: Test user data:", testUser);
        
        setUser(testUser);
        setSessionToken(testSession.token as string);
        // @ts-ignore
        setUserRole(testUser.role || "customer");
        console.log("[AuthContext] checkAuth: Test session state has been set.");
        console.log("[AuthContext] checkAuth: ===== CHECKAUTH COMPLETED (TEST SESSION) =====");
        return { isLoggedIn: true, user: testUser };
      } catch (error) {
        console.error("[AuthContext] checkAuth: Error processing test session:", error);
        removeLocalStorage("testSession");
      }
    }

    console.log("[AuthContext] checkAuth: No test session found, checking Supabase for a session.");
    
    try {
      const sessionStartTime = Date.now();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      const sessionEndTime = Date.now();
      
      console.log("[AuthContext] checkAuth: getSession completed in:", sessionEndTime - sessionStartTime, "ms");
      console.log("[AuthContext] checkAuth: Session data:", session);
      console.log("[AuthContext] checkAuth: Session error:", sessionError);

      if (sessionError) {
        console.error("[AuthContext] checkAuth: Error getting session from Supabase:", sessionError);
        console.log("[AuthContext] checkAuth: ===== CHECKAUTH FAILED (SESSION ERROR) =====");
        return { isLoggedIn: false, user: null };
      }

      if (session) {
        console.log("[AuthContext] checkAuth: Supabase session found for user:", session.user.id);
        console.log("[AuthContext] checkAuth: Session user email:", session.user.email);
        console.log("[AuthContext] checkAuth: Access token exists:", !!session.access_token);
        
        setUser(session.user);
        setSessionToken(session.access_token);

        console.log("[AuthContext] checkAuth: About to fetch profile from Supabase for user:", session.user.id);
        
        try {
          const profileStartTime = Date.now();
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role, stripe_customer_id")
            .eq("user_id", session.user.id)
            .single();
          const profileEndTime = Date.now();
          
          console.log("[AuthContext] checkAuth: Profile query completed in:", profileEndTime - profileStartTime, "ms");
          console.log("[AuthContext] checkAuth: Profile data:", profile);
          console.log("[AuthContext] checkAuth: Profile error:", profileError);

          if (profileError && profileError.code !== "PGRST116") {
            console.error("[AuthContext] checkAuth: Error fetching user profile:", profileError);
            console.log("[AuthContext] checkAuth: Setting default role and null stripe ID due to profile error");
            setUserRole("customer"); 
            setStripeCustomerId(null);
          } else if (profile) {
            console.log("[AuthContext] checkAuth: Profile found. Role:", profile.role, "Stripe ID:", profile.stripe_customer_id);
            setUserRole(profile.role || "customer");
            setStripeCustomerId(profile.stripe_customer_id || null);
          } else {
            console.log("[AuthContext] checkAuth: No profile found for new user, setting default role.");
            setUserRole("customer");
            setStripeCustomerId(null);
          }
        } catch (profileError) {
          console.error("[AuthContext] checkAuth: Exception during profile fetch:", profileError);
          setUserRole("customer");
          setStripeCustomerId(null);
        }
        
        console.log("[AuthContext] checkAuth: User is logged in - all profile processing complete.");
      } else {
        console.log("[AuthContext] checkAuth: No Supabase session found. User is logged out.");
        setUser(null);
        setSessionToken(null);
        setUserRole(null);
        setStripeCustomerId(null);
      }

      console.log("[AuthContext] checkAuth: ===== CHECKAUTH COMPLETED =====");
      return { isLoggedIn: !!session, user: session?.user || null };
    } catch (error) {
      console.error("[AuthContext] checkAuth: ===== CHECKAUTH EXCEPTION =====");
      console.error("[AuthContext] checkAuth: Unexpected error:", error);
      console.log("[AuthContext] checkAuth: Setting logged out state due to exception");
      
      setUser(null);
      setSessionToken(null);
      setUserRole(null);
      setStripeCustomerId(null);
      
      return { isLoggedIn: false, user: null };
    }
  }, [supabase.auth])

  useEffect(() => {
    console.log("[AuthContext] useEffect: Initializing AuthProvider.");
    if (!initialAuthCheckDone.current) {
      console.log("[AuthContext] useEffect: Performing initial auth check on mount.");
      checkAuth();
      initialAuthCheckDone.current = true;
    }
  }, [checkAuth])

  useEffect(() => {
    console.log("[AuthContext] useEffect: Subscribing to onAuthStateChange listener.");
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[AuthContext] onAuthStateChange: Event received: ${event}`, { session });
      if (event === "SIGNED_IN") {
        console.log("[AuthContext] onAuthStateChange: SIGNED_IN event, re-validating auth state.");
        await checkAuth();
      } else if (event === "SIGNED_OUT") {
        if (!getLocalStorage("testSession")) {
          console.log("[AuthContext] onAuthStateChange: SIGNED_OUT event, clearing user state.");
          setUser(null);
          setSessionToken(null);
          setUserRole(null);
          setStripeCustomerId(null);
          removeLocalStorage("sessionToken");
        }
      }
    });

    return () => {
      console.log("[AuthContext] useEffect: Unsubscribing from onAuthStateChange listener.");
      subscription.unsubscribe();
    };
  }, [supabase.auth, checkAuth])

  const createTestSession = async () => {
    console.log("[AuthContext] createTestSession: Creating test session...");
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
    setStripeCustomerId(null) // Don't create Stripe customer during test session

    console.log("[AuthContext] createTestSession: Test session created successfully.");
  }

  const login = async (email: string, password: string): Promise<void> => {
    console.log("[AuthContext] ===== LOGIN FUNCTION STARTED =====");
    console.log("[AuthContext] login: Attempting login for email:", email);
    console.log("[AuthContext] login: Password provided:", password ? "YES" : "NO");
    console.log("[AuthContext] login: Password length:", password?.length || 0);
    console.log("[AuthContext] login: Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("[AuthContext] login: Supabase Anon Key exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    try {
      console.log("[AuthContext] login: About to call supabase.auth.signInWithPassword...");
      const signInStartTime = Date.now();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      const signInEndTime = Date.now();
      console.log("[AuthContext] login: signInWithPassword completed in:", signInEndTime - signInStartTime, "ms");
      console.log("[AuthContext] login: Supabase response data:", data);
      console.log("[AuthContext] login: Supabase response error:", error);

      if (error) {
        console.error("[AuthContext] login: ===== SUPABASE SIGNIN FAILED =====");
        console.error("[AuthContext] login: Error object:", error);
        console.error("[AuthContext] login: Error message:", error.message);
        console.error("[AuthContext] login: Error status:", error.status);
        console.error("[AuthContext] login: Error name:", error.name);
        
        // Provide user-friendly error messages in Norwegian
        if (
          error.message?.toLowerCase().includes("invalid login credentials") ||
          error.message?.toLowerCase().includes("invalid credentials") ||
          error.status === 400
        ) {
          console.log("[AuthContext] login: Throwing Norwegian error message");
          throw new Error("Ikke riktig brukernavn og/eller passord");
        }
        
        // For other errors, throw the original error
        console.log("[AuthContext] login: Throwing original error");
        throw error;
      }

      console.log("[AuthContext] login: Supabase sign-in successful!");
      console.log("[AuthContext] login: Session data:", data.session);
      console.log("[AuthContext] login: User data:", data.user);
      console.log("[AuthContext] login: About to call checkAuth...");
      
      const checkAuthStartTime = Date.now();
      await checkAuth();
      const checkAuthEndTime = Date.now();
      
      console.log("[AuthContext] login: checkAuth completed in:", checkAuthEndTime - checkAuthStartTime, "ms");
      console.log("[AuthContext] login: ===== LOGIN FUNCTION COMPLETED SUCCESSFULLY =====");
    } catch (error) {
      console.error("[AuthContext] login: ===== LOGIN FUNCTION FAILED =====");
      console.error("[AuthContext] login: Caught error:", error);
      throw error;
    }
  };

  const logout = async () => {
    console.log("[AuthContext] logout: Initiating user logout.");
    removeLocalStorage("testSession");
    removeLocalStorage("sessionToken");

    // Clear the test session cookie
    document.cookie = "hasTestSession=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure"

    // Clear session cookie
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure"

    // Also clear Supabase session
    await supabase.auth.signOut();

    setUser(null);
    setSessionToken(null);
    setUserRole(null);
    setStripeCustomerId(null);

    console.log("[AuthContext] logout: User has been logged out and state is cleared.");
    router.push("/");
  };

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

