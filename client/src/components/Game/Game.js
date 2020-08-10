import React from "react";
import Tetris from 'react-tetris';

const Game = () => (
  <Tetris>
    {({ HeldPiece, Gameboard, PieceQueue, points, linesCleared }) => (
          <div class='container-fluid'>
            <div class='row'>
              <div class='col'>
                <h2>Points</h2>
              </div>
              <div class='col'>
                <h2>Lines</h2>
              </div>
            </div>
            <div class='row'>
              <div class='col'>
                <p>{points}</p>
              </div>
              <div class='col'>
                <p>{linesCleared}</p>
              </div>
            </div>
            <div class='row'>
              <div class='col-3'>
                <HeldPiece />
              </div>
              <div class='col-6'>
                <Gameboard />
              </div>
              <div class='col-3'>
                <PieceQueue />
              </div>
            </div>
          </div>
        )
      }
  </Tetris>
)

export default Game;