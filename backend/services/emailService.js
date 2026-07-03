const Mailjet = require('node-mailjet');

console.log('📧 Email Service Loading — using Mailjet');
console.log('MJ_APIKEY_PUBLIC exists:', !!process.env.MJ_APIKEY_PUBLIC);
console.log('MJ_APIKEY_PRIVATE exists:', !!process.env.MJ_APIKEY_PRIVATE);

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS || 'aiinterviewprepration@gmail.com';
const FROM_NAME = 'AI Interview Prep';

const sendVerificationOtp = async ({ to, name, otp }) => {
  console.log('📤 Sending verification OTP via Mailjet to:', to);

  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: FROM_EMAIL,
            Name: FROM_NAME
          },
          To: [
            {
              Email: to,
              Name: name
            }
          ],
          Subject: 'Your Verification Code — AI Interview Prep',
          HTMLPart: `
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
        }
      ]
    });

    console.log('✅ Verification OTP sent! Status:', result.response.status);
    return result;
  } catch (err) {
    console.error('❌ Mailjet error:', err.statusCode, err.message);
    throw new Error(err.message || 'Failed to send verification email');
  }
};

const sendPasswordResetOtp = async ({ to, name, otp }) => {
  console.log('📤 Sending reset OTP via Mailjet to:', to);

  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: FROM_EMAIL,
            Name: FROM_NAME
          },
          To: [
            {
              Email: to,
              Name: name
            }
          ],
          Subject: 'Your Password Reset Code — AI Interview Prep',
          HTMLPart: `
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
        }
      ]
    });

    console.log('✅ Reset OTP sent! Status:', result.response.status);
    return result;
  } catch (err) {
    console.error('❌ Mailjet error:', err.statusCode, err.message);
    throw new Error(err.message || 'Failed to send reset email');
  }
};

module.exports = { sendVerificationOtp, sendPasswordResetOtp };