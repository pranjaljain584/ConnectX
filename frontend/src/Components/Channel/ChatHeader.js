import React from 'react';

function ChatHeader(props) {
    const {roomName} = props ;
    return (
        <div>
            Room Name -- {roomName}
        </div>
    );
}

export default ChatHeader;