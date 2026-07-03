const nodemailer = require('nodemailer');

console.log('📧 Email Service Loading...');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS exists:', !!process.env.SMTP_PASS);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true,
  logger: true
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Verify Failed:', JSON.stringify(error));
  } else {
    console.log('✅ SMTP Ready to send emails');
  }
});

const sendVerificationOtp = async ({ to, name, otp }) => {
  console.log('📤 Sending verification OTP...');
  console.log('To:', to);
  console.log('OTP:', otp);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Your AI Interview Prep Verification Code',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;
                  padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#2563eb;">Verify Your Email</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your OTP code — expires in <strong>10 minutes</strong>.</p>
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
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent! Message ID:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ OTP email FAILED!');
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    console.error('Full error:', JSON.stringify(err));
    throw err;
  }
};

const sendPasswordResetOtp = async ({ to, name, otp }) => {
  console.log('📤 Sending reset OTP to:', to);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Your Password Reset Code — AI Interview Prep',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;
                  padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#dc2626;">Reset Your Password</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your OTP code — expires in <strong>15 minutes</strong>.</p>
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
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Reset OTP email sent! Message ID:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ Reset OTP email FAILED!');
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    console.error('Full error:', JSON.stringify(err));
    throw err;
  }
};

module.exports = { sendVerificationOtp, sendPasswordResetOtp };