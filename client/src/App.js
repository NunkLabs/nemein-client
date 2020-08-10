const React = require('react');
const Tetris = require('react-tetris');
require('materialize-css/dist/css/materialize.min.css');
require('./App.css');

const App = () => (
  <div class='app container'>
    <h1>TetriBASS</h1>
    <Tetris>
      {({ HeldPiece, Gameboard, PieceQueue, points, linesCleared }) => {
        return (
          <div class='row'>
            <div class="col">
              <HeldPiece />
              <div>
                <p>Points: {points}</p>
                <p>Lines Cleared: {linesCleared}</p>
              </div>
            </div>
            <div class='col'>
              <Gameboard />
            </div>
            <div class='col'>
              <PieceQueue />
            </div>
          </div>
        );
      }}
    </Tetris>
  </div>
);

export default App;
