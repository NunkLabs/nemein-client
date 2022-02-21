import * as TetrisConsts from './TetrisConsts';

/**
 * @brief: getNewTetromino: Get a tetromino from the spawned tetrominos queue.
 * If the queue's size is less than the maximum size, we add to it
 * a new tetromino.
 * @param[in]: tetrominos - Spawned tetrominos queue
 * @return: newTetromino - Tetromino pop from the queue
 *          newTetrominos - Updated queue
 */
function getNewTetromino(spawnedTetrominos: TetrisConsts.Tetromino[]): {
  newTetromino: TetrisConsts.Tetromino;
  newTetrominos: TetrisConsts.Tetromino[];
} {
  const retTetrominos = spawnedTetrominos;
  const retTetromino = retTetrominos.shift();
  /* Shift method might return undefined */
  if (retTetromino === undefined) {
    throw new Error('Cannot fetch a new tetromino from queue');
  }

  /* Add a new tetromino to spawned tetrominos queue if size is less than max
  size */
  if (retTetrominos.length < TetrisConsts.MAX_SPAWNED_TETROMINOS) {
    retTetrominos.push(
      Math.floor(
        Math.random() *
          (TetrisConsts.MAX_TETROMINO_INDEX -
            TetrisConsts.MIN_TETROMINO_INDEX +
            1)
      ) + 1
    );
  }

  return {
    newTetromino: retTetromino,
    newTetrominos: retTetrominos,
  };
}

/**
 * @brief: fieldToJsxElement: Convert a field of coords to a JSX element for
 * render
 * @param[in]: field - Field to render
 * @return: JSX element of field
 */
function fieldToJsxElement(field: number[][], grid: boolean): JSX.Element[] {
  const retField: JSX.Element[] = [];

  field.forEach((col) => {
    const rows = col.map((row: number) => (
      // eslint-disable-next-line react/jsx-key
      <div
        className={`
          row${grid ? '-wgrid' : ''} row${grid ? '-wgrid' : ''}-${row}
        `}
      />
    ));

    // eslint-disable-next-line react/react-in-jsx-scope
    retField.push(<div className="flex">{rows}</div>);
  });

  return retField;
}

export { getNewTetromino, fieldToJsxElement };
