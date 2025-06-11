import { cookies } from "next/headers"
import { createClient } from "./supabase"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

/**
 * Gets or creates a Stripe customer ID for a user
 */
export async function getOrCreateCustomerId(userId: string, email?: string, name?: string) {
  const supabase = createClient()

  // Try to get the existing customer ID
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single()

  if (profileError && profileError.code !== "PGRST116") {
    console.error("Error fetching profile:", profileError)
    throw profileError
  }

  // If the user already has a customer ID, return it
  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id
  }

  // If no customer ID exists and we have an email, create a new customer
  if (email) {
    const customer = await createCustomer(email, name)

    // Save the customer ID to the user's profile
    const { error: updateError } = await supabase.from("profiles").upsert({
      id: userId,
      stripe_customer_id: customer.id,
      updated_at: new Date().toISOString(),
    })

    if (updateError) {
      console.error("Error saving customer ID to profile:", updateError)
      throw updateError
    }

    return customer.id
  }

  throw new Error("No customer ID found and not enough information to create one")
}

/**
 * Gets the user's email from Supabase
 */
export async function getUserEmail(userId: string) {
  const supabase = createClient()

  const { data: user, error } = await supabase.auth.admin.getUserById(userId)

  if (error) {
    console.error("Error fetching user:", error)
    throw error
  }

  return user?.user?.email
}

/**
 * Creates a new Stripe customer
 */
export async function createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    })
    return customer
  } catch (error) {
    console.error("Error creating Stripe customer:", error)
    throw error
  }
}

