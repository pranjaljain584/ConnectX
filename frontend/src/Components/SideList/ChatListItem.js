import React from 'react';

function ChatListItem(props) {
    const {title,id,msgArray} = props ;
    return (
        <div>
            {title} {id} {msgArray.length>0 ? <span>Last msg</span> : <p>Empty</p>}
        </div>
    );
}

export default ChatListItem;