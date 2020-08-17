import React from 'react';
import LoginForm from '../components/LoginForm/LoginForm';
import Tetris from '../components/Game/Tetris';
import './Main.css';

const Main = (): JSX.Element => (
  <div id="outer-container">
    <LoginForm />
    <div id="game-wrap">
      <Tetris boardWidth="14" boardHeight="20" />
    </div>
  </div>
);

export default Main;
