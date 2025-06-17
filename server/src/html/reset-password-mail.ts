export const getResetPasswordHtml = ({otp, name}) => {
 return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        background: #4caf50;
        color: #ffffff;
        padding: 10px 0;
        border-radius: 8px 8px 0 0;
      }
      .content {
        margin: 20px 0;
        font-size: 16px;
        color: #333333;
      }
      .verification-code {
        display: block;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        background: #f4f8fb;
        padding: 10px;
        border-radius: 8px;
        color: #4caf50;
        letter-spacing: 2px;
      }
      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #777777;
        text-align: center;
      }
      .footer a {
        color: #4caf50;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Email Verification</h1>
      </div>
      <div class="content">
        <p>Hello <strong>${name}</strong>,</p>
        <p>We received a request to verify your email address for our application. Please use the following verification code:</p>
        <span class="verification-code">${otp}</span>
        <p>This code will expire in 5 minutes. Please enter the code in the app to complete your verification.</p>
        <p>If you did not request this, please ignore this email or contact support.</p>
      </div>
      <div class="footer">
        <p>Thank you,<br>The DevRejaul Team</p>
        <p><a href="mailto:devrejaul.official@gmail.com">Contact Support</a> | <a href="https://your-app-domain.com">Visit Our Website</a></p>
      </div>
    </div>
  </body>
  </html>
  `;
}; 