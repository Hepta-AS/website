import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase"
import Stripe from "stripe"
import { payInvoice } from "@/lib/stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const { invoiceId } = await request.json()
    const supabase = createClient()

    if (!invoiceId) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 })
    }

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Pay the invoice
    const invoice = await payInvoice(invoiceId)

    return NextResponse.json({ invoice })
  } catch (error) {
    console.error("Error paying invoice:", error)
    return NextResponse.json({ error: "Failed to pay invoice" }, { status: 500 })
  }
}

