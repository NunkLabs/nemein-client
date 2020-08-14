import React, { Component } from 'react';
import LoginMenu from '../../components/LoginMenu';
import Game from '../../components/Game';
import './Main.css';

class Main extends Component 
{
  render() 
  {
    return (
      <div id='outer-container'>
        <LoginMenu />
        <Game />
      </div>
    )
  }
}

export default Main;
