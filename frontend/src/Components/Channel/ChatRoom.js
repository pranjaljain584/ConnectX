import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import { io } from 'socket.io-client';

const socket = io.connect('http://localhost:5000', {
  transports: ['websocket'],
});

function ChatRoom(props) {
  const { roomIdSelected } = props;
  const [roomName, setRoomName] = useState('');
  const [msgArray, setMsgArray] = useState([
    {
      chatMessage: '',
      userName: '',
      chatTime: '',
      userId: '',
    },
  ]);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };

    axios
      .get(`http://localhost:5000/api/chat/chat-room/${roomIdSelected}`, config)
      .then((response) => {
        // console.log("Chat room res--->>",response.data) ;
        setRoomName(response.data.room.title);
        setMsgArray(response.data.room.msgArray);
      })
      .catch((err) => console.log(err));
  }, [roomIdSelected]);

  useEffect(() => {
    // console.log('Room Socket listening on: ', roomIdSelected);
    socket.removeAllListeners(`${roomIdSelected}`);
    socket.on(`${roomIdSelected}`, function (data) {
      // console.log('DATA__', data);
      setMsgArray((prevState) => {
        return [...prevState, data.finalMsg];
      });
    });
  }, [roomIdSelected]);

  return (
    <div>
      <ChatHeader roomIdSelected={roomIdSelected} roomName={roomName} />
      {msgArray.length > 0 &&
        msgArray.map((msg, key) => {
          return <p key={key}>msg-- {msg.chatMessage}</p>;
        })}
      <ChatFooter roomIdSelected={roomIdSelected} />
    </div>
  );
}

export default ChatRoom;
