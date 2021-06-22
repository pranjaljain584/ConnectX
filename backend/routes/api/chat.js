const express = require('express');
const router = express.Router();
import chatController from '../../controllers/chat_controller' ;

router.get('/chat-list',auth,chatController.getChatList) ;

router.get('/chat-room/:roomid', auth, chatController.getChatRoom);

router.post('create-chat-room',auth,chatController.createChatRoom) ;

// update chat room 

// join chat room

module.exports = router ;