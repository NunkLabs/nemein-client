import React, { Component } from 'react';
import LoginForm from '../../components/LoginForm';
import Game from '../../components/Game';
import './Main.css';

class Main extends Component {
  render() {
    return (
      <div class='main'>
        <div class='row'>
          <div class='col'>
            <LoginForm />
          </div>
          <div class='col'>
            <Game />
          </div>
        </div>
      </div>
    )
  }
}

export default Main;
