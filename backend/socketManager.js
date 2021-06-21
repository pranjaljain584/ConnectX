module.exports = (socket) => {
  try {
    console.log('*****Connected');
    socket.on('code', (data, callback) => {
      socket.broadcast.emit('code', data);
    });

    socket.on('subscribe', function (room) {
      console.log('joining room', room);
      socket.join(room);
    });

    socket.on('send message', function (data) {
      console.log('sending room post', data.room);
      socket.broadcast.to(data.room).emit('conversation private post', {
        message: data.message,
      });
    });

  } catch (error) {
    console.log("Error socket", error.message);
  }
};
