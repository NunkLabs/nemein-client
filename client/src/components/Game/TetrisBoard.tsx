import React from 'react';

import * as TetrisConsts from './TetrisConsts';
import * as TetrisUtils from './TetrisUtils';

type TetrisBoardProps =
{
  field: number[][];
  score: number;
  level: number;
  spawnedTetrominos: TetrisConsts.Tetromino[];
  heldTetromino: TetrisConsts.Tetromino;
  firstGameStart: boolean;
  displayGrid: boolean;
};

const TetrisBoard: React.FC<TetrisBoardProps> = (props: TetrisBoardProps) => {
  const {
    field, score, level, spawnedTetrominos, heldTetromino, firstGameStart,
    displayGrid,
  } = props;
  const renderTetrominos = TetrisConsts.RENDER_TETROMINOS_ARR;

  /* Prepare an HTML element for the main game board */
  const gameBoard = TetrisUtils.fieldToJsxElement(field, displayGrid);

  /* Prepare HTML elements for the tetromino queue */
  const spawnedTetrominosFieldsRender: JSX.Element[][] = [];
  spawnedTetrominos.forEach((tetromino) => {
    const spawnedTetrominoField = firstGameStart ? renderTetrominos[tetromino]
      : renderTetrominos[TetrisConsts.Tetromino.Blank];
    const spawnedTetrominoFieldRender = TetrisUtils.fieldToJsxElement(
      spawnedTetrominoField, displayGrid,
    );
    spawnedTetrominosFieldsRender.push(spawnedTetrominoFieldRender);
  });

  const tetrominoRenderFields = spawnedTetrominosFieldsRender.map((tetromino) => <div className="tetris-next">{tetromino}</div>);

  /* Prepare an HTML element for the currently held tetromino */
  const heldTetrominoField = renderTetrominos[heldTetromino];
  const heldTetrominoFieldRender = TetrisUtils.fieldToJsxElement(
    heldTetrominoField, displayGrid,
  );

  return (
    <div>
      <div className="tetris-info">
        <div className="row">
          <div className="col">
            <p>
              LEVEL
            </p>
            <p>
              {level}
            </p>
          </div>
          <div className="col">
            <p>
              SCORE
            </p>
            <p>
              {score}
            </p>
          </div>
        </div>
      </div>
      <div className="tetris-gamespace">
        <div className="row">
          <div className="col">
            <div className="tetris-held">{heldTetrominoFieldRender}</div>
          </div>
          <div className="col">
            <div className="tetris-board">{gameBoard}</div>
          </div>
          <div className="col">
            <div>{tetrominoRenderFields}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TetrisBoard;
