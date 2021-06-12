import React, { Component } from 'react';
import { Button } from 'reactstrap';
import "../../css/intro.css" ;

class Intro extends Component {
    render() {
        return (
          <div className='main-div'>
            <h1>Microsoft Teams </h1>
            <p>
              Meet, chat, call, and collaborate in <br /> just one place.
            </p>
            <br />
            <Button className='btn' color='danger'>
              Sign In
            </Button>
            <Button className='btn' outline color='danger'>
            Sign Up
            </Button>
          </div>
        );
    }
}

export default Intro;