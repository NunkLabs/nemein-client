import React, { Component } from 'react';
import LoginForm from '../../components/LoginForm';
import Game from '../../components/Game';

class Main extends Component {
  render() {
    return (
      <div class='app full-height'>
        <div class='row full-height'>
          <div class='col form-bg'>
            <LoginForm />
          </div>
          <div class='col game-bg'>
            <Game />
          </div>
        </div>
      </div>
    )
  }
}

export default Main;
