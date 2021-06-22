import React, { useEffect, useState } from 'react';
import Display from './Display';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import SideList from '../SideList/SideList';
import '../../assets/css/dashboard.css';

function Dashboard(props) {
  const [sidebarSelectedItem, setSidebarSelectedItem] = useState('');
  const [roomIdSelected, setRoomIdSelected] = useState('');

  // console.log('**', sidebarSelectedItem);
  // console.log('room id: ', roomIdSelected);

  return (
    <div>
      <TopBar />
      <div id='main-area'>
        <Sidebar
          className='sidebar'
          setSidebarSelectedItem={setSidebarSelectedItem}
        />
        <SideList
          className='sidelist'
          sidebarSelectedItem={sidebarSelectedItem}
          setRoomIdSelected={setRoomIdSelected}
        />
        <Display className='display' roomIdSelected={roomIdSelected} />
      </div>
    </div>
  );
}

export default Dashboard;
