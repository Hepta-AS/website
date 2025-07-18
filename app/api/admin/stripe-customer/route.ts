import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (!stripe) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 })
    }

    const supabase = createClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if the user is an admin (you'll need to implement this check)
    // For now, we'll allow any authenticated user to access this endpoint
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user's Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ customer: null })
    }

    // Get the customer from Stripe
    const customer = await stripe.customers.retrieve(profile.stripe_customer_id)

    if (customer.deleted) {
      return NextResponse.json({ error: "Customer has been deleted" }, { status: 404 })
    }

    return NextResponse.json({ customer })
  } catch (error) {
    console.error("Error fetching Stripe customer:", error)
    return NextResponse.json(
      { error: `Failed to fetch Stripe customer: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}

export async function POST() {
  const supabase = createClient()

  // ... existing code ...
}

