import React from 'react';
import Display from './Display';
import Sidebar from './Sidebar';
import "../../assets/css/dashboard.css" ;

function Dashboard(props) {
    return (
      <div>
        {/* top bar */}
        dashboard
        <div id="main-area">
          <Sidebar className='sidebar' />
          <Display className='display' />
        </div>
      </div>
    );
}

export default Dashboard;