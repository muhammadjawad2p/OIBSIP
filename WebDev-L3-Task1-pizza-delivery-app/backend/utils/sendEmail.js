const transporter = require("../config/email");

const baseTemplate = (title, bodyHtml) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#ff4e50,#f9d423);padding:24px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:22px;">🍕 Pizza Delivery</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;color:#333;">
              <h2 style="margin-top:0;">${title}</h2>
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;background:#fafafa;color:#999;font-size:12px;text-align:center;">
              &copy; ${new Date().getFullYear()} Pizza Delivery. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async (to, name, verifyUrl) => {
  const html = baseTemplate(
    `Hi ${name}, verify your email`,
    `<p>Thanks for signing up! Please confirm your email address by clicking the button below.</p>
     <p style="text-align:center;margin:28px 0;">
       <a href="${verifyUrl}" style="background:#ff4e50;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">Verify Email</a>
     </p>
     <p>If the button doesn't work, copy this link into your browser:</p>
     <p style="word-break:break-all;color:#555;">${verifyUrl}</p>
     <p>This link expires in 24 hours.</p>`
  );
  await sendEmail({ to, subject: "Verify your email - Pizza Delivery", html });
};

const sendPasswordResetEmail = async (to, name, resetUrl) => {
  const html = baseTemplate(
    `Hi ${name}, reset your password`,
    `<p>We received a request to reset your password. Click the button below to set a new one.</p>
     <p style="text-align:center;margin:28px 0;">
       <a href="${resetUrl}" style="background:#ff4e50;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">Reset Password</a>
     </p>
     <p>If you didn't request this, you can safely ignore this email. This link expires in 1 hour.</p>`
  );
  await sendEmail({ to, subject: "Reset your password - Pizza Delivery", html });
};

const sendLowStockEmail = async (to, itemName, stock) => {
  const html = baseTemplate(
    `Low Stock Alert`,
    `<p><strong>${itemName}</strong> is running low in inventory.</p>
     <p>Current stock: <strong>${stock}</strong></p>
     <p>Please restock soon to avoid order disruptions.</p>`
  );
  await sendEmail({ to, subject: `Low Stock Alert: ${itemName}`, html });
};

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail, sendLowStockEmail };
