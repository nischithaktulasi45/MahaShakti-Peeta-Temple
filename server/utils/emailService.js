const nodemailer = require("nodemailer");

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  const port = Number(SMTP_PORT);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: SMTP_SECURE === "true" || port === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const sendVerificationEmail = async ({ email, name, token }) => {
  const transporter = getTransporter();
  const serverUrl = (process.env.SERVER_URL || process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/$/, "");
  const verificationUrl = `${serverUrl}/api/admin/verify/${token}`;
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || "no-reply@temple.com";
  const subject = "Verify your Mahashakti Peeta admin email";
  const text = `Hello ${name || "Admin"},\n\nPlease verify your admin email by clicking the link below:\n${verificationUrl}\n\nThis link expires in 24 hours.\n\nIf you did not request this, ignore this email.`;
  const html = `
    <p>Hello ${name || "Admin"},</p>
    <p>Please verify your admin email by clicking the link below:</p>
    <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    <p>This link expires in 24 hours.</p>
    <p>If you did not request this, ignore this email.</p>
  `;

  if (!transporter) {
    console.warn("SMTP configuration is missing. Verification email not sent.");
    console.warn("Verification link:", verificationUrl);
    return { success: true, verificationUrl };
  }

  const info = await transporter.sendMail({
    from,
    to: email,
    subject,
    text,
    html,
  });

  console.log(`Verification email sent to ${email}: ${info.messageId}`);
  return { success: true, info, verificationUrl };
};

module.exports = { sendVerificationEmail };