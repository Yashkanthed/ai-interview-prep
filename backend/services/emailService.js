const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

console.log('📧 Email Service Loading — using Resend');
console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);

const sendVerificationOtp = async ({ to, name, otp }) => {
  console.log('📤 Sending verification OTP via Resend to:', to);

  const { data, error } = await resend.emails.send({
    from: 'AI Interview Prep <onboarding@resend.dev>',
    to,
    subject: 'Your Verification Code — AI Interview Prep',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;
                  padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#2563eb;">Verify Your Email</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Use this OTP to verify your account. Expires in <strong>10 minutes</strong>.</p>
        <div style="margin:28px 0;text-align:center;">
          <span style="
            display:inline-block;
            font-size:2.5rem;
            font-weight:900;
            letter-spacing:0.35em;
            color:#2563eb;
            background:#eff6ff;
            border:2px dashed #93c5fd;
            border-radius:12px;
            padding:16px 32px;
          ">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:0.85rem;">
          If you did not create this account, ignore this email.
        </p>
      </div>
    `
  });

  if (error) {
    console.error('❌ Resend error:', JSON.stringify(error));
    throw new Error(error.message);
  }

  console.log('✅ Verification OTP sent successfully! ID:', data.id);
};

const sendPasswordResetOtp = async ({ to, name, otp }) => {
  console.log('📤 Sending reset OTP via Resend to:', to);

  const { data, error } = await resend.emails.send({
    from: 'AI Interview Prep <onboarding@resend.dev>',
    to,
    subject: 'Your Password Reset Code — AI Interview Prep',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;
                  padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#dc2626;">Reset Your Password</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Use this OTP to reset your password. Expires in <strong>15 minutes</strong>.</p>
        <div style="margin:28px 0;text-align:center;">
          <span style="
            display:inline-block;
            font-size:2.5rem;
            font-weight:900;
            letter-spacing:0.35em;
            color:#dc2626;
            background:#fef2f2;
            border:2px dashed #fca5a5;
            border-radius:12px;
            padding:16px 32px;
          ">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:0.85rem;">
          If you did not request this, ignore this email.
        </p>
      </div>
    `
  });

  if (error) {
    console.error('❌ Resend error:', JSON.stringify(error));
    throw new Error(error.message);
  }

  console.log('✅ Reset OTP sent successfully! ID:', data.id);
};

module.exports = { sendVerificationOtp, sendPasswordResetOtp };