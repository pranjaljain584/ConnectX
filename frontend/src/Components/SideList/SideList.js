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
          // console.log('Chat List---', response.data);

          setChatList(response.data.roomsArray);
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
      <div className="list" id="style">
        {chatList.length > 0 ? (
          chatList.map((chat, key) => {
            return (
              <ChatListItem
                key={key}
                title={chat.title}
                id={chat._id}
                lastMsg={
                  chat.msgArray.length > 0
                    ? chat.msgArray[chat.msgArray.length - 1].chatMessage
                    : null
                }
                time={
                  chat.msgArray.length > 0
                    ? chat.msgArray[chat.msgArray.length - 1].chatTime
                    : null
                }
                setRoomIdSelected={setRoomIdSelected}
              />
            );
          })
        ) : (
          <p>Empty chat list</p>
        )}
      </div>
    </div>
  );
}

export default SideList;
