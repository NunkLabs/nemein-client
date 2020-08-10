const React = require('react');
const Tetris = require('react-tetris');
require('./App.css');

const App = () => (
  <div className='app'>
    <h1>TetriBASS</h1>
    <Tetris>
      {({ HeldPiece, Gameboard, PieceQueue, points, linesCleared }) => {
        return (
          <div>
            <HeldPiece />
            <div>
              <p>Points: {points}</p>
              <p>Lines Cleared: {linesCleared}</p>
            </div>
            <Gameboard />
            <PieceQueue />
          </div>
        );
      }}
    </Tetris>
  </div>
);

export default App;
