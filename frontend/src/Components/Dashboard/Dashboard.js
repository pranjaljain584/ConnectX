import React, { useState } from 'react';
import Display from './Display';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import SideList from '../SideList/SideList';
import '../../assets/css/dashboard.css';
import { connect } from 'react-redux';

function Dashboard(props) {
  const [sidebarSelectedItem, setSidebarSelectedItem] = useState('Video Call');
  const [roomIdSelected, setRoomIdSelected] = useState('');
  const [fileSelected, setFileSelected] = useState('');
  const userId = props.auth.user?._id;  ;

  return (
    <div>
      <TopBar />
      <div id='main-area'>
        <Sidebar
          className='sidebar'
          setRoomIdSelected={setRoomIdSelected}
          setFileSelected={setFileSelected}
          setSidebarSelectedItem={setSidebarSelectedItem}
        />
        {sidebarSelectedItem !== 'Calendar' && (
          <SideList
            className='sidelist'
            sidebarSelectedItem={sidebarSelectedItem}
            setFileSelected={setFileSelected}
            setRoomIdSelected={setRoomIdSelected}
            roomIdSelected = {roomIdSelected}
          />
        )}
        <Display
          className='display'
          fileSelected={fileSelected}
          roomIdSelected={roomIdSelected}
          sidebarSelectedItem={sidebarSelectedItem}
          userId={userId}
        />
      </div>
    </div>
  );
}
function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}
export default connect(mapStateToProps)(Dashboard);
