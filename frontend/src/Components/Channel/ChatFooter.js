import React, { useState } from 'react';
import { connect } from 'react-redux';
import { io } from 'socket.io-client';

const socket = io.connect('http://localhost:5000', {
  transports: ['websocket'],
});

function ChatFooter(props) {
  const [msg, setMsg] = useState('');
  const { roomIdSelected } = props;
  const userId = props.auth.user?._id;
  const userName = props.auth.user?.name;

  const handleChange = (e) => {
    setMsg(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var currentdate = new Date();
    var time = currentdate.getHours() + ':' + currentdate.getMinutes();

    socket.emit('send-msg', {
      userId,
      msgTime: time,
      msg,
      userName,
      roomIdSelected,
    });

    setMsg('') ;
  };
  return (
    <div>
      <form>
        <input type='text' value={msg} onChange={handleChange}></input>
        <button onClick={handleSubmit}>Send</button>
      </form>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(ChatFooter);
