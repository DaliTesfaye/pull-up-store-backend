import nodemailer from "nodemailer";

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER || "your-email@gmail.com";
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "your-app-password";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

// Send verification email
export const sendVerificationEmail = async (
  email: string,
  firstName: string,
  verificationCode: string
): Promise<void> => {
  const mailOptions = {
    from: `"Pull Up Store" <${EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - Pull Up Store",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; }
          .code-box { background-color: #fff; border: 2px solid #4CAF50; padding: 20px; text-align: center; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Pull Up Store!</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName},</h2>
            <p>Thank you for signing up! To complete your registration, please verify your email address.</p>
            <p>Your verification code is:</p>
            <div class="code-box">
              <div class="code">${verificationCode}</div>
            </div>
            <p><strong>This code expires in 10 minutes.</strong></p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Pull Up Store. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  firstName: string,
  resetCode: string
): Promise<void> => {
  const mailOptions = {
    from: `"Pull Up Store" <${EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password - Pull Up Store",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #FF5722; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; }
          .code-box { background-color: #fff; border: 2px solid #FF5722; padding: 20px; text-align: center; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; color: #FF5722; letter-spacing: 5px; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
          .warning { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName},</h2>
            <p>We received a request to reset your password for your Pull Up Store account.</p>
            <p>Your password reset code is:</p>
            <div class="code-box">
              <div class="code">${resetCode}</div>
            </div>
            <p><strong>⏰ This code expires in 10 minutes.</strong></p>
            <div class="warning">
              <strong>⚠️ Important:</strong> If you didn't request this password reset, please ignore this email. 
              Your password will remain unchanged.
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2025 Pull Up Store. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
