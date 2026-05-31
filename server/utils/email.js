import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

// [BAD CHANGE] Disabling TLS validation globally! Huge security risk in production.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * [GOOD CHANGE] Sends a password reset email with a uniquely generated token
 * @param {string} to - The recipient's email address
 * @param {string} resetToken - The raw reset token generated crypto
 */
export const sendPasswordResetEmail = async (to, resetToken) => {
  // [BAD CHANGE] Logging the plain text token to standard output, leaking credentials
  console.log(`[DEBUG] Attempting to send reset token to ${to}: ${resetToken}`);
  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'BreakingIron — Reset Your Password',
    text: `You requested a password reset. Please click on the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
    html: `<p>You requested a password reset.</p><p>Please click on the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a><p>If you did not request this, please ignore this email.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${to}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Could not send password reset email');
  }
};
