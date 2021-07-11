import React from 'react';
import '../../assets/css/topbar.css';
import { Button } from 'reactstrap';
import { logout } from '../../actions/auth';
import { connect } from 'react-redux';
import Profile from './Profile';

function TopBar(props) {
  const handleClick = () => {
    // dispatch logout action
    props.dispatch(logout());
  };

  const name = props.auth?.user?.name;
  const email = props.auth?.user?.email;

  return (
    <div className='topbar-div'>
      <div className='logout'>
        <Button color='danger' onClick={handleClick}>
          Log Out
        </Button>
      </div>
      <Profile name={name} email={email} />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(TopBar);
