import React from 'react';
import Game from './components/Game';
import 'materialize-css/dist/css/materialize.min.css';
import './App.css';

const App = () => (
  <div class='app container'>
    <h1>TetriBASS</h1>
    <Game />
  </div>
);

export default App;
