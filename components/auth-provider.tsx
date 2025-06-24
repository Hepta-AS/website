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
        
        // Set basic user data immediately
      setUser(session.user);
      setSessionToken(session.access_token);

        // Set default values first, then try to fetch profile
        setUserRole("customer");
        setStripeCustomerId(null);

        console.log("[AuthContext] checkAuth: Basic user state set, attempting to fetch profile...");
        
        // Try to fetch profile with timeout and fallback
        try {
          const profileStartTime = Date.now();
          
          // Add timeout for profile query
          const profilePromise = supabase
        .from("profiles")
        .select("role, stripe_customer_id")
        .eq("user_id", session.user.id)
        .single();

          const profileTimeout = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error("Profile query timeout"));
            }, 3000); // 3 second timeout for profile
          });
          
          const { data: profile, error: profileError } = await Promise.race([
            profilePromise, 
            profileTimeout
          ]) as any;
          
          const profileEndTime = Date.now();
          console.log("[AuthContext] checkAuth: Profile query completed in:", profileEndTime - profileStartTime, "ms");

          if (profileError) {
            // @ts-ignore
            if (profileError.code === "PGRST116") { // "Range not satisfactory" means no rows found
              console.log("[AuthContext] checkAuth: No profile found for user, will create one.");
            } else if (profileError.message === "Profile query timeout") {
              console.warn("[AuthContext] checkAuth: Profile query timed out. Using default role.");
            } else {
              console.error("[AuthContext] checkAuth: Error fetching profile:", profileError);
            }
          }

          if (profile) {
            console.log("[AuthContext] checkAuth: Found profile for user:", profile);
            setUserRole(profile.role || "customer");
            
            // Check for stripe customer id
            if(profile.stripe_customer_id) {
              setStripeCustomerId(profile.stripe_customer_id);
              console.log("[AuthContext] checkAuth: Found Stripe Customer ID in profile:", profile.stripe_customer_id);
            }
          }
        } catch(e) {
            console.warn("[AuthContext] checkAuth: An error occurred during profile fetch, but session is valid. Using default role. Error:", e);
        }

      console.log("[AuthContext] checkAuth: ===== CHECKAUTH COMPLETED (SUPABASE SESSION) =====");
      return { isLoggedIn: true, user: session.user };
    } else {
      console.log("[AuthContext] checkAuth: No active Supabase session found.");
      setUser(null);
      setSessionToken(null);
      setUserRole(null);
      setStripeCustomerId(null);
      console.log("[AuthContext] checkAuth: ===== CHECKAUTH COMPLETED (NO SESSION) =====");
      return { isLoggedIn: false, user: null };
    }
  } catch (error) {
    console.error("[AuthContext] checkAuth: An unexpected error occurred during the auth check process:", error);
    setUser(null);
    setSessionToken(null);
    setUserRole(null);
    setStripeCustomerId(null);
    console.log("[AuthContext] checkAuth: ===== CHECKAUTH FAILED (UNEXPECTED ERROR) =====");
    return { isLoggedIn: false, user: null };
  }
  }, [supabase]);

  const createTestSession = async () => {
    try {
      // Remove any existing test session first
      removeLocalStorage("testSession");

      // @ts-ignore
      const testUser: User = TEST_USER;
      const testToken = generateTestToken();

      setUser(testUser);
      setSessionToken(testToken);
      setUserRole(testUser.role || "customer");
      
      setLocalStorage("testSession", { user: testUser, token: testToken });
      
      console.log("TEST SESSION CREATED: User is now test@example.com (admin)");

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create test session:", error);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Login error:", error.message);
        throw new Error(error.message);
      }

      if (session) {
        setUser(session.user);
        setSessionToken(session.access_token);

        // Fetch user's role and Stripe ID after login
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, stripe_customer_id")
          .eq("user_id", session.user.id)
          .single();

        if (profile) {
          setUserRole(profile.role);
          setStripeCustomerId(profile.stripe_customer_id);
        } else {
          setUserRole("customer"); // Default role
          // Attempt to create a Stripe customer if one doesn't exist
          const newStripeId = await ensureStripeCustomer(session.user);
          if (newStripeId) {
            setStripeCustomerId(newStripeId);
          }
        }
        
        // After successful login, redirect to the dashboard
        router.push("/dashboard");

      } else {
        throw new Error("Login failed, no session returned.");
      }
    } catch (error) {
      console.error("Login process failed:", error);
      throw error; // Re-throw the error to be handled by the UI
    }
  };

  const logout = async () => {
    // Check if it's a test session
    if (getLocalStorage("testSession")) {
      removeLocalStorage("testSession");
      setUser(null);
      setSessionToken(null);
      setUserRole(null);
      setStripeCustomerId(null);
      console.log("TEST SESSION LOGGED OUT");
      // Redirect to home and refresh the page to ensure clean state
      router.push("/");
      return;
    }

    // Standard Supabase logout
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
    } else {
      setUser(null);
      setSessionToken(null);
      setUserRole(null);
      setStripeCustomerId(null);
      console.log("Standard user logged out.");
      // Redirect to home and refresh the page to ensure clean state
      router.push("/");
    }
  };

  const value = {
    user,
    sessionToken,
    userRole,
    stripeCustomerId,
    login,
    logout,
    checkAuth,
    createTestSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 