import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn("EMAIL_USER or EMAIL_PASS not set — password reset emails will fail to send.");
}

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

const BRAND_RED = "#DA0B00";

export async function sendPasswordResetEmail(to: string, resetUrl: string, firstName?: string) {
    await transporter.sendMail({
        from: `"VillaBaas" <${EMAIL_USER}>`,
        to,
        subject: "Reset your VillaBaas password",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #EEEEEE;">
                <div style="background: #fff; border-radius: 16px; padding: 32px 28px; border: 1px solid #f0f0f0;">
                    <div style="margin-bottom: 24px;">
                        <span style="font-family: Georgia, serif; font-size: 1.2rem; font-weight: 700; color: #1C1C1C;">VillaBaas</span>
                    </div>
                    <h2 style="font-family: Georgia, serif; font-size: 1.3rem; color: #1C1C1C; margin-bottom: 12px;">
                        Reset your password
                    </h2>
                    <p style="font-size: 0.9rem; color: #666; line-height: 1.7; margin-bottom: 24px;">
                        Hi${firstName ? ` ${firstName}` : ""}, we received a request to reset your VillaBaas password.
                        This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.
                    </p>
                    <a href="${resetUrl}" style="display: inline-block; background: ${BRAND_RED}; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 0.85rem; font-weight: 600;">
                        Reset Password
                    </a>
                    <p style="font-size: 0.72rem; color: #aaa; margin-top: 24px; word-break: break-all;">
                        Or copy this link: ${resetUrl}
                    </p>
                </div>
            </div>
        `,
    });
}