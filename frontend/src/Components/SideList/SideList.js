import React, { useEffect, useState } from 'react';
import '../../assets/css/sidelist.css';
import SideListHeader from './SideListHeader';
import axios from 'axios';
import ChatListItem from './ChatListItem';
import { io } from 'socket.io-client';

const socket = io.connect('http://localhost:5000', {
  transports: ['websocket'],
});

function SideList({ sidebarSelectedItem, setRoomIdSelected }) {
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };

    if (sidebarSelectedItem === 'Chat') {
      console.log('here');
      axios
        .get(`http://localhost:5000/api/chat/chat-list`, config)
        .then((response) => {
          setChatList(response.data.roomsArray);
          console.log(chatList);
        })
        .catch((err) => console.log(err));
    }
  }, [sidebarSelectedItem]);

  useEffect(() => {
    socket.on('create-room-client', function (data) {
      setChatList((prevState) => {
        return [...prevState, data.room];
      });
    });
  }, []);

  return (
    <div className='sidelist-div'>
      <SideListHeader sidebarSelectedItem={sidebarSelectedItem} />
      {chatList.length > 0 ? (
        chatList.map((chat, key) => {
          return (
            <ChatListItem
              key={key}
              title={chat.title}
              id={chat._id}
              msgArray={chat.msgArray}
              setRoomIdSelected={setRoomIdSelected}
            />
          );
        })
      ) : (
        <p>Empty chat list</p>
      )}
    </div>
  );
}

export default SideList;
