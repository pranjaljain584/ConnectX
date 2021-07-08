const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatBody = {
  userId: { type: String, required: true },
  userName: { type: String, required: false },
  chatMessage: { type: String, required: true },
  chatTime: { type: String, required: true },
  fileName: { type: String },
  base64String: { type: String },
  userMail: { type: String },
};

// creating ChatRoom schema
const ChatRoomSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    msgArray: {
      type: [ChatBody],
    },
    joinedUsers: [
      {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User',
      },
    ],
    lastmsg: {
      type: String,
    },
    Meet: {
      type: mongoose.Schema.Types.ObjectID,
      ref:'Reminder',
    },
  },
  {
    timestamps: true, //so that we have createdAt and updatedAt fields
  }
);

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

module.exports = ChatRoom;
