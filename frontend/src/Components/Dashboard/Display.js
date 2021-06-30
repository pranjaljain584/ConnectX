import React, { useEffect } from 'react';
import '../../assets/css/display.css' ;
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import ChatRoom from '../Channel/ChatRoom' ;
import FileDisplay from '../File/FileDisplay';

function Display(props) {
    const {roomIdSelected,fileSelected,sidebarSelectedItem} = props ;
    return (
      <div className='display-div'>
        {roomIdSelected !== '' && <ChatRoom roomIdSelected={roomIdSelected} />}
        {fileSelected !== '' && <FileDisplay fileSelected={fileSelected} />}
        {sidebarSelectedItem == 'Video Call' && (
          <div>
            <Link to='/loading' target='_blank'>
              <Button outline color='primary'>
                Start A New Meeting
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
}

export default Display;