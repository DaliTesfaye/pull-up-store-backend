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

// Send order confirmation email
export const sendOrderConfirmationEmail = async (
  email: string,
  firstName: string,
  orderNumber: string,
  orderItems: Array<{
    productName: string;
    size: string;
    color: string;
    quantity: number;
    itemTotal: number;
  }>,
  totalAmount: number,
  confirmationToken: string
): Promise<void> => {
  // Generate items HTML
  const itemsHTML = orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.productName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.size}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.color}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${item.itemTotal.toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  const mailOptions = {
    from: `"Pull Up Store" <${EMAIL_USER}>`,
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; }
          .order-box { background-color: #fff; border: 2px solid #2196F3; padding: 20px; margin: 20px 0; }
          .order-number { font-size: 24px; font-weight: bold; color: #2196F3; text-align: center; margin-bottom: 20px; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th { background-color: #2196F3; color: white; padding: 10px; text-align: left; }
          .total-row { background-color: #e3f2fd; font-weight: bold; font-size: 18px; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
          .success-badge { background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Confirm Your Order</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName},</h2>
            <p>Thank you for your order! Please confirm your purchase to proceed with processing.</p>
            
            <div class="order-box">
              <div class="order-number">Order Number: ${orderNumber}</div>
              
              <h3>Order Details:</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Size</th>
                    <th style="text-align: center;">Color</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                  <tr class="total-row">
                    <td colspan="4" style="padding: 15px; text-align: right;">Total:</td>
                    <td style="padding: 15px; text-align: right;">$${totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5000/api/orders/confirm?token=${confirmationToken}&orderNumber=${orderNumber}" 
                 style="background-color: #4CAF50; color: white; padding: 15px 40px; text-decoration: none; 
                        border-radius: 5px; font-size: 18px; font-weight: bold; display: inline-block;">
                ✓ Confirm Purchase
              </a>
            </div>
            
            <p style="text-align: center; color: #666; font-size: 14px;">
              Or copy this link: <br>
              <code style="background-color: #f0f0f0; padding: 5px 10px; border-radius: 3px; font-size: 12px;">
                http://localhost:5000/api/orders/confirm?token=${confirmationToken}&orderNumber=${orderNumber}
              </code>
            </p>
            
            <p><strong>⚠️ Important:</strong></p>
            <ul>
              <li>Please confirm your order within 24 hours</li>
              <li>Your order is on hold until confirmed</li>
              <li>Stock is reserved for you</li>
            </ul>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Thank you for shopping with Pull Up Store!</p>
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
