const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const User = require('./models/User');
const ChatRoom = require('./models/ChatRoom');
const File = require('./models/File');

// require connectDB function exported in db.js file
const connectDB = require('./config/db');

const app = express();

// Init middleware
// parses data in req body
app.use(express.json({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// connect database
connectDB();

// define routes
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/room', require('./routes/api/room'));
app.use('/api/chat', require('./routes/api/chat'));
app.use('/api/mail', require('./routes/api/mail'));
app.use('/api/file', require('./routes/api/files'));

io.on('connection', (socket) => {
  try {
    // code
    socket.on('code', (data, callback) => {
      socket.broadcast.emit('code', data);
    });

    // create room
    socket.on('create-room', async function (room) {
      console.log('Socket create-room called!');
      try {
        console.log(room);
        const roomTitle = room.roomTitle;
        const userId = room.userId;

        let chatRoom = new ChatRoom({
          title: roomTitle,
          joinedUsers: [userId],
          msgArray: [],
        });

        await chatRoom.save(async function (err, result) {
          if (err) {
            console.log('Chat room save error: **', err);
            return;
          }

          try {
            console.log('Updating user with room ids!');
            const roomid = result._id;
            await User.updateOne(
              { _id: userId },
              { $push: { joinedRooms: roomid } }
            );

            io.emit(`create-room-${userId}`, { room: result });
            console.log('Socket create room client emitted!');
          } catch (error) {
            console.log('Chat room save error:', err);
          }
        });
      } catch (error) {
        res.status(401).send('socket callback error');
      }
    });

    socket.on('send-msg', async function (data) {
      // console.log('sending room post', data);
      const { userId, msgTime, msg, userName, roomIdSelected, file } = data;

      if (file !== '') {
        let newfile = new File({
          name: file.name,
          base64String: file.base64,
          roomId: roomIdSelected,
        });

        newfile.save(async function (err, result) {
          if (err) {
            console.log('File save error: **', err);
            return;
          }
        });
      }

      const finalMsg = {
        userId,
        userName,
        chatMessage: msg,
        chatTime: msgTime,
        fileName: file.name,
        base64String: file.base64,
      };

      ChatRoom.findOneAndUpdate(
        { _id: roomIdSelected },
        { $push: { msgArray: finalMsg } },
        (err, doc) => {
          if (err) {
            console.log('error in sending msg: ', err);
          }

          io.emit(`${roomIdSelected}`, { finalMsg });
          io.emit(`${roomIdSelected}-lastMessage`, { finalMsg });
        }
      );
    });

    socket.on('leave-room', async function (data) {
      const { userId, roomIdSelected } = data;

      ChatRoom.findOneAndUpdate(
        { _id: roomIdSelected },
        { $pull: { joinedUsers: userId } },
        (err, result) => {
          if (err) {
            console.log('error in leaving room: ', err);
          }

          User.findOneAndUpdate(
            { _id: userId },
            { $pull: { joinedRooms: roomIdSelected } },
            (err) => {
              if (err) {
                console.log('error in leaving room: ', err);
              }
            }
          );

          io.emit(`leave-room-${userId}`, { room: result });
        }
      );
    });
  } catch (error) {
    console.log('Error socket', error.message);
  }
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server is running at ${port}`));
