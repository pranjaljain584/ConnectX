const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const chatController = require('../../controllers/chat_controller') ;

router.get('/chat-list',auth,chatController.getChatList) ;

router.get('/chat-room/:roomid', auth, chatController.getChatRoom);

router.post('/create-chat-meet-room',auth,chatController.createChatMeetRoom) ;

// join chat room
router.post('/invite/:chatRoomId',auth,chatController.joinChatRoom) ;

module.exports = router ;