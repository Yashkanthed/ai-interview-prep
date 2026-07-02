const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify SMTP connection when the server starts
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Error:", error);
  } else {
    console.log("✅ SMTP Ready");
  }
});

// Send 6-digit OTP for email verification
const sendVerificationOtp = async ({ to, name, otp }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Your AI Interview Prep Verification Code',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#2563eb;">Verify Your Email</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Use this OTP to verify your account. It expires in <strong>10 minutes</strong>.</p>

        <div style="margin:28px 0;text-align:center;">
          <span style="display:inline-block;font-size:2.5rem;font-weight:900;letter-spacing:0.35em;color:#2563eb;background:#eff6ff;border:2px dashed #93c5fd;border-radius:12px;padding:16px 32px;">
            ${otp}
          </span>
        </div>

        <p style="color:#6b7280;font-size:0.85rem;">
          If you did not create an account, please ignore this email.
        </p>
      </div>
    `
  });
};

// Send 6-digit OTP for password reset
const sendPasswordResetOtp = async ({ to, name, otp }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Your Password Reset Code - AI Interview Prep',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#dc2626;">Reset Your Password</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Use this OTP to reset your password. It expires in <strong>15 minutes</strong>.</p>

        <div style="margin:28px 0;text-align:center;">
          <span style="display:inline-block;font-size:2.5rem;font-weight:900;letter-spacing:0.35em;color:#dc2626;background:#fef2f2;border:2px dashed #fca5a5;border-radius:12px;padding:16px 32px;">
            ${otp}
          </span>
        </div>

        <p style="color:#6b7280;font-size:0.85rem;">
          If you did not request this password reset, please ignore this email.
        </p>
      </div>
    `
  });
};

module.exports = {
  sendVerificationOtp,
  sendPasswordResetOtp
};