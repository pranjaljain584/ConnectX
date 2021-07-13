const nodemailer = require('nodemailer');

// set up transporter
let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: `${process.env.MAIL_SERVICE_ID}`,
    pass: `${process.env.MAIL_SERVICE_PASSWORD}`,
  },
});

module.exports = transporter ;