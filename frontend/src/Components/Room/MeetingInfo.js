import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/meetinginfo.css';

function MeetingInfo() {
  return (
    <div className='meeting-info-block'>
      <div className='meeting-header'>
        <h3>Invite Others</h3>
      </div>
      <button className='add-people-btn'>
        <FontAwesomeIcon className='icon' icon={faUser} />
        Add Others
      </button>

      <br />
      <input type='email' placeholder='Email'></input>
    </div>
  );
}

export default MeetingInfo;
