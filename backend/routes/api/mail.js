const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();

const transporter = require('../../config/nodemailer') ;

router.post('/',auth,(req,res)=>{
    let data = req.body ;
    // console.log(data);

    let smtpTransport = transporter ;

    let mailOptions = {
      from: 'microsoftteamsclonemailer@gmail.com',
      to: data.sendTo,
      subject: 'Invite Mail',
      html: `
            ${data.userName} with email : ${data.userEmail} is inviting you
            to join chat room : ${data.roomName}
            <br />
            Click on the link below to join :
            <a href=${data.inviteLink}> Chat Room Link </a>
        `,
    };

    smtpTransport.sendMail(mailOptions,(err,response) => {
        if(err){
            console.log(err) ;
            res.status(401).json({msg:err}) ;
        }else{
            res.status(200).json({msg:"Email Sent"}) ;
        }
    })

    smtpTransport.close() ;

}) ;

module.exports = router ;
