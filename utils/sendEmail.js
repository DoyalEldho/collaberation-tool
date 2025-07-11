const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Team Invite" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html
  });
};

module.exports = sendEmail;
