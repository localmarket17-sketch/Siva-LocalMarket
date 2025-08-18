const nodemailer = require('nodemailer');
require('dotenv').config(); // Make sure env variables are loaded

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // your-email@gmail.com
    pass: process.env.EMAIL_PASS,   // your 16-digit Gmail App Password
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
  }
};

module.exports = sendEmail;
