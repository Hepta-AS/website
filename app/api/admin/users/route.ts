import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const supabase = createClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if the user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check for test session in headers
    const authHeader = req.headers.get("authorization")
    const isTestSession = authHeader && authHeader.startsWith("Bearer test_")

    // In development with test session, allow access
    if (process.env.NODE_ENV === "development" && isTestSession) {
      // For test sessions, return mock data
      return NextResponse.json({
        users: [
          {
            id: "test-user-id",
            email: "test@example.com",
            full_name: "Test User",
            stripe_customer_id: "cus_test_123456",
            created_at: new Date().toISOString(),
            role: "admin",
          },
          {
            id: "test-user-id-2",
            email: "customer@example.com",
            full_name: "Test Customer",
            stripe_customer_id: null,
            created_at: new Date().toISOString(),
            role: "customer",
          },
        ],
      })
    }

    // Check if the user has admin role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (profileError) {
      console.error("Error fetching user profile:", profileError)
      return NextResponse.json({ error: "Failed to verify admin status" }, { status: 500 })
    }

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    // Fetch users from Supabase
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, stripe_customer_id, created_at, role")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
      throw error
    }

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error in admin/users API:", error)
    return NextResponse.json(
      { error: `Failed to fetch users: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}

