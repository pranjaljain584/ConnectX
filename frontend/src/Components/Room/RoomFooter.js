import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVideo,
  faInfo,
  faMicrophone,
  faDesktop,
  faMicrophoneSlash,
  faVideoSlash
} from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/pageFooter.css';

const RoomFooter = ({
  isPresenting,
  stopScreenShare,
  screenShare,
  isAudio,
  toggleAudio,
  isVideo,
  toggleVideo,
  disconnectCall,
}) => {
  return (
    <div className='footer-item'>
      <div className='center-item'>
        <div className='icon-block'>
          <FontAwesomeIcon className='icon' icon={faInfo} />
        </div>
        <div
          className={`icon-block ${!isAudio ? 'red-bg' : null}`}
          onClick={() => toggleAudio(!isAudio)}
        >
          <FontAwesomeIcon
            className='icon'
            icon={isAudio ? faMicrophone : faMicrophoneSlash}
          />
        </div>
        <div onClick={disconnectCall}>
          <div className='end-call'>End Call</div>
        </div>
        <div
          className={`icon-block ${!isVideo ? 'red-bg' : null}`}
          onClick={() => toggleVideo(!isVideo)}
        >
          <FontAwesomeIcon
            className='icon'
            icon={isVideo ? faVideo : faVideoSlash}
          />
        </div>
        {isPresenting ? (
          <div className='icon-block' onClick={stopScreenShare}>
            <FontAwesomeIcon className='icon blue' icon={faDesktop} />
          </div>
        ) : (
          <div className='icon-block' onClick={screenShare}>
            <FontAwesomeIcon className='icon' icon={faDesktop} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomFooter;
