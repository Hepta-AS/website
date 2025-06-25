// Enhanced logging for app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { NotificationEmail } from '@/components/emails/NotificationEmail';
import { ConfirmationEmail } from '@/components/emails/ConfirmationEmail';

// We'll lazily initialize Resend inside the handler to avoid errors at build time when env vars may be missing.
// Use EMAIL_USER for the 'from' address as it's a valid email. EMAIL_FROM is used as the 'from name'.
const fromEmail = process.env.EMAIL_USER || 'onboarding@resend.dev';
const notificationRecipientEmail = process.env.EMAIL_USER || 'delivered@resend.dev'; // Your notification email address

export async function POST(request: NextRequest) {
  try {
    // Initialize the Resend client with the API key from environment variables.
    // If the key is missing, we'll log a warning and return a failure response.
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY environment variable is not set. Skipping email send.');
    }
    const resend = new Resend(apiKey || 'test_key');

    const body = await request.json();
    const { name, email, message, firstName, lastName, company, website, phone } = body;

    // Basic Validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required fields.' }, { status: 400 });
    }

    // Send notification email to yourself
    const { data: notificationData, error: notificationError } = await resend.emails.send({
      from: `Hepta Kontaktskjema <${fromEmail}>`,
      to: notificationRecipientEmail,
      subject: `Ny henvendelse fra: ${name}`,
      replyTo: email,
      react: NotificationEmail({ name, email, phone, company, website, message, firstName, lastName })
    });

    if (notificationError) {
      console.error('Resend notification email failed:', notificationError);
      return NextResponse.json({ error: 'Failed to send notification email.', details: notificationError }, { status: 500 });
    }

    // Send confirmation email to the user
    const { error: confirmationError } = await resend.emails.send({
      from: `Hepta <${fromEmail}>`,
      to: email,
      subject: 'Vi har mottatt din henvendelse',
      react: ConfirmationEmail({ name: firstName || name })
    });

    if (confirmationError) {
      // Log this error but don't block the success response, as the primary email was sent.
      console.error('Resend confirmation email failed:', confirmationError);
    }
    
    console.log(`Successfully sent contact form email for ${email} with ID ${notificationData?.id}`);

    return NextResponse.json({ success: true, message: 'Emails sent successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Contact API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Failed to process request.', details: errorMessage }, { status: 500 });
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