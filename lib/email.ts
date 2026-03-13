// lib/email.ts
import sgMail from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY is not set. Email functionality will be disabled.");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@pandahotel.com";
const APP_NAME = "PandaStay";
const APP_URL = process.env.BASE_URL || "http://localhost:3000";

/* ---------------- EMAIL TEMPLATES ---------------- */

function getBaseTemplate(content: string, title: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #e11d48 0%, #be185d 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">${APP_NAME}</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                This is an automated email. Please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendAccountVerificationEmail(
  email: string,
  name: string
) {
  const content = `
    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px;">Welcome to ${APP_NAME}! 🎉</h2>
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi ${name},
    </p>
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Your account has been registered successfully!
    </p>
    <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Thank you for joining ${APP_NAME}. We're excited to have you on board and look forward to helping you find your perfect stay.
    </p>
    <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 8px; padding: 24px; margin: 30px 0;">
      <p style="margin: 0; color: #166534; font-size: 16px; font-weight: 600;">
        ✓ Your account is now active and ready to use!
      </p>
    </div>
    <p style="margin: 30px 0 0 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      You can now start exploring amazing properties and book your next adventure. If you have any questions, feel free to contact our support team.
    </p>
    <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      Happy travels! ✈️
    </p>
  `;

  try {
    await sgMail.send({
      to: email,
      from: FROM_EMAIL,
      subject: `Welcome to ${APP_NAME} - Account Registered Successfully`,
      html: getBaseTemplate(content, "Account Registered"),
    });
    console.log(`✅ Registration confirmation email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send registration email:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${resetToken}`;
  
  const content = `
    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px;">Reset Your Password</h2>
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi ${name},
    </p>
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      We received a request to reset your password for your ${APP_NAME} account.
    </p>
    <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Click the button below to reset your password:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 14px 32px; background-color: #e11d48; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Reset Password
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px; word-break: break-all;">
      ${resetUrl}
    </p>
    <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
    </p>
    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 16px; margin: 30px 0;">
      <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 600;">
        ⚠️ Security Notice
      </p>
      <p style="margin: 10px 0 0 0; color: #991b1b; font-size: 13px; line-height: 1.5;">
        If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
      </p>
    </div>
  `;

  try {
    await sgMail.send({
      to: email,
      from: FROM_EMAIL,
      subject: `Reset Your ${APP_NAME} Password`,
      html: getBaseTemplate(content, "Reset Password"),
    });
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error);
    throw error;
  }
}

export async function sendBookingConfirmationEmail(
  email: string,
  name: string,
  booking: {
    id: string;
    listingTitle: string;
    location: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    guests: number;
  }
) {
  const nights = Math.ceil(
    (booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const checkIn = booking.startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const checkOut = booking.endDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px;">Booking Confirmed! 🎉</h2>
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi ${name},
    </p>
    <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Your booking has been confirmed! We're looking forward to hosting you.
    </p>
    
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 30px 0;">
      <h3 style="margin: 0 0 20px 0; color: #111827; font-size: 20px;">Booking Details</h3>
      
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px;">Property:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${booking.listingTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Location:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px;">${booking.location}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Check-in:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px;">${checkIn}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Check-out:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px;">${checkOut}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Nights:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px;">${nights} night${nights > 1 ? "s" : ""}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Guests:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px;">${booking.guests} guest${booking.guests > 1 ? "s" : ""}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Booking ID:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">${booking.id.slice(-8).toUpperCase()}</td>
        </tr>
      </table>
    </div>
    
    <p style="margin: 30px 0 0 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      We'll send you a reminder email closer to your check-in date. If you have any questions, feel free to contact our support team.
    </p>
    <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      You can view and manage your booking in your account dashboard.
    </p>
  `;

  try {
    await sgMail.send({
      to: email,
      from: FROM_EMAIL,
      subject: `Booking Confirmed - ${booking.listingTitle}`,
      html: getBaseTemplate(content, "Booking Confirmed"),
    });
    console.log(`✅ Booking confirmation email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send booking confirmation email:", error);
    throw error;
  }
}

export async function sendBookingCancellationEmail(
  email: string,
  name: string,
  booking: {
    id: string;
    listingTitle: string;
    location: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    refundAmount?: number;
  }
) {
  const checkIn = booking.startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px;">Booking Cancelled</h2>
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi ${name},
    </p>
    <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Your booking has been successfully cancelled. We're sorry to see you go!
    </p>
    
    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 24px; margin: 30px 0;">
      <h3 style="margin: 0 0 20px 0; color: #111827; font-size: 20px;">Cancelled Booking Details</h3>
      
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px;">Property:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${booking.listingTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Location:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px;">${booking.location}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Check-in Date:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px;">${checkIn}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Booking ID:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">${booking.id.slice(-8).toUpperCase()}</td>
        </tr>
      </table>
    </div>
    
    ${booking.refundAmount ? `
    <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 8px; padding: 24px; margin: 30px 0;">
      <p style="margin: 0 0 10px 0; color: #166534; font-size: 14px; font-weight: 600;">Refund Information</p>
      <p style="margin: 0; color: #166534; font-size: 16px;">
        A refund of <strong>$${booking.refundAmount.toFixed(2)}</strong> will be processed to your original payment method within 5-10 business days.
      </p>
    </div>
    ` : ""}
    
    <p style="margin: 30px 0 0 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      We hope to welcome you back in the future. If you have any questions about your cancellation or refund, please contact our support team.
    </p>
  `;

  try {
    await sgMail.send({
      to: email,
      from: FROM_EMAIL,
      subject: `Booking Cancelled - ${booking.listingTitle}`,
      html: getBaseTemplate(content, "Booking Cancelled"),
    });
    console.log(`✅ Booking cancellation email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send cancellation email:", error);
    throw error;
  }
}

export async function sendPaymentReceiptEmail(
  email: string,
  name: string,
  payment: {
    id: string;
    transactionId: string | null;
    amount: number;
    method: string;
    status: string;
    createdAt: Date;
    booking: {
      listingTitle: string;
      location: string;
      startDate: Date;
      endDate: Date;
    };
  }
) {
  const checkIn = payment.booking.startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const checkOut = payment.booking.endDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const paymentDate = payment.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px;">Payment Receipt 💳</h2>
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi ${name},
    </p>
    <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Thank you for your payment. Here's your receipt for your records.
    </p>
    
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 30px 0;">
      <h3 style="margin: 0 0 20px 0; color: #111827; font-size: 20px;">Payment Details</h3>
      
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px;">Amount Paid:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 18px; font-weight: 700;">$${payment.amount.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Method:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px;">${payment.method}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status:</td>
          <td style="padding: 8px 0; color: #22c55e; font-size: 14px; font-weight: 600;">${payment.status}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Transaction ID:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">${payment.transactionId || payment.id.slice(-8).toUpperCase()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Date:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px;">${paymentDate}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 30px 0;">
      <h3 style="margin: 0 0 20px 0; color: #111827; font-size: 20px;">Booking Information</h3>
      
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px;">Property:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${payment.booking.listingTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Location:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px;">${payment.booking.location}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Check-in:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px;">${checkIn}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Check-out:</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px;">${checkOut}</td>
        </tr>
      </table>
    </div>
    
    <p style="margin: 30px 0 0 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Please keep this receipt for your records. If you have any questions about your payment, please contact our support team.
    </p>
  `;

  try {
    await sgMail.send({
      to: email,
      from: FROM_EMAIL,
      subject: `Payment Receipt - ${payment.booking.listingTitle}`,
      html: getBaseTemplate(content, "Payment Receipt"),
    });
    console.log(`✅ Payment receipt email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send payment receipt email:", error);
    throw error;
  }
}
