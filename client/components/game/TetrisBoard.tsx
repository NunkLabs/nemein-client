import * as TetrisConsts from './TetrisConsts';
import * as TetrisUtils from './TetrisUtils';

type TetrisBoardProps = {
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
    field,
    score,
    level,
    spawnedTetrominos,
    heldTetromino,
    firstGameStart,
    displayGrid,
  } = props;
  const renderTetrominos = TetrisConsts.RENDER_TETROMINOS_ARR;

  /* Prepare an HTML element for the main game board */
  const gameBoard = TetrisUtils.fieldToJsxElement(field, displayGrid);

  /* Prepare HTML elements for the tetromino queue */
  const spawnedTetrominosFieldsRender: JSX.Element[][] = [];
  spawnedTetrominos.forEach((tetromino) => {
    const spawnedTetrominoField = firstGameStart
      ? renderTetrominos[tetromino]
      : renderTetrominos[TetrisConsts.Tetromino.Blank];
    const spawnedTetrominoFieldRender = TetrisUtils.fieldToJsxElement(
      spawnedTetrominoField,
      displayGrid
    );
    spawnedTetrominosFieldsRender.push(spawnedTetrominoFieldRender);
  });

  const tetrominoRenderFields = spawnedTetrominosFieldsRender
    // eslint-disable-next-line react/jsx-key
    .map((tetromino) => <div className="tetris-next">{tetromino}</div>);

  /* Prepare an HTML element for the currently held tetromino */
  const heldTetrominoField = renderTetrominos[heldTetromino];
  const heldTetrominoFieldRender = TetrisUtils.fieldToJsxElement(
    heldTetrominoField,
    displayGrid
  );

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
          {heldTetrominoFieldRender}
        </div>
        <div className="tetris-board">{gameBoard}</div>
        <div className="tetris-queue grid grid-rows-4 gap-3">
          {tetrominoRenderFields}
        </div>
      </div>
    </div>
  );
};

export default TetrisBoard;
