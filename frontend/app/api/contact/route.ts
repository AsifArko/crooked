import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { email, subject, message } = await request.json();

    // Validate input
    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create transporter (you'll need to configure this with your SMTP settings)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || "your-email@gmail.com",
        pass: process.env.SMTP_PASS || "your-app-password",
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER || "your-email@gmail.com",
      to: process.env.CONTACT_EMAIL || "contact@asifarko.com",
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Message Details:</h3>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #333;">From:</strong>
              <span style="color: #666; margin-left: 10px;">${email}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #333;">Subject:</strong>
              <span style="color: #666; margin-left: 10px;">${subject}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #333;">Message:</strong>
              <div style="color: #666; margin-top: 10px; line-height: 1.6; white-space: pre-wrap;">
                ${message}
              </div>
            </div>
          </div>
          
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 8px; font-size: 12px; color: #6c757d;">
            <p style="margin: 0;">
              This message was sent from the contact form on your website.
              <br>
              Timestamp: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

From: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from the contact form on your website.
Timestamp: ${new Date().toLocaleString()}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
