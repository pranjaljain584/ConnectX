// const User = require('./models/User');
// const ChatRoom = require('./models/ChatRoom');

// module.exports = (socket) => {
//   try {
//     socket.on('code', (data, callback) => {
//       socket.broadcast.emit('code', data);
//     });

//     socket.on('create-room', async function (room) {
//       console.log('Socket create-room called!');
//       try {
//         console.log(room);
//         const roomTitle = room.roomTitle;
//         const userId = room.userId;

//         let chatRoom = new ChatRoom({
//           title: roomTitle,
//           joinedUsers: [userId],
//           msgArray: [],
//         });

//         await chatRoom.save(async function (err, result) {
//           if (err) {
//             console.log('Chat room save error: **', err);
//             return;
//           }

//           try {
//             console.log('Updating user with room ids!');
//             const roomid = result._id;
//             await User.updateOne(
//               { _id: userId },
//               { $push: { joinedRooms: roomid } }
//             );

//             socket.emit('create-room-client', { room: result });
//             console.log('Socket create room client emitted!');
//           } catch (error) {
//             console.log('Chat room save error:', err);
//           }
//         });
//       } catch (error) {
//         res.status(401).send('socket callback error');
//       }
//     });

//     // socket.on('join-room', function (room) {
//     //   console.log('joining room', room);
//     //   socket.join(room);
//     // });

//     // socket.on('send message', function (data) {
//     //   console.log('sending room post', data.room);
//     //   socket.broadcast.to(data.room).emit('conversation private post', {
//     //     message: data.message,
//     //   });
//     // });
//   } catch (error) {
//     console.log('Error socket', error.message);
//   }
// };
