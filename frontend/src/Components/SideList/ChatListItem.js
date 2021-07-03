import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import '../../assets/css/chatlistitem.css';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const socket = io.connect(`${process.env.REACT_APP_API_URL}`, {
  transports: ['websocket'],
});

function ChatListItem(props) {
  const { title, id,time, lastMsg, setRoomIdSelected,setFileSelected } = props;
  const [lastMessage, setLastMessage] = useState(lastMsg);
  const [lastTime,setLastTime] = useState(time) ;
  useEffect(() => {
    // console.log('Room Socket listening on: ', id);
    socket.removeAllListeners(`${id}-lastMessage`);
    socket.on(`${id}-lastMessage`, (data) => {
      // console.log(data) ;
      setLastMessage(data.finalMsg.chatMessage);
      setLastTime(data.finalMsg.chatTime) ;
    });
  }, [id]);
  return (
    <div
      onClick={() => {
        setRoomIdSelected(id);
        setFileSelected('') ;
      }}
      className='chat-list-item'
    >
      <div className='left-item'>
        <FontAwesomeIcon icon={faUserCircle} />
      </div>
      <div className='mid-item'>
        <span>{title}</span> <br />{' '}
        <p style={{overflowX:'hidden'},{overflowY:'hidden'}} >{lastMessage ? <p>{lastMessage}</p> : <p></p>}</p>
      </div>
      <div className='right-item'>{lastTime}</div>
    </div>
  );
}

export default ChatListItem;
