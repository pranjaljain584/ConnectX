import React, { useState } from 'react';
import { connect } from 'react-redux';
import NewChatForm from './NewChatForm' ;
import '../../assets/css/sidelistheader.css' ;

function SideListHeader(props) {
  const { sidebarSelectedItem } = props;
  const userId = props.auth.user?._id ;

  // console.log('USER___>>', props);

  return (
    <div>
      <div className='sidelist-header'>
        <div className='sidelist-head'>{sidebarSelectedItem}</div>
        <div className='sidelist-btn'>
          {sidebarSelectedItem === 'Chat' && (
            // <div >
              // {' '}
              <NewChatForm userId={userId} />
            // </div>
          )}
        </div>
      </div>
      <hr className='line' />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(SideListHeader);
