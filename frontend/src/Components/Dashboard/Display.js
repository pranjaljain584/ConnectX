import React, { useEffect } from 'react';
import '../../assets/css/display.css' ;
import ChatRoom from '../Channel/ChatRoom' ;

function Display(props) {
    const {roomIdSelected} = props ;
    return (
      <div className='display-div'>
        {roomIdSelected !== '' && <ChatRoom roomIdSelected={roomIdSelected} />}
      </div>
    );
}

export default Display;