import React from 'react';
import '../../assets/css/topbar.css';
import { Button } from 'reactstrap';
import { logout } from '../../actions/auth';
import { connect } from 'react-redux';

function TopBar(props) {
  const handleClick = () => {
    props.dispatch(logout());
  };

  return (
    <div className='topbar-div'>
      <div className="logout">
        <Button color="danger" onClick={handleClick}>Log Out</Button>
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
