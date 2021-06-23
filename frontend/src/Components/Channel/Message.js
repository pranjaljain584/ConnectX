import React from 'react';
import { connect } from 'react-redux';
import '../../assets/css/chatroom.css';

function Message(props) {
  const { chatMessage, chatTime, userName, userId } = props.msg;
  const id = props.auth?.user?._id ;
//   console.log(props.auth) ;
  return (
    <div className={`msg-div ${userId===id ? ' msg-self' : ''}`}>
      <div className='msg-top' >{ userId!==id ? userName : "You"}</div>
      <div className='msg-mid'>{chatMessage}</div>
      <div className='msg-bottom'>{chatTime}</div>
    </div>
  );
}


function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(Message);
