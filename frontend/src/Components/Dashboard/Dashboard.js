import React, { useEffect, useState } from 'react';
import Display from './Display';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import SideList from '../SideList/SideList';
import '../../assets/css/dashboard.css';

function Dashboard(props) {
  const [sidebarSelectedItem, setSidebarSelectedItem] = useState('');

  console.log("**",sidebarSelectedItem);

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
        />
        <Display className='display' />
      </div>
    </div>
  );
}

export default Dashboard;
