import React, { useState } from 'react';
import { connect } from 'react-redux';
import NewChatForm from './NewChatForm' ;

function SideListHeader(props) {
  const { sidebarSelectedItem } = props;
  const userId = props.auth.user?._id ;

  console.log('USER___>>', props);

  return (
    <div>
      {sidebarSelectedItem}
      &nbsp; &nbsp;
      {sidebarSelectedItem === 'Chat' && <NewChatForm userId={userId} />}
      {/* <button>New Chat</button> */}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(SideListHeader);
