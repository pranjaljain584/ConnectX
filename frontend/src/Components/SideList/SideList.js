import React, { useEffect, useState } from 'react';
import '../../assets/css/sidelist.css';
import SideListHeader from './SideListHeader';
import axios from 'axios';
import ChatListItem from './ChatListItem';
import { io } from 'socket.io-client';
import { connect } from 'react-redux';

const socket = io.connect('http://localhost:5000', {
  transports: ['websocket'],
});

function SideList(props) {
  const { sidebarSelectedItem, setRoomIdSelected } = props;
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
    const userId = props.auth.user?._id;
    socket.removeAllListeners(`create-room-${userId}`);

    socket.on(`create-room-${userId}`, function (data) {
      // console.log(`create-room-${userId}`);
      // console.log('--------------', data);
      setChatList((prevState) => {
        return [...prevState, data.room];
      });
    });

    socket.removeAllListeners(`leave-room-${userId}`);

    socket.on(`leave-room-${userId}`, function (data) {

      setChatList((prevState) => {
        return prevState.filter(function (r) {
          return r._id !== data.room._id;
        });

      });
    });
  }, []);

  return (
    <div className='sidelist-div'>
      <SideListHeader sidebarSelectedItem={sidebarSelectedItem} />
      <div className='list' id='style'>
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
                      ? chat.msgArray[chat.msgArray.length - 1].chatMessage
                      : chat.msgArray[chat.msgArray.length - 1].fileName
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

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(SideList);
