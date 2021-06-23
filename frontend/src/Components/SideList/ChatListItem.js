import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import '../../assets/css/chatlistitem.css';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const socket = io.connect('http://localhost:5000', {
  transports: ['websocket'],
});

function ChatListItem(props) {
  const { title, id,time, lastMsg, setRoomIdSelected } = props;
  const [lastMessage, setLastMessage] = useState(lastMsg);
  useEffect(() => {
    // console.log('Room Socket listening on: ', id);
    socket.removeAllListeners(`${id}-lastMessage`);
    socket.on(`${id}-lastMessage`, (data) => {
      // console.log(data) ;
      setLastMessage(data.finalMsg.chatMessage);
    });
  }, [id]);
  return (
    <div
      onClick={() => {
        setRoomIdSelected(id);
      }}
      className='chat-list-item'
    >
      <div className='left-item'>
        <FontAwesomeIcon icon={faUserCircle} />
      </div>
      <div className='mid-item'>
        <span>{title}</span> <br />{' '}
        {lastMessage ? <p>{lastMessage}</p> : <p></p>}
      </div>
      <div className='right-item'>{time}</div>
    </div>
  );
}

export default ChatListItem;
