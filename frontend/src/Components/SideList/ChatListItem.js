import React from 'react';

function ChatListItem(props) {
    const {title,id,msgArray,setRoomIdSelected} = props ;
    return (
      <div
        onClick={() => {
        //   console.log('&&&', id);
          setRoomIdSelected(id);
        }}
      >
        {title} {id}{' '}
        {msgArray.length > 0 ? <span>Last msg</span> : <p>Empty</p>}
      </div>
    );
}

export default ChatListItem;