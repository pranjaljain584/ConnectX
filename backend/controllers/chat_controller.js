const User = require('../models/User');

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
