const sgMail = require('@sendgrid/mail');

console.log('📧 Email Service Loading — using SendGrid');
console.log('SENDGRID_API_KEY exists:', !!process.env.SENDGRID_API_KEY);
console.log('EMAIL_FROM_ADDRESS:', process.env.EMAIL_FROM_ADDRESS);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS;
const FROM_NAME = 'AI Interview Prep';

const sendVerificationOtp = async ({ to, name, otp }) => {
  console.log('📤 Sending verification OTP to:', to);

  const msg = {
    to,
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME
    },
    subject: `${otp} is your AI Interview Prep verification code`,
    text: `
Hi ${name},

Your verification code is: ${otp}

This code expires in 10 minutes.

If you did not create this account, ignore this email.

Thanks,
AI Interview Prep Team
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;
                      border:1px solid #e5e7eb;">
          <tr>
            <td style="background:#2563eb;padding:24px 32px;
                       text-align:center;border-radius:12px 12px 0 0;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;
                         font-weight:700;">
                AI Interview Prep
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;">
              <h2 style="color:#111827;margin:0 0 16px;font-size:20px;">
                Verify your email address
              </h2>
              <p style="color:#6b7280;margin:0 0 28px;
                        line-height:1.7;font-size:15px;">
                Hi <strong style="color:#111827;">${name}</strong>,
                welcome to AI Interview Prep! Enter the code below
                to verify your email. Expires in
                <strong>10 minutes</strong>.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 28px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="
                          background:#eff6ff;
                          border:2px solid #93c5fd;
                          border-radius:12px;
                          padding:20px 44px;
                          font-size:40px;
                          font-weight:900;
                          letter-spacing:14px;
                          color:#2563eb;
                          text-align:center;
                        ">
                          ${otp}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="color:#9ca3af;font-size:13px;
                        margin:0;line-height:1.6;">
                If you did not create an AI Interview Prep account,
                you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:16px 32px;
                       border-top:1px solid #e5e7eb;text-align:center;
                       border-radius:0 0 12px 12px;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                AI Interview Prep · Practice smarter, get hired faster
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  };

  try {
    const response = await sgMail.send(msg);
    console.log('✅ Verification OTP sent successfully!');
    console.log('Status code:', response[0].statusCode);
    return response;
  } catch (err) {
    console.error('❌ SendGrid error!');
    console.error('Message:', err.message);
    if (err.response) {
      console.error('Body:', JSON.stringify(err.response.body));
    }
    throw new Error(err.message);
  }
};

const sendPasswordResetOtp = async ({ to, name, otp }) => {
  console.log('📤 Sending reset OTP to:', to);

  const msg = {
    to,
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME
    },
    subject: `${otp} is your AI Interview Prep password reset code`,
    text: `
Hi ${name},

Your password reset code is: ${otp}

This code expires in 15 minutes.

If you did not request a password reset, ignore this email.

Thanks,
AI Interview Prep Team
    `,
    html: `
    
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;
                      border:1px solid #e5e7eb;">
          <tr>
            <td style="background:#dc2626;padding:24px 32px;
                       text-align:center;border-radius:12px 12px 0 0;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;
                         font-weight:700;">
                AI Interview Prep
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;">
              <h2 style="color:#111827;margin:0 0 16px;font-size:20px;">
                Reset your password
              </h2>
              <p style="color:#6b7280;margin:0 0 28px;
                        line-height:1.7;font-size:15px;">
                Hi <strong style="color:#111827;">${name}</strong>,
                we received a request to reset your password.
                Enter the code below. Expires in
                <strong>15 minutes</strong>.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 28px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="
                          background:#fef2f2;
                          border:2px solid #fca5a5;
                          border-radius:12px;
                          padding:20px 44px;
                          font-size:40px;
                          font-weight:900;
                          letter-spacing:14px;
                          color:#dc2626;
                          text-align:center;
                        ">
                          ${otp}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="color:#9ca3af;font-size:13px;
                        margin:0;line-height:1.6;">
                If you did not request a password reset,
                ignore this email. Your password will not change.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:16px 32px;
                       border-top:1px solid #e5e7eb;text-align:center;
                       border-radius:0 0 12px 12px;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                AI Interview Prep · Practice smarter, get hired faster
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  };

  try {
    const response = await sgMail.send(msg);
    console.log('✅ Reset OTP sent successfully!');
    console.log('Status code:', response[0].statusCode);
    return response;
  } catch (err) {
    console.error('❌ SendGrid error!');
    console.error('Message:', err.message);
    if (err.response) {
      console.error('Body:', JSON.stringify(err.response.body));
    }
    throw new Error(err.message);
  }
};

module.exports = { sendVerificationOtp, sendPasswordResetOtp };