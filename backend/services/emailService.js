const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

// Verify SMTP connection when server starts
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP Verification Failed:");
    console.error(error);
  } else {
    console.log("✅ SMTP Ready");
  }
});

// Send verification OTP
const sendVerificationOtp = async ({ to, name, otp }) => {
  try {
    console.log(`📧 Sending verification OTP to ${to}`);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Your AI Interview Prep Verification Code",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#2563eb;">Verify Your Email</h2>

          <p>Hi <strong>${name}</strong>,</p>

          <p>
            Use this OTP to verify your account.
            It expires in <strong>10 minutes</strong>.
          </p>

          <div style="margin:28px 0;text-align:center;">
            <span
              style="
                display:inline-block;
                font-size:2.5rem;
                font-weight:900;
                letter-spacing:.35em;
                color:#2563eb;
                background:#eff6ff;
                border:2px dashed #93c5fd;
                border-radius:12px;
                padding:16px 32px;
              ">
              ${otp}
            </span>
          </div>

          <p style="color:#6b7280;font-size:.85rem;">
            If you didn't create an account, simply ignore this email.
          </p>
        </div>
      `,
    });

    console.log("✅ Verification email sent");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Verification email failed:");
    console.error(error);
    throw error;
  }
};

// Send password reset OTP
const sendPasswordResetOtp = async ({ to, name, otp }) => {
  try {
    console.log(`📧 Sending password reset OTP to ${to}`);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Your Password Reset Code - AI Interview Prep",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#dc2626;">Reset Your Password</h2>

          <p>Hi <strong>${name}</strong>,</p>

          <p>
            Use this OTP to reset your password.
            It expires in <strong>15 minutes</strong>.
          </p>

          <div style="margin:28px 0;text-align:center;">
            <span
              style="
                display:inline-block;
                font-size:2.5rem;
                font-weight:900;
                letter-spacing:.35em;
                color:#dc2626;
                background:#fef2f2;
                border:2px dashed #fca5a5;
                border-radius:12px;
                padding:16px 32px;
              ">
              ${otp}
            </span>
          </div>

          <p style="color:#6b7280;font-size:.85rem;">
            If you didn't request this password reset, please ignore this email.
          </p>
        </div>
      `,
    });

    console.log("✅ Password reset email sent");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Password reset email failed:");
    console.error(error);
    throw error;
  }
};

module.exports = {
  sendVerificationOtp,
  sendPasswordResetOtp,
};