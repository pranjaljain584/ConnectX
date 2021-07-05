import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import '../../assets/css/intro.css';

class Intro extends Component {
  render() {
    return (
      <div className='main-div'>
        <h1>ConnectX </h1>
        <p>
          Meet, chat, call, and collaborate in <br /> just one place.
        </p>
        <br />
        {this.props.isAuthenticated ? (
          <Link to="/dashboard">
            <Button className='btn' color='danger'>
              Open ConnectX
            </Button>
          </Link>
        ) : (
          <>
            {' '}
            <Link to='/login'>
              <Button className='btn' color='danger'>
                Sign In
              </Button>
            </Link>
            <Link to='/register'>
              <Button className='btn' outline color='danger'>
                Sign Up
              </Button>
            </Link>{' '}
          </>
        )}
      </div>
    );
  }
}

export default Intro;
