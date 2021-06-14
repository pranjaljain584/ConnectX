import { Button } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';

function Display(props) {
    
    return (
      <div>
        display
        <Link to="/loading" target="_blank">
          <Button outline color='primary'>
            Start A New Meeting
          </Button>
        </Link>
      </div>
    );
}

export default Display;