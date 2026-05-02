import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendPasswordResetEmail = async (to, resetToken) => {
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
