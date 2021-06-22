import React, { useState } from 'react';

function ChatFooter(props) {
    const [msg , setMsg] = useState('') ;
    const {roomIdSelected} = props ;

    const handleChange = (e) => {
        setMsg(e.target.value) ;
    }
    return (
        <div>
            <input type="text" onChange={handleChange}></input>
        </div>
    );
}

export default ChatFooter;