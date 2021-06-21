module.exports = (socket) => {
  try {
    console.log('*****Connected');
    socket.on('code', (data, callback) => {
      socket.broadcast.emit('code', data);
    });
  } catch (error) {
    console.log("Error socket", error.message);
  }
};
