const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const User = require('./models/User');
const ChatRoom = require('./models/ChatRoom');


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

            io.emit('create-room-client', { room: result });
            console.log('Socket create room client emitted!');
          } catch (error) {
            console.log('Chat room save error:', err);
          }
        });
      } catch (error) {
        res.status(401).send('socket callback error');
      }
    });

    // socket.on('send message', function (data) {
    //   console.log('sending room post', data.room);
    //   socket.broadcast.to(data.room).emit('conversation private post', {
    //     message: data.message,
    //   });
    // });
  } catch (error) {
    console.log('Error socket', error.message);
  }
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server is running at ${port}`));
