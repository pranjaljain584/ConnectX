import React, { useState } from 'react';
import '../../assets/css/sidebar.css';
import {
  faComment,
  faCalendarAlt,
  faFileAlt,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Sidebar({
  setSidebarSelectedItem,
  setRoomIdSelected,
  setFileSelected,
}) {
  const [selectedChat, setSelectedChat] = useState(false);
  const [selectedCal, setSelectedCal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(false);
  const [selectedCall, setSelectedCall] = useState(true);

  return (
    <div
      className='sidebar-div'
      style={selectedCal ? { width: '4.799vw' } : { width: '4.95vw' }}
    >
      <div
        value='Video Call'
        onClick={() => {
          setSidebarSelectedItem('Video Call');
          setRoomIdSelected('');
          setFileSelected('');
          setSelectedCal(false);
          setSelectedFiles(false);
          setSelectedChat(false);
          setSelectedCall(true);
        }}
      >
        <FontAwesomeIcon
          className={`icon ${selectedCall ? ' white' : ''}`}
          icon={faVideo}
        />
      </div>
      <div
        value='Chat'
        onClick={() => {
          setSidebarSelectedItem('Chat');
          setSelectedCal(false);
          setRoomIdSelected('');
          setFileSelected('');
          setSelectedFiles(false);
          setSelectedCall(false);
          setSelectedChat(true);
        }}
      >
        <FontAwesomeIcon
          className={`icon ${selectedChat ? ' white' : ''}`}
          icon={faComment}
        />
      </div>
      <div
        value='Calendar'
        onClick={() => {
          setSidebarSelectedItem('Calendar');
          setSelectedChat(false);
          setRoomIdSelected('');
          setFileSelected('');
          setSelectedFiles(false);
          setSelectedCall(false);
          setSelectedCal(true);
        }}
      >
        <FontAwesomeIcon
          className={`icon ${selectedCal ? ' white' : ''}`}
          icon={faCalendarAlt}
        />
      </div>

      <div
        value='Files'
        onClick={() => {
          setSidebarSelectedItem('Files');
          setSelectedChat(false);
          setRoomIdSelected('');
          setFileSelected('');
          setSelectedCal(false);
          setSelectedCall(false);
          setSelectedFiles(true);
        }}
      >
        <FontAwesomeIcon
          className={`icon ${selectedFiles ? ' white' : ''}`}
          icon={faFileAlt}
        />
      </div>
    </div>
  );
}

export default Sidebar;
