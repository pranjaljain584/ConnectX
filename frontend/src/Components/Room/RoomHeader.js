import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../assets/css/roomHeader.css';
import { faCommentDots, faUsers } from '@fortawesome/free-solid-svg-icons';

function RoomHeader(props) {
  return (
    <div className='room-header'>
      <div className='toggle-bar'>
        <div className='chat-head'>
          <div className='icon-block'>
            <FontAwesomeIcon className='icon' icon={faCommentDots} /> &nbsp;
            Chat
          </div>
        </div>
        <div className='participants-head'>
          <div className='icon-block'>
            <FontAwesomeIcon className='icon' icon={faUsers} />
            &nbsp; Participants
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomHeader;
