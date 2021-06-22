const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom') ;

module.exports.getChatList = async (req, res) => {
  try {
    const userId = req.user.id;

    const roomsArray = await User.findOne({ _id: userId })
      .sort({ createdAt: 1 })
      .populate('joinedRooms');

    return res.status(200).json({ roomsArray: roomsArray.joinedRooms });
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports.getChatRoom = async (req, res) => {
  try {
    const roomId = req.params.roomid ;
    const room = await ChatRoom.findById(roomId) ;

    return res.status(200).json({room}) ;

  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports.createChatRoom = async (req, res) => {
  try {
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports.updateChatRoom = async (req, res) => {
  try {
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports.joinChatRoom = async (req, res) => {
  try {
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
