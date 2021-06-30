import React, { useState } from 'react';
import '../../assets/css/sidebar.css';
import {
  faComment,
  faCalendarAlt,
  faFileAlt,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Sidebar({ setSidebarSelectedItem }) {
  const [selectedChat, setSelectedChat] = useState(false);
  const [selectedCal, setSelectedCal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(false);
  const [selectedCall, setSelectedCall] = useState(true);

  return (
    <div className='sidebar-div'>
      <div
        value='Video Call'
        onClick={() => {
          setSidebarSelectedItem('Video Call');
          setSelectedCal(false);
          setSelectedFiles(false);
          setSelectedChat(false);
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
