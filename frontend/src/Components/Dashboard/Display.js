import React, { useEffect } from 'react';
import '../../assets/css/display.css' ;
import ChatRoom from '../Channel/ChatRoom' ;
import FileDisplay from '../File/FileDisplay';

function Display(props) {
    const {roomIdSelected,fileSelected} = props ;
    return (
      <div className='display-div'>
        {roomIdSelected !== '' && <ChatRoom roomIdSelected={roomIdSelected} />}
        {fileSelected !== '' && <FileDisplay fileSelected={fileSelected} />}
      </div>
    );
}

export default Display;