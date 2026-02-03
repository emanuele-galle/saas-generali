import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!process.env.SMTP_HOST) {
    console.warn("SMTP not configured, skipping email to:", to);
    return;
  }

  return transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@fodivps1.cloud",
    to,
    subject,
    html,
  });
}
