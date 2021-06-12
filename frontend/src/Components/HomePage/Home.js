import React, { Component } from 'react';
import About from './About';
import Intro from './Intro';
import ButtonAppBar from './Navbar';

class Home extends Component {
    render() {
        return (
          <div>
            <ButtonAppBar />
            <Intro/>
            <About/>
          </div>
        );
    }
}

export default Home;