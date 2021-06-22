import React from 'react';
import '../../assets/css/sidebar.css';
import { Button } from '@material-ui/core';

function Sidebar({ setSidebarSelectedItem }) {
  const handleClick = (e) => {
    // e.preventDefault();
    // console.log(e.target.value) ;
    setSidebarSelectedItem(e);
  };

  return (
    <div className='sidebar-div'>
      sidebar
      <Button
        value='Chat'
        onClick={() => {
          setSidebarSelectedItem('Chat');
        }}
      >
        Chat
      </Button>
      <Button
        value='Calendar'
        onClick={() => {
          setSidebarSelectedItem('Calendar');
        }}
      >
        Calendar
      </Button>
    </div>
  );
}

export default Sidebar;
