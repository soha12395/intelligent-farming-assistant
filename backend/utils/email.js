const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationCode = (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'IFA - Email Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #2e7d32;">🌱 Intelligent Farming Assistant</h2>
        <p>Thank you for registering. Use the code below to verify your account:</p>
        <div style="background: #f1f8e9; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #2e7d32; letter-spacing: 10px;">${code}</h1>
        </div>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not register, please ignore this email.</p>
      </div>
    `
  };
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
  return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationCode };