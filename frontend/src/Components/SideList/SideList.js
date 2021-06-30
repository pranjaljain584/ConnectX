import React, { useEffect, useState } from 'react';
import '../../assets/css/sidelist.css';
import SideListHeader from './SideListHeader';
import axios from 'axios';
import ChatListItem from './ChatListItem';
import { io } from 'socket.io-client';
import { connect } from 'react-redux';
import FileListItem from '../File/FileListItem';

const socket = io.connect('http://localhost:5000', {
  transports: ['websocket'],
});

function SideList(props) {
  const { sidebarSelectedItem, setRoomIdSelected, setFileSelected } = props;
  const [chatList, setChatList] = useState([]);
  const [fileList, setFileList] = useState([]);

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
        })
        .catch((err) => console.log(err));
    }

    if (sidebarSelectedItem === 'Files') {
      axios
        .get(`http://localhost:5000/api/file`, config)
        .then((response) => {
          console.log(response);
          setFileList(response.data.filesArray);
        })
        .catch((err) => console.log(err));
    }
  }, [sidebarSelectedItem]);

  useEffect(() => {
    const userId = props.auth.user?._id;
    socket.removeAllListeners(`create-room-${userId}`);

    socket.on(`create-room-${userId}`, function (data) {
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
      setRoomIdSelected("") ;
    });
  }, []);

  return (
    <div className='sidelist-div'>
      <SideListHeader sidebarSelectedItem={sidebarSelectedItem} />
      <div className='list' id='style'>
        {(chatList.length && sidebarSelectedItem == 'Chat') > 0 ? (
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
                setFileSelected={setFileSelected}
              />
            );
          })
        ) : (
          <div>
            {fileList.length > 0 && sidebarSelectedItem == 'Files' ? (
              <div>
                {fileList.map((file, key) => {
                  return (
                    <FileListItem
                      setFileSelected={setFileSelected}
                      setRoomIdSelected={setRoomIdSelected}
                      file={file}
                      key={key}
                    />
                  );
                })}
              </div>
            ) : (
              <p>
                {sidebarSelectedItem != 'Files' ? (
                  <span>Start a New </span>
                ) : (
                  <span>No </span>
                )}
                {sidebarSelectedItem}
                {sidebarSelectedItem == 'Files' && <span> to show</span>}
              </p>
            )}
          </div>
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
