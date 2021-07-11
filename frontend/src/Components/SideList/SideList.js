import React, { useEffect, useState } from 'react';
import '../../assets/css/sidelist.css';
import SideListHeader from './SideListHeader';
import axios from 'axios';
import ChatListItem from './ChatListItem';
import { io } from 'socket.io-client';
import { connect } from 'react-redux';
import FileListItem from '../File/FileListItem';
import { CircularProgress } from '@material-ui/core';

const socket = io.connect(`${process.env.REACT_APP_API_URL}`, {
  transports: ['websocket'],
});

function SideList(props) {
  const {
    sidebarSelectedItem,
    setRoomIdSelected,
    roomIdSelected,
    setFileSelected,
  } = props;
  const [chatList, setChatList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };

    if (sidebarSelectedItem === 'Chat') {
      // fetch user chats
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/chat/chat-list`, config)
        .then((response) => {
          setloading(false);
          setChatList(response.data.roomsArray);
        })
        .catch((err) => console.log(err));
    }

    if (sidebarSelectedItem === 'Files') {
      // fetch user files
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/file`, config)
        .then((response) => {
          console.log(response);
          setloading(false);
          setFileList(response.data.filesArray);
        })
        .catch((err) => console.log(err));
    }
  }, [sidebarSelectedItem]);

  useEffect(() => {
    const userId = props.auth.user?._id;

    // listen socket for creation of room for this user
    socket.removeAllListeners(`create-room-${userId}`);
    socket.on(`create-room-${userId}`, function (data) {
      setChatList((prevState) => {
        return [data.room, ...prevState];
      });
    });

    // listen socket for leaving room for this user
    socket.removeAllListeners(`leave-room-${userId}`);
    socket.on(`leave-room-${userId}`, function (data) {
      setChatList((prevState) => {
        return prevState.filter(function (r) {
          return r._id !== data.room._id;
        });
      });
      setRoomIdSelected('');
    });

    // cleanup
    return () => {
      socket.removeAllListeners(`create-room-${userId}`);
      socket.removeAllListeners(`leave-room-${userId}`);
    };
  }, []);

  useEffect(() => {}, [roomIdSelected]);

  return (
    <div className='sidelist-div'>
      <SideListHeader sidebarSelectedItem={sidebarSelectedItem} />
      <div className='list' id='style'>
        {loading && sidebarSelectedItem !== 'Video Call' ? (
          <CircularProgress color='primary' />
        ) : null}
        {(chatList.length && sidebarSelectedItem === 'Chat') > 0 ? (
          chatList.map((chat, key) => {
            return (
              <ChatListItem
                key={key}
                title={chat.title}
                id={chat._id}
                lastMsg={
                  chat.msgArray.length > 0
                    ? chat.msgArray[chat.msgArray.length - 1]
                    : null
                }
                time={
                  chat.msgArray.length > 0
                    ? chat.msgArray[chat.msgArray.length - 1].chatTime
                    : null
                }
                isMeet={chat.Meet ? true : false}
                setRoomIdSelected={setRoomIdSelected}
                setFileSelected={setFileSelected}
              />
            );
          })
        ) : (
          <div>
            {fileList.length > 0 && sidebarSelectedItem === 'Files' ? (
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
                {sidebarSelectedItem !== 'Files' ? (
                  <span>Start a New </span>
                ) : (
                  <span>No </span>
                )}
                {sidebarSelectedItem}
                {sidebarSelectedItem === 'Files' && <span> to show</span>}
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
