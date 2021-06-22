import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader' ;
import ChatFooter from './ChatFooter';

function ChatRoom(props) {
    const {roomIdSelected} = props ;
    const [roomName,setRoomName] = useState('') ;
    const [msgArray,setMsgArray] = useState([]) ;
    const [participants,setParticipants] = useState([]) ;

    useEffect(()=>{

        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.token,
          },
        };

        axios
          .get(
            `http://localhost:5000/api/chat/chat-room/${roomIdSelected}`,
            config
          )
          .then((response) => {
            // console.log("Chat room res--->>",response.data) ;
            setRoomName(response.data.room.title) ;
            setMsgArray(response.data.room.msgArray) ;
          })
          .catch((err) => console.log(err));

    },[roomIdSelected]) ;
    return (
      <div>
        <ChatHeader roomIdSelected={roomIdSelected} roomName={roomName} />
        <ChatFooter roomIdSelected={roomIdSelected} />
      </div>
    );
}

export default ChatRoom;