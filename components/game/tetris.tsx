import { useEffect, useState } from 'react';

import * as TetrisConsts from 'constants/tetris';

/**
 * @brief: fieldToJsxElement: Convert a field of coords to a JSX element for
 * render
 * @param[in]: field - Field to render
 * @return: JSX element of field
 */
const fieldToJsxElement = (
  field: number[][],
  grid: boolean = false
): JSX.Element[] => {
  const retField: JSX.Element[] = [];

  field.forEach((col, colIndex) => {
    const rows = col.map((row, rowIndex) => (
      <div
        className={`
          row${grid ? '-wgrid' : ''} row${grid ? '-wgrid' : ''}-${row}
        `}
        key={`row-${rowIndex}`}
      />
    ));

    retField.push(
      <div className="flex" key={`col-${colIndex}`}>
        {rows}
      </div>
    );
  });

  return retField;
};

export const Tetris = ({ tetrisData }: MessageEvent['data']) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  const [gameField, setGameField] = useState<number[][]>([]);
  const [heldField, setHeldField] = useState<number[][]>(
    TetrisConsts.RENDER_TETROMINOS_ARR[0]
  );
  const [spawnedFields, setSpawnedFields] = useState<JSX.Element[]>(
    Array(TetrisConsts.MAX_SPAWNED_FIELDS).map((_, index) => (
      <div className="tetris-next" key={`next-${index}`} />
    ))
  );

  useEffect(() => {
    if (!tetrisData) return;

    const { field, heldTetromino, spawnedTetrominos } = tetrisData;

    /* Prepare an HTML element for the main game board */
    const renderField: number[][] = [];

    for (let y = 0; y < 23; y += 1) {
      const row = [];

      for (let x = 0; x < 14; x += 1) {
        row.push(field[x].colArr[y]);
      }

      renderField.push(row);
    }

    setGameField(renderField);

    /* Prepare an HTML element for the currently held tetromino */
    setHeldField(TetrisConsts.RENDER_TETROMINOS_ARR[heldTetromino]);

    /* Prepare HTML elements for the tetromino queue */
    const spawnedTetrominosFieldsRender: JSX.Element[][] = [];

    spawnedTetrominos.forEach((tetromino: TetrisConsts.Tetromino) => {
      const spawnedTetrominoFieldRender = fieldToJsxElement(
        TetrisConsts.RENDER_TETROMINOS_ARR[tetromino]
      );

      spawnedTetrominosFieldsRender.push(spawnedTetrominoFieldRender);
    });

    const spawnedTetrominosFields = spawnedTetrominosFieldsRender.map(
      (tetromino, index) => (
        <div className="tetris-next" key={`next-${index}`}>
          {tetromino}
        </div>
      )
    );

    setSpawnedFields(spawnedTetrominosFields);
  }, [tetrisData]);

  return (
    <div className="grid place-items-center">
      <div className="tetris-info">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p>LEVEL</p>
            <p>{level}</p>
          </div>
          <div>
            <p>SCORE</p>
            <p>{score}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="tetris-held place-self-start">
          {fieldToJsxElement(heldField)}
        </div>
        <div className="tetris-board">{fieldToJsxElement(gameField)}</div>
        <div className="tetris-queue grid grid-rows-4 gap-3">
          {spawnedFields}
        </div>
      </div>
    </div>
  );
};
