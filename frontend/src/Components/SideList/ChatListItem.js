import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import '../../assets/css/chatlistitem.css';
import {
  faPhoneSquareAlt,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const socket = io.connect(`${process.env.REACT_APP_API_URL}`, {
  transports: ['websocket'],
});

function ChatListItem(props) {
  const {
    title,
    id,
    time,
    lastMsg,
    setRoomIdSelected,
    setFileSelected,
    isMeet,
  } = props;

  const [lastMessage, setLastMessage] = useState(lastMsg);
  const [lastTime, setLastTime] = useState(time);

  useEffect(() => {
    // socket for dynamic update of last message
    socket.removeAllListeners(`${id}-lastMessage`);
    socket.on(`${id}-lastMessage`, (data) => {
      setLastMessage(data.finalMsg);
      setLastTime(data.finalMsg.chatTime);
    });

    // cleanup
    return () => {
      socket.removeAllListeners(`${id}-lastMessage`);
    };
  }, [id]);

  console.log(`Title: ${title}, lastMessage: ${lastMsg}`);

  return (
    <div
      onClick={() => {
        setRoomIdSelected(id);
        setFileSelected('');
      }}
      className='chat-list-item'
    >
      <div className='left-item'>
        {isMeet ? (
          <FontAwesomeIcon icon={faPhoneSquareAlt} />
        ) : (
          <FontAwesomeIcon icon={faUserCircle} />
        )}
      </div>
      <div className='mid-item'>
        <span>{title}</span> <br />{' '}
        <p style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
          {lastMessage ? (
            <p>
              {lastMessage.chatMessage !== null
                ? lastMessage.chatMessage !== ''
                  ? lastMessage.chatMessage
                  : lastMessage.fileName
                : ''}
            </p>
          ) : (
            ''
          )}
        </p>
      </div>
      <div className='right-item'>{lastTime}</div>
    </div>
  );
}

export default ChatListItem;
