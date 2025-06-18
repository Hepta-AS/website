// Enhanced logging for app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { NotificationEmail } from '@/components/emails/NotificationEmail';
import { ConfirmationEmail } from '@/components/emails/ConfirmationEmail';

// Initialize the Resend client with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev'; // Default for safety, should be set in .env
const toEmail = process.env.EMAIL_TO || 'delivered@resend.dev'; // Default for safety, should be set in .env

export async function POST(request: NextRequest) {
  console.log('API: Contact endpoint hit with Resend (React Templates)');

  try {
    const body = await request.json();
    console.log('API: Request body parsed:', body);

    const {
      name,
      email,
      message,
      firstName,
      lastName,
      company,
      website,
      phone
    } = body;

    // --- Basic Validation ---
    if (!name || !email || !message) {
      console.log('API: Missing required fields');
      return NextResponse.json({
        error: 'Name, email, and message are required fields.',
        success: false
      }, { status: 400 });
    }

    // --- Send Emails via Resend ---
    console.log(`API: Sending notification email to ${toEmail}`);

    // 1. Send notification email to yourself
    const notificationEmail = await resend.emails.send({
      from: `Hepta Kontaktskjema <${fromEmail}>`,
      to: toEmail,
      subject: `Ny henvendelse fra: ${name}`,
      replyTo: email,
      react: NotificationEmail({
        name,
        email,
        phone,
        company,
        website,
        message,
        firstName,
        lastName,
      })
    });
    console.log('API: Notification email sent:', notificationEmail);


    // 2. Send confirmation email to the user
    console.log(`API: Sending confirmation email to ${email}`);
    const confirmationEmail = await resend.emails.send({
      from: `Hepta <${fromEmail}>`,
      to: email,
      subject: 'Vi har mottatt din henvendelse',
      react: ConfirmationEmail({ name: firstName || name })
    });
    console.log('API: Confirmation email sent:', confirmationEmail);


    console.log('API: Successfully sent both emails.');
    return NextResponse.json({
      success: true,
      message: 'Emails sent successfully.'
    }, { status: 200 });

  } catch (error) {
    console.error('API: Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({
      error: 'Failed to send email.',
      details: errorMessage,
      success: false
    }, { status: 500 });
  }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}