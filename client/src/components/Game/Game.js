import React from "react";
import Tetris from 'react-tetris';
import './Game.css';

const Game = () => (
  <Tetris>
    {({ HeldPiece, Gameboard, PieceQueue, points, linesCleared }) => (
          <div class='row'>
            <div class='col-3'>
              <HeldPiece />
              <div>
                <p>Points: {points}</p>
                <p>Lines Cleared: {linesCleared}</p>
              </div>
            </div>
            <div class='col-6'>
              <Gameboard />
            </div>
            <div class='col-3'>
              <PieceQueue />
            </div>
          </div>
        )
      }
  </Tetris>
)

export default Game;