import React from 'react';
import { connect } from 'react-redux';
import NewChatForm from './NewChatForm' ;
import '../../assets/css/sidelistheader.css' ;

function SideListHeader(props) {
  const { sidebarSelectedItem } = props;
  const userId = props.auth.user?._id ;

  return (
    <div>
      <div className='sidelist-header'>
        <div className='sidelist-head'>{sidebarSelectedItem}</div>
        <div className='sidelist-btn'>
          {sidebarSelectedItem === 'Chat' && (
              <NewChatForm userId={userId} />
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
