import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../assets/css/roomHeader.css';
import { faCommentDots, faUsers } from '@fortawesome/free-solid-svg-icons';

function RoomHeader({selectHead}) {
  return (
    <div className='room-header'>
      <div className='toggle-bar'>
        <div className='chat-head' onClick={() => selectHead('Chat')}>
          <div className='icon-block'>
            <FontAwesomeIcon className='icon' icon={faCommentDots} /> &nbsp;
            Chat
          </div>
        </div>
        <div className='participants-head' onClick={() => selectHead('Participants')}>
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
