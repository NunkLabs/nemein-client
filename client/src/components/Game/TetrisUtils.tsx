import * as TetrisConsts from './TetrisConsts';

/**
 * @brief: getNewTile: Get a tile from the spawned tiles queue.
 * If the queue's size is less than the maximum size, we add to it
 * a new tile.
 * @param[in]: tiles - Spawned tiles queue
 * @return: newTile - Tile pop from the queue
 *          newTiles - Updated queue
 */
export function getNewTile(spawnedTiles: TetrisConsts.Tile[]): {
  newTile: TetrisConsts.Tile;
  newTiles: TetrisConsts.Tile[];
} {
  const retTiles = spawnedTiles;
  const retTile = retTiles.shift();
  /* Shift method might return undefined */
  if (retTile === undefined) {
    throw new Error('Cannot fetch a new tile from tile array');
  }

  /* Add a new tile to spawned tiles queue if size is less than max size */
  if (retTiles.length < TetrisConsts.MAX_SPAWNED_TILES) {
    retTiles.push(Math.floor(Math.random()
    * (TetrisConsts.MAX_TILE_INDEX - TetrisConsts.MIN_TILE_INDEX + 1)) + 1);
  }

  return {
    newTile: retTile,
    newTiles: retTiles,
  };
}

/**
 * @brief: fieldToJsxElement: Convert a field of coords to a JSX element for render
 * @param[in]: field - Field to render
 * @return: JSX element of field
 */
export function fieldToJsxElement(field: number[][], grid: boolean): JSX.Element[] {
  const retField: JSX.Element[] = [];

  field.forEach((col) => {
    // eslint-disable-next-line react/react-in-jsx-scope
    const rows = col.map((row: number) => <div className={`row${grid ? '-wgrid' : ''}-${row}`} />);
    // eslint-disable-next-line react/react-in-jsx-scope
    retField.push(<div className="tetris-col">{rows}</div>);
  });

  return retField;
}

export default {
  getNewTile,
  fieldToJsxElement,
};
