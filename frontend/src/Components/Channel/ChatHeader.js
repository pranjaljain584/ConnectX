import React from 'react';
import '../../assets/css/chatroom.css';

function ChatHeader(props) {
    const {roomName} = props ;
    return (
        <div className="chat-header" >
            {roomName}
            {/* <hr /> */}
        </div>
    );
}

export default ChatHeader;