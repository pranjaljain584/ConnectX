import React, { useEffect, useState } from 'react';
import Display from './Display';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import SideList from '../SideList/SideList';
import '../../assets/css/dashboard.css';

function Dashboard(props) {
  const [sidebarSelectedItem, setSidebarSelectedItem] = useState('Video Call');
  const [roomIdSelected, setRoomIdSelected] = useState('');
  const [fileSelected, setFileSelected] = useState('');

  return (
    <div>
      <TopBar />
      <div id='main-area'>
        <Sidebar
          className='sidebar'
          setSidebarSelectedItem={setSidebarSelectedItem}
        />
        { sidebarSelectedItem!='Calendar' && <SideList
          className='sidelist'
          sidebarSelectedItem={sidebarSelectedItem}
          setFileSelected={setFileSelected}
          setRoomIdSelected={setRoomIdSelected}
        />}
        <Display
          className='display'
          fileSelected={fileSelected}
          roomIdSelected={roomIdSelected}
          sidebarSelectedItem={sidebarSelectedItem}
        />
      </div>
    </div>
  );
}

export default Dashboard;
