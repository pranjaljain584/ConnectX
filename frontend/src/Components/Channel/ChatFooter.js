import React, { useState } from 'react';
import { connect } from 'react-redux';
import { io } from 'socket.io-client';
import '../../assets/css/chatfooter.css' ;
import {
  faMicrophone,
  faPaperclip,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

    setMsg('');
  };
  return (
    <div className='chat-footer'>
      <form>
        <div className='left'>
          <FontAwesomeIcon className='footer-icon ' icon={faPaperclip} />
          <FontAwesomeIcon className='footer-icon ' icon={faMicrophone} />
        </div>

        <input
          type='text'
          placeholder='Type your message here...'
          value={msg}
          onChange={handleChange}
        ></input>
        <button onClick={handleSubmit}>
          Send{' '}
          <FontAwesomeIcon className='footer-icon-send' icon={faPaperPlane} />
        </button>
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
