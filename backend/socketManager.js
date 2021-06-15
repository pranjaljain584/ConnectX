console.log("hi")
module.exports = (socket) => {

 console.log("hello") ;
  try {
    console.log('*****Connected');
    socket.on('code', (data, callback) => {
      socket.broadcast.emit('code', data);
    });
  } catch (error) {
    console.log("Error socket", error.message);
  }
};
