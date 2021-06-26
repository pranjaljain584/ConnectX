const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'microsoftteamsclonemailer@gmail.com',
    pass: 'omnipc123',
  }
});

module.exports = transporter ;