const express = require('express');
const { joinChatRoom } = require('../../controllers/chat_controller');
const router = express.Router();
const auth = require('../../middleware/auth');
const ChatRoom = require('../../models/ChatRoom');
const File = require('../../models/File') ;
const User = require('../../models/User');

// get all files
router.get('/',auth,async (req,res)=>{
    try {
        const userId = req.user.id;
        
        console.log(userId) ;

        User.find({_id:userId}, (err,user) => {
          if (err) {
            console.log(err);
            return res.status(401).json({ msg: err });
          }

          console.log("user",user) ;
          File.find({roomId : {$in : user[0].joinedRooms}},(err,result)=>{
            if(err){
              console.log(err) ;
              return res.status(401).json({msg:err}) ;
            }

            return res.status(200).json({ filesArray:result });
          })

        });
        
    } catch (error) {
        return res.status(401).json({msg:error}) ;
    }
    
}) ;

module.exports = router ;
