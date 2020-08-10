import React, { Component } from 'react';
import Game from '../../components/Game';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Landing.css';

class Landing extends Component {
  render() {
    return (
      <div class='app container'>
        <h1>TetriBASS</h1>
        <Game />
      </div>
    )
  }
}

export default Landing;
