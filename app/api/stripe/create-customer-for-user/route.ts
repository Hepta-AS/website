// app/api/stripe/create-customer-for-user/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  console.log("[API] /api/stripe/create-customer-for-user: Received POST request.");
  try {
    const { userId, email, name: requestedName } = await request.json();
    console.log("[API] /api/stripe/create-customer-for-user: Parsed request body:", { userId, email, requestedName });
    
    const supabase = createClient();

    // Get user data from Supabase Auth session
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.error("[API] /api/stripe/create-customer-for-user: Unauthorized. Supabase auth error or no user.", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify that the userId matches the authenticated user
    if (userId !== authUser.id) {
      console.error(`[API] /api/stripe/create-customer-for-user: User ID mismatch. Request: ${userId}, Authenticated: ${authUser.id}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Use requested name or fallback to user metadata
    const customerName = requestedName || authUser.user_metadata?.full_name || email.split("@")[0];
    console.log("[API] /api/stripe/create-customer-for-user: Creating Stripe customer with name:", customerName);

    // Create or retrieve Stripe customer
    const customer = await stripe.customers.create({
      email,
      name: customerName,
      metadata: {
        supabaseUserId: userId,
      },
    });
    console.log("[API] /api/stripe/create-customer-for-user: Stripe customer created successfully:", customer.id);

    // Store Stripe customer ID in Supabase
    console.log("[API] /api/stripe/create-customer-for-user: Updating 'profiles' table with Stripe customer ID for user:", userId);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: customer.id })
      .eq("user_id", userId);

    if (updateError) {
      console.error("[API] /api/stripe/create-customer-for-user: Error updating profile with Stripe customer ID:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    console.log("[API] /api/stripe/create-customer-for-user: Profile updated successfully. Responding with customer ID.");
    return NextResponse.json({ customerId: customer.id });
  } catch (error) {
    console.error("[API] /api/stripe/create-customer-for-user: An unexpected error occurred:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}