const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');

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
    const roomId = req.params.roomid;
    const room = await ChatRoom.findById(roomId).populate(
      'joinedUsers',
      'name'
    );
    const participants = [];

    for (const ju of room.joinedUsers) {
      participants.push(ju.name);
    }

    return res.status(200).json({ room, participants });
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
    const chatRoomId = req.params.chatRoomId;
    const userId = req.user.id;
    ChatRoom.findById(chatRoomId, function (err, room) {
      if (err) {
        return res
          .status(200)
          .json({ success: false, msg: 'Room does not exist' });
      }else{
        if(room.joinedUsers.includes(userId)){
          return res
            .status(200)
            .json({ success: true, msg: 'Already joined' });
        }else{

          ChatRoom.findOneAndUpdate(
            { _id: chatRoomId },
            { $push: { joinedUsers: userId } },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log('Something wrong when updating data!');
                return res
                  .status(200)
                  .json({ msg: 'Error while joining', success: false });
              } else {
                User.findOneAndUpdate(
                  { _id: userId },
                  { $push: { joinedRooms: chatRoomId } },
                  { new: true },
                  (err, doc) => {
                    if (err) {
                      console.log('Something wrong when updating data!');
                      return res
                        .status(200)
                        .json({ msg: 'Error while joining', success: false });
                    } else {
                      return res.status(200).json({ success: true });
                    }
                  }
                );
              }
            }
          );
        }
      }
      
    });

    
  } catch (error) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Unable to join', success: false });
  }
};
