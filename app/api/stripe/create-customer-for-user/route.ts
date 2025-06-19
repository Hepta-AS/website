// app/api/stripe/create-customer-for-user/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { userId, email, name: requestedName } = await request.json();
    const supabase = createClient();

    // Get user data from Supabase Auth session
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify that the userId matches the authenticated user
    if (userId !== authUser.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use requested name or fallback to user metadata
    const customerName = requestedName || authUser.user_metadata?.full_name || email.split("@")[0];

    // Create or retrieve Stripe customer
    const customer = await stripe.customers.create({
      email,
      name: customerName,
      metadata: {
        supabaseUserId: userId,
      },
    });

    // Store Stripe customer ID in Supabase
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: customer.id })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error updating profile with Stripe customer ID:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ customerId: customer.id });
  } catch (error) {
    console.error("Error in create-customer-for-user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}