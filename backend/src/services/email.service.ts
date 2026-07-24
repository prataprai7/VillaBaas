import nodemailer from "nodemailer";
import { IBooking } from "../models/booking.model";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

function formatDate(date: Date): string {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];
    const d = new Date(date);
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatPrice(amount: number): string {
    return `NPR ${amount.toLocaleString("en-NP")}`;
}

export async function sendBookingConfirmationEmail(
    toEmail: string,
    userName: string,
    booking: IBooking
): Promise<void> {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booking Confirmation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f4f4f4; font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: #DA0B00; padding: 36px 40px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 6px; }
    .logo-row { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 16px; }
    .logo-icon { width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; }
    .logo-text { color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 1px; }
    .body { padding: 36px 40px; }
    .greeting { font-size: 16px; color: #333; margin-bottom: 20px; line-height: 1.6; }
    .success-badge { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 20px; margin-bottom: 28px; display: flex; align-items: center; gap: 10px; }
    .success-badge .dot { width: 10px; height: 10px; background: #22c55e; border-radius: 50%; flex-shrink: 0; }
    .success-badge p { color: #15803d; font-size: 14px; font-weight: 600; }
    .section-title { font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #888; margin-bottom: 14px; }
    .villa-card { background: #fafafa; border: 1px solid #ebebeb; border-radius: 10px; padding: 20px; margin-bottom: 24px; }
    .villa-name { font-size: 20px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
    .villa-location { font-size: 13px; color: #888; margin-bottom: 0; }
    .divider { height: 1px; background: #ebebeb; margin: 20px 0; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .detail-item { background: #fafafa; border: 1px solid #ebebeb; border-radius: 8px; padding: 14px 16px; }
    .detail-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #aaa; margin-bottom: 4px; }
    .detail-value { font-size: 14px; font-weight: 600; color: #1a1a1a; }
    .price-box { background: #fff5f5; border: 1px solid #fecaca; border-radius: 10px; padding: 20px; margin-bottom: 24px; }
    .price-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .price-row:last-child { margin-bottom: 0; }
    .price-label { font-size: 13px; color: #666; }
    .price-value { font-size: 13px; color: #1a1a1a; font-weight: 500; }
    .price-total-label { font-size: 15px; font-weight: 700; color: #1a1a1a; }
    .price-total-value { font-size: 18px; font-weight: 700; color: #DA0B00; }
    .booking-id { background: #fff8f0; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .booking-id-label { font-size: 12px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
    .booking-id-value { font-size: 13px; font-weight: 700; color: #c2410c; font-family: monospace; }
    .payment-badge { display: inline-block; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600; color: #15803d; }
    .info-box { background: #f8faff; border: 1px solid #dbeafe; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; }
    .info-box p { font-size: 13px; color: #555; line-height: 1.7; }
    .footer { background: #1a1a1a; padding: 28px 40px; text-align: center; }
    .footer p { font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.8; }
    .footer .brand { color: #DA0B00; font-weight: 700; font-size: 14px; margin-bottom: 6px; }
  </style>
</head>
<body>
  <div class="wrapper">

    <!-- Header -->
    <div class="header">
      <div class="logo-row">
        <span class="logo-text">VillaBaas</span>
      </div>
      <h1>Booking Confirmed</h1>
      <p>Your villa reservation is confirmed and ready</p>
    </div>

    <!-- Body -->
    <div class="body">

      <p class="greeting">
        Dear <strong>${userName}</strong>,<br/><br/>
        Thank you for choosing VillaBaas. Your booking has been confirmed and payment has been received successfully. Please find your booking details below.
      </p>

      <!-- Success badge -->
      <div class="success-badge">
        <div class="dot"></div>
        <p>Payment received and booking confirmed</p>
      </div>

      <!-- Booking ID -->
      <div class="booking-id">
        <span class="booking-id-label">Booking Reference</span>
        <span class="booking-id-value">#${booking._id.toString().slice(-8).toUpperCase()}</span>
      </div>

      <!-- Villa info -->
      <p class="section-title">Villa Details</p>
      <div class="villa-card">
        <p class="villa-name">${booking.villaName}</p>
        <p class="villa-location">${booking.location}</p>
        <div class="divider"></div>
        <p style="font-size: 13px; color: #888;">${booking.villaType}</p>
      </div>

      <!-- Stay details -->
      <p class="section-title">Stay Details</p>
      <div class="detail-grid">
        <div class="detail-item">
          <p class="detail-label">Check-in</p>
          <p class="detail-value">${formatDate(booking.checkIn)}</p>
        </div>
        <div class="detail-item">
          <p class="detail-label">Check-out</p>
          <p class="detail-value">${formatDate(booking.checkOut)}</p>
        </div>
        <div class="detail-item">
          <p class="detail-label">Duration</p>
          <p class="detail-value">${booking.nights} night${booking.nights > 1 ? "s" : ""}</p>
        </div>
        <div class="detail-item">
          <p class="detail-label">Guests</p>
          <p class="detail-value">${booking.guests} guest${booking.guests > 1 ? "s" : ""}</p>
        </div>
      </div>

      <!-- Price breakdown -->
      <p class="section-title">Price Breakdown</p>
      <div class="price-box">
        <div class="price-row">
          <span class="price-label">${formatPrice(booking.pricePerNight)} x ${booking.nights} night${booking.nights > 1 ? "s" : ""}</span>
          <span class="price-value">${formatPrice(booking.totalPrice)}</span>
        </div>
        <div class="divider" style="margin: 12px 0;"></div>
        <div class="price-row">
          <span class="price-total-label">Total Paid</span>
          <span class="price-total-value">${formatPrice(booking.totalPrice)}</span>
        </div>
        <div style="margin-top: 10px;">
          <span class="payment-badge">Paid via ${booking.paymentMethod || "Online Payment"}</span>
        </div>
      </div>

      <!-- Important info -->
      <div class="info-box">
        <p>
          <strong>Important:</strong> Please present this email or your booking reference at check-in. 
          Standard check-in time is 2:00 PM and check-out is 11:00 AM. 
          If you need to make any changes to your booking, please contact us at least 48 hours in advance.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="brand">VillaBaas</p>
      <p>
        Luxury Villa Booking Platform — Nepal<br/>
        This is an automated confirmation email. Please do not reply to this email.<br/>
        &copy; ${new Date().getFullYear()} VillaBaas. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
    `;

    await transporter.sendMail({
        from: `"VillaBaas" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `Booking Confirmed — ${booking.villaName} | VillaBaas`,
        html,
    });
}

export async function sendBookingCancellationEmail(
    toEmail: string,
    userName: string,
    booking: IBooking
): Promise<void> {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f4f4f4; font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: #1a1a1a; padding: 36px 40px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 24px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.6); font-size: 14px; margin-top: 6px; }
    .logo-text { color: #DA0B00; font-size: 20px; font-weight: 700; display: block; margin-bottom: 14px; }
    .body { padding: 36px 40px; }
    .greeting { font-size: 15px; color: #333; margin-bottom: 20px; line-height: 1.7; }
    .cancel-badge { background: #fff5f5; border: 1px solid #fecaca; border-radius: 8px; padding: 14px 20px; margin-bottom: 24px; }
    .cancel-badge p { color: #dc2626; font-size: 14px; font-weight: 600; }
    .detail-box { background: #fafafa; border: 1px solid #ebebeb; border-radius: 10px; padding: 20px; margin-bottom: 20px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
    .row:last-child { border-bottom: none; }
    .row-label { font-size: 13px; color: #888; }
    .row-value { font-size: 13px; font-weight: 600; color: #1a1a1a; }
    .footer { background: #1a1a1a; padding: 24px 40px; text-align: center; }
    .footer p { font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <span class="logo-text">VillaBaas</span>
      <h1>Booking Cancelled</h1>
      <p>Your booking has been cancelled as requested</p>
    </div>
    <div class="body">
      <p class="greeting">
        Dear <strong>${userName}</strong>,<br/><br/>
        Your booking has been successfully cancelled. We hope to welcome you to VillaBaas in the future.
      </p>
      <div class="cancel-badge">
        <p>Booking #${booking._id.toString().slice(-8).toUpperCase()} has been cancelled</p>
      </div>
      <div class="detail-box">
        <div class="row">
          <span class="row-label">Villa</span>
          <span class="row-value">${booking.villaName}</span>
        </div>
        <div class="row">
          <span class="row-label">Location</span>
          <span class="row-value">${booking.location}</span>
        </div>
        <div class="row">
          <span class="row-label">Check-in</span>
          <span class="row-value">${formatDate(booking.checkIn)}</span>
        </div>
        <div class="row">
          <span class="row-label">Check-out</span>
          <span class="row-value">${formatDate(booking.checkOut)}</span>
        </div>
        <div class="row">
          <span class="row-label">Guests</span>
          <span class="row-value">${booking.guests}</span>
        </div>
      </div>
      <p style="font-size: 13px; color: #888; line-height: 1.7;">
        If you did not request this cancellation or have any questions, please contact our support team immediately.
      </p>
    </div>
    <div class="footer">
      <p>VillaBaas — Luxury Villa Booking Platform, Nepal<br/>
      &copy; ${new Date().getFullYear()} VillaBaas. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
        from: `"VillaBaas" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `Booking Cancelled — ${booking.villaName} | VillaBaas`,
        html,
    });
}