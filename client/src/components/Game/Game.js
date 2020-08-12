import React from 'react';
import Tetris from 'react-tetris';
import './Game.css';

const Game = () => (
  <div class='game-outer-frame'>
    <Tetris>
      {({ HeldPiece, Gameboard, PieceQueue, points, linesCleared }) => (
        <div class='game'>
          <div class='row'>
            <h1>TetriBASS</h1>
          </div>
          <div class='row'>
            <div class='col-5 top-panel'>
              <p>Points</p>
            </div>
            <div class='col-1 top-panel'></div>
            <div class='col-5 top-panel'>
              <p>Lines</p>
            </div>
          </div>
          <div class='row'>
            <div class='col-5 top-panel'>
              <p>{points}</p>
            </div>
            <div class='col-1 top-panel'></div>
            <div class='col-5 top-panel'>
              <p>{linesCleared}</p>
            </div>
          </div>
          <div class='row'>
            <div class='left-panel'>
              <HeldPiece />
            </div>
            <div class='main-panel'>
              <Gameboard />
            </div>
            <div class='right-panel'>
              <PieceQueue />
            </div>
          </div>
        </div>
      )}
    </Tetris>
  </div>
)

export default Game;