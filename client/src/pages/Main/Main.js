import React, { Component } from 'react';
import LoginForm from '../../components/LoginForm';
import Game from '../../components/Game';
import './Main.css';

class Main extends Component {
  render() {
    return (
      <div className='app'>
        <div className='main'>
          <LoginForm />
          <Game />
        </div>
      </div>
    )
  }
}

export default Main;
