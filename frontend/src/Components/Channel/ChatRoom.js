import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import { io } from 'socket.io-client';
import '../../assets/css/chatroom.css';
import Message from './Message';

const socket = io.connect(`${process.env.REACT_APP_API_URL}`, {
  transports: ['websocket'],
});

function ChatRoom(props) {
  const { roomIdSelected } = props;
  const messagesEndRef = useRef(null);
  const [roomName, setRoomName] = useState('');
  const [msgArray, setMsgArray] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [meet, setMeet] = useState();

  // scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // fetch room details
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/chat/chat-room/${roomIdSelected}`,
        config
      )
      .then((response) => {
        setRoomName(response.data.room.title);
        setMsgArray(response.data.room.msgArray);
        setParticipants(response.data.participants);
        setMeet(response.data.Meet);
      })
      .catch((err) => console.log(err));
  }, [roomIdSelected]);

  useEffect(() => {
    // listener for latest message on selected room
    socket.removeAllListeners(`${roomIdSelected}`);
    socket.on(`${roomIdSelected}`, function (data) {
      setMsgArray((prevState) => {
        return [...prevState, data.finalMsg];
      });
    });

    return (()=>{
    socket.removeAllListeners(`${roomIdSelected}`);
    })
  }, [roomIdSelected]);

  useEffect(() => {
    scrollToBottom();
  }, [msgArray]);

  return (
    <div className='chat-room'>
      <ChatHeader
        participants={participants}
        roomIdSelected={roomIdSelected}
        roomName={roomName}
        meet={meet}
      />
      <div className='list' id='style'>
        {msgArray.length > 0 &&
          msgArray.map((msg, key) => {
            return <Message key={key} msg={msg} />;
          })}
        <div ref={messagesEndRef} />
      </div>
      <ChatFooter roomIdSelected={roomIdSelected} />
    </div>
  );
}

export default ChatRoom;
