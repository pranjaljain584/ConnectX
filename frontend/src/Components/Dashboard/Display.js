import React, { useEffect } from 'react';
import '../../assets/css/display.css' ;
import { Link } from 'react-router-dom';
import ChatRoom from '../Channel/ChatRoom' ;
import FileDisplay from '../File/FileDisplay';
import Calendar from '../Calendar/Calendar';

function Display(props) {
    const {roomIdSelected,fileSelected,sidebarSelectedItem} = props ;

    const myStyle = {marginLeft:'10%',width:'85vw' , height:'70vh'} ;
    useEffect(()=>{},[roomIdSelected]) ;
    return (
      <div className='display-div'>
        {sidebarSelectedItem == 'Calendar' && (
          <div style={myStyle}>
            <Calendar />
          </div>
        )}
        {roomIdSelected !== '' && <ChatRoom roomIdSelected={roomIdSelected} />}
        {fileSelected !== '' && <FileDisplay fileSelected={fileSelected} />}
        {sidebarSelectedItem == 'Video Call' && (
          <div className='meet-button'>
            <Link to='/loading' target='_blank'>
              <button>Start A New Meeting</button>
            </Link>
          </div>
        )}
      </div>
    );
}

export default Display;