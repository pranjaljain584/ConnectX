import React from 'react';
import '../../assets/css/topbar.css';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { logout } from '../../actions/auth';
import { connect } from 'react-redux';

function TopBar(props) {
  const handleClick = () => {
    props.dispatch(logout());
  };

  return (
    <div className='topbar-div'>
      <div>
        <Link to='/loading' target='_blank'>
          <Button outline color='primary'>
            Start A New Meeting
          </Button>
        </Link>
      </div>
      <div className="logout">
        <Button onClick={handleClick}>Log Out</Button>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(TopBar);
