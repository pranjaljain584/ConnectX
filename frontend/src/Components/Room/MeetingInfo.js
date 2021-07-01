import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy,
  faTimes,
  faUser,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/meetinginfo.css';

function MeetingInfo(props) {
  const { url } = props;
  return (
    <div className='meeting-info-block'>
      <div className='meeting-header'>
        <h3>Invite Others</h3>
      </div>
      <button className='add-people-btn'>
        <FontAwesomeIcon className='icon' icon={faUser} />
        Add Others
      </button>

<br/>
      <input type="email" placeholder="Email"></input>
      {/*
      <p className='info-text'>
        share this meeting link with others you want in the meeting
      </p>
      
      <p className='small-text'>Joined as akshay@gmail.com</p> */}
    </div>
  );
}

export default MeetingInfo;
