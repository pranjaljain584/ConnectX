import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io.connect('http://localhost:5000', {
  transports: ['websocket'],
});

function ChatListItem(props) {
  const { title, id, lastMsg, setRoomIdSelected } = props;
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
    >
      {title} {id} {lastMessage ? <p>{lastMessage}</p> : <p>Empty</p>}
    </div>
  );
}

export default ChatListItem;
