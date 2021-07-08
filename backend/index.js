const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const User = require('./models/User');
const Reminder = require('./models/Reminder');
const ChatRoom = require('./models/ChatRoom');
const File = require('./models/File');
var cron = require('node-cron');
const transporter = require('./config/nodemailer');

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
    origin: 'http://18.117.248.192',
    methods: ['GET', 'POST'],
  },
});

// connect database
connectDB();

app.use(express.static(path.join(__dirname, '../frontend/build')));
// define routes
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/chat', require('./routes/api/chat'));
app.use('/api/mail', require('./routes/api/mail'));
app.use('/api/file', require('./routes/api/files'));
app.use('/api/event', require('./routes/api/event'));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/../frontend/', 'build', 'index.html'));
});

io.on('connection', (socket) => {
  try {
    socket.on('message', function (message) {
      // Broadcast any received message to all clients
      io.emit('message', message);
    });

    socket.on('video-msg', function (data) {
      io.emit(`${data.roomId}-video-msg`, {
        msg: data.msg,
        user: data.user,
        time: data.time,
      });
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
      const { userId, msgTime, msg, userName, roomIdSelected, file, userMail } =
        data;

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
        userMail,
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
        { new: true },
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

          if (result.joinedUsers.length == 0) {
            ChatRoom.findOneAndDelete({ _id: roomIdSelected }, (err) => {
              if (err) {
                console.log('error in deleting room: ', err);
              }
              // console.log('success') ;
            });
          }
        }
      );
    });
  } catch (error) {
    console.log('Error socket', error.message);
  }
});

cron.schedule('*/5 * * * *', async () => {
  let currentTime = new Date();
  let upperBound = new Date(currentTime.getTime() + 15 * 60000);

  // filter out the events whose start time is within 15 minutes from now and then send a mail
  const events = await Reminder.find({
    StartTime: { $gte: currentTime, $lte: upperBound },
    mailSent: false,
  });

  let smtpTransport = transporter;

  events.forEach(async (event) => {
    let user = await User.findById(event.userId);
    let userEmail = user.email;
    let eventid = event._id ;

    let mailOptions = {
      from: 'microsoftteamsclonemailer@gmail.com',
      to: `${userEmail}`,
      subject: 'Reminder Mail',
      html: `
            <h1> Your Event <u> ${event.Subject} </u> is starting in 15 mins </h1>
            <br />
        `,
    };

    smtpTransport.sendMail(mailOptions, async (err, response) => {
      if (err) {
        console.log('Mail Not Sent', err);
      } else {
        await Reminder.findByIdAndUpdate(eventid,{mailSent:true}) ;
        console.log('Mail Sent');
      }
    });
  });
});

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server is running at ${port}`));
