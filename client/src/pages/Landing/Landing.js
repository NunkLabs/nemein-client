import React, { Component } from 'react';
import LoginForm from '../../components/LoginForm';
import Game from '../../components/Game';

class Landing extends Component {
  render() {
    return (
      <div class='full-height bg'>
        <div class='full-height app'>
          <div class='full-height row'>
            <div class='col-4 form-bg'>
              <div class='form'>
                <h1>TetriBASS</h1>
                <LoginForm />
              </div>
            </div>
            <div class='col-8'>
              <div class='game'>
                <Game />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Landing;
