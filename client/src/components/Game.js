import React from "react";
import Tetris from 'react-tetris';
import 'materialize-css/dist/css/materialize.min.css';
import './Game.css';

const Game = () => (
  <Tetris>
    {({ HeldPiece, Gameboard, PieceQueue, points, linesCleared }) => (
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
        )
      }
  </Tetris>
)

export default Game;