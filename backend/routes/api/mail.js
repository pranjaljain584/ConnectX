const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();

const transporter = require('../../config/nodemailer');

router.post('/', auth, (req, res) => {
  let data = req.body;

  let smtpTransport = transporter;

  let mailOptions = {
    from: `${process.env.MAIL_SERVICE_ID}`,
    to: data.sendTo,
    subject: 'Invite Mail',
    html: `
            <h4>${data.userName} with email : ${data.userEmail} is inviting you
            to join chat room : ${data.roomName}</h4>
            <br />
            Click on the link below to join :
            <br/>
            <h3> <a href=${data.inviteLink}> Chat Room Link </a> </h3>
            
        `,
  };

  smtpTransport.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.log(err);
      res.status(200).json({ type: 'error', msg: 'Mail Not Sent' });
    } else {
      res.status(200).json({ type: 'success', msg: 'Email Sent' });
    }
  });

  smtpTransport.close();
});

router.post('/meet', auth, (req, res) => {
  let data = req.body;
  // console.log(data);

  let smtpTransport = transporter;

  let mailOptions = {
    from: `${process.env.MAIL_SERVICE_ID}`,
    to: data.sendTo,
    subject: 'Invite Mail',
    html: `
            <h4>${data.userName} with email : ${data.userEmail} is inviting you
            to join video meet </h4>
            <br />
            Click on the link below to join :
            <br/>
            <h3> <a href=${data.inviteLink}> Invite Meet Link </a> </h3>
            
        `,
  };

  smtpTransport.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.log(err);
      res.status(200).json({ type: 'error', msg: 'Mail Not Sent' });
    } else {
      res.status(200).json({ type: 'success', msg: 'Email Sent' });
    }
  });

  smtpTransport.close();
});

module.exports = router;
