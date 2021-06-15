import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy
} from '@fortawesome/free-solid-svg-icons';

function MeetingInfo(props) {
  const {url} = props ;
  return (
    <div>
      <div className='meet-link'>
        MeetLink: <span>{url}</span>
        <FontAwesomeIcon
          className='icon'
          icon={faCopy}
          onClick={() => navigator.clipboard.writeText(url)}
        />
      </div>
    </div>
  );
}

export default MeetingInfo;
