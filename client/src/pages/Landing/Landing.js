import React, { Component } from 'react';
import Game from '../../components/Game';
import 'materialize-css/dist/css/materialize.min.css';
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
