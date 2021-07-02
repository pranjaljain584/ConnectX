import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import { io } from 'socket.io-client';
import '../../assets/css/chatroom.css';
import Message from './Message';

const socket = io.connect('http://localhost:5000', {
  transports: ['websocket'],
});

function ChatRoom(props) {
  const { roomIdSelected } = props;
  const [roomName, setRoomName] = useState('');
  const [msgArray, setMsgArray] = useState([]);
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
        setRoomName(response.data.room.title);
        setMsgArray(response.data.room.msgArray);
        setParticipants(response.data.participants) ;
        // console.log("PARTICIPANTS",participants) ;
      })
      .catch((err) => console.log(err));

  }, [roomIdSelected]);

  useEffect(() => {
    
    socket.removeAllListeners(`${roomIdSelected}`);
    socket.on(`${roomIdSelected}`, function (data) {
      // console.log("DATA" , data) ;
      setMsgArray((prevState) => {
        return [...prevState, data.finalMsg];
      });

    });

  }, [roomIdSelected]);

  return (
    <div className='chat-room'>
      <ChatHeader participants={participants} roomIdSelected={roomIdSelected} roomName={roomName} />
      <div className='list' id='style'>
        {msgArray.length > 0 &&
          msgArray.map((msg, key) => {
            return <Message key={key} msg={msg} />;
          })}
      </div>
      <ChatFooter roomIdSelected={roomIdSelected} />
    </div>
  );
}

export default ChatRoom;
