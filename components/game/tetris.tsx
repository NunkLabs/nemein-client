import { useEffect, useState } from 'react';

import * as TetrisConsts from 'constants/tetris';

/**
 * @brief: fieldToJsxElement: Convert a field of coords to a JSX element for
 * render
 * @param  {number[][]}     field  Field to render
 * @param  {boolean}        grid   Toggle for the game grid
 * @return {JSX.Element[]}         JSX element of field
 */
const fieldToJsxElement = (
  field: number[][],
  grid: boolean = false
): JSX.Element[] => {
  const retField: JSX.Element[] = [];

  field.forEach((col, colIndex) => {
    const rows = col.map((row, rowIndex) => (
      <div
        className={`row${grid ? `-wgrid row-wgrid-${row}` : ` row-${row}`}`}
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
    Array(TetrisConsts.MAX_SPAWNED_FIELDS)
      .fill(<div className="tetris-next" />)
      .map((_, index) => <div className="tetris-next" key={`next-${index}`} />)
  );

  useEffect(() => {
    if (!tetrisData) return;

    setLevel(tetrisData.level);
    setScore(tetrisData.score);

    /* Prepare an HTML element for the main game board */
    const renderField: number[][] = [];

    for (let y = 0; y < TetrisConsts.DEFAULT_BOARD_HEIGHT; y += 1) {
      const row = [];

      for (let x = 0; x < TetrisConsts.DEFAULT_BOARD_WIDTH; x += 1) {
        row.push(tetrisData.field[x].colArr[y]);
      }

      renderField.push(row);
    }

    setGameField(renderField);

    /* Prepare an HTML element for the currently held tetromino */
    setHeldField(TetrisConsts.RENDER_TETROMINOS_ARR[tetrisData.heldTetromino]);

    /* Prepare HTML elements for the tetromino queue */
    const spawnedFieldsRender: JSX.Element[][] = [];

    tetrisData.spawnedTetrominos.forEach(
      (tetromino: TetrisConsts.Tetromino) => {
        const spawnedFieldRender = fieldToJsxElement(
          TetrisConsts.RENDER_TETROMINOS_ARR[tetromino]
        );

        spawnedFieldsRender.push(spawnedFieldRender);
      }
    );

    const spawnedTetrominosFields = spawnedFieldsRender.map(
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
