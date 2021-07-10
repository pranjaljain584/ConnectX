import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../assets/css/roomHeader.css';
import { faCommentDots, faUsers } from '@fortawesome/free-solid-svg-icons';

function RoomHeader({selectHead,head}) {
  return (
    <div className='room-header'>
      <div className='toggle-bar'>
        <div
          className='chat-head'
          onClick={() => selectHead('Chat')}
          style={{
            backgroundColor: `${head === 'Chat' ? '#10b664' : '#1a1b20'}`,
            borderRadius: `${head === 'Chat' ? '0.5rem' : null}`,
            color: `${head === 'Chat' ? 'white' : '#616065'}`,
          }}
        >
          <div className='icon-block'>
            <FontAwesomeIcon className='icon' icon={faCommentDots} /> &nbsp;
            Chat
          </div>
        </div>
        <div
          className='participants-head'
          onClick={() => selectHead('Participants')}
          style={{
            backgroundColor: `${
              head === 'Participants' ? '#10b664' : '#1a1b20'
            }`,
            borderRadius: `${head === 'Participants' ? '0.5rem' : null}`,
            color: `${head === 'Participants' ? 'white' : '#616065'}`,
          }}
        >
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
