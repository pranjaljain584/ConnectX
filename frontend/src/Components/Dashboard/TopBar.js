import React from 'react';
import '../../assets/css/topbar.css';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

function TopBar(props) {
    return (
      <div className='topbar-div'>
        <Link to='/loading' target='_blank'>
          <Button outline color='primary'>
            Start A New Meeting
          </Button>
        </Link>
      </div>
    );
}

export default TopBar;