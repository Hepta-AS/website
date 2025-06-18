// Enhanced logging for app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize the Resend client with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.EMAIL_FROM || 'hey@hepta.biz';
const toEmail = process.env.EMAIL_TO || 'hey@hepta.biz';

export async function POST(request: NextRequest) {
  console.log('API: Contact endpoint hit with Resend');

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

    // --- Prepare Email Content ---
    const emailHtml = `
      <div>
        <h2>Ny henvendelse fra ${name}</h2>
        <p><b>Fornavn:</b> ${firstName || 'Ikke oppgitt'}</p>
        <p><b>Etternavn:</b> ${lastName || 'Ikke oppgitt'}</p>
        <p><b>E-post:</b> ${email}</p>
        <p><b>Telefon:</b> ${phone || 'Ikke oppgitt'}</p>
        <p><b>Selskap:</b> ${company || 'Ikke oppgitt'}</p>
        <p><b>Nettside:</b> ${website || 'Ikke oppgitt'}</p>
        <hr />
        <h3>Melding:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      </div>
    `;

    const confirmationHtml = `
      <div>
        <h1>Takk for din henvendelse, ${firstName || name}!</h1>
        <p>Vi har mottatt meldingen din og vil ta kontakt med deg så snart som mulig.</p>
        <p>Med vennlig hilsen,</p>
        <p><b>Hepta-teamet</b></p>
      </div>
    `;

    // --- Send Emails via Resend ---
    console.log(`API: Sending notification email to ${toEmail}`);

    // 1. Send notification email to yourself
    const notificationEmail = await resend.emails.send({
      from: `Hepta Kontaktskjema <${fromEmail}>`,
      to: toEmail,
      subject: `Ny henvendelse fra: ${name}`,
      html: emailHtml,
      replyTo: email,
    });
    console.log('API: Notification email sent:', notificationEmail);


    // 2. Send confirmation email to the user
    console.log(`API: Sending confirmation email to ${email}`);
    const confirmationEmail = await resend.emails.send({
      from: `Hepta <${fromEmail}>`,
      to: email,
      subject: 'Vi har mottatt din henvendelse',
      html: confirmationHtml,
    });
    console.log('API: Confirmation email sent:', confirmationEmail);


    console.log('API: Successfully sent both emails.');
    return NextResponse.json({
      success: true,
      message: 'Emails sent successfully.'
    }, { status: 200 });

  } catch (error) {
    console.error('API: Error processing request:', error);
    // In case of an error, check if it's a Resend specific error
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