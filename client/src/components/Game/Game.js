import React from 'react';
import Tetris from 'react-tetris';
import './Game.css';

const Game = () => (
  <div className='game-outer-frame'>
    <Tetris>
      {({ HeldPiece, Gameboard, PieceQueue, points, linesCleared }) => (
        <div className='game'>
          <div className='row justify-content-center'>
            <h1>TetriBASS</h1>
          </div>
          <div className='row justify-content-center'>
            <div className='col-5'>
              <p>Points</p>
              <p>{points}</p>
            </div>
            <div className='col-5'>
              <p>Lines</p>
              <p>{linesCleared}</p>
            </div>
          </div>
          <div className='row justify-content-center'>
            <div className='left-panel'>
              <HeldPiece />
            </div>
            <div className='main-panel'>
              <Gameboard />
            </div>
            <div className='right-panel'>
              <PieceQueue />
            </div>
          </div>
        </div>
      )}
    </Tetris>
  </div>
)

export default Game;