import React from "react";
import Tetris from 'react-tetris';

const Game = () => (
  <Tetris>
    {({ HeldPiece, Gameboard, PieceQueue, points, linesCleared }) => (
          <div class='full-height game'>
            <div class='row'>
              <div class='col top-panel'>
                <h2>Points</h2>
              </div>
              <div class='col top-panel'>
                <h2>Lines</h2>
              </div>
            </div>
            <div class='row'>
              <div class='col top-panel'>
                <p>{points}</p>
              </div>
              <div class='col top-panel'>
                <p>{linesCleared}</p>
              </div>
            </div>
            <div class='row'>
              <div class='col left-panel'>
                <HeldPiece />
              </div>
              <div class='col main-panel'>
                <Gameboard />
              </div>
              <div class='col right-panel'>
                <PieceQueue />
              </div>
            </div>
          </div>
        )
      }
  </Tetris>
)

export default Game;