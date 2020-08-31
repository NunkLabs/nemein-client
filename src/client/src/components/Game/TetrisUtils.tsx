import React from 'react';
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
 * @brief: getTileField: Get the render field of a single tile
 * @param[in]: tile - Tile to render
 * @param[in]: tileRotate - Rotation of the tile to render
 * @return: Field of coords of the tile to render
 */
export function getTileField(
  tile: TetrisConsts.Tile,
  tileRotate: TetrisConsts.Rotation,
): number[][] {
  const tiles = TetrisConsts.TILES_COORDS_ARR;

  /* First, we find the pivot of the tile */
  const pivotX = -tiles[tile][tileRotate][TetrisConsts.LOWER_X_INDEX][TetrisConsts.X_INDEX];
  const pivotY = -tiles[tile][tileRotate][TetrisConsts.LOWER_Y_INDEX][TetrisConsts.Y_INDEX];

  /* Find all the (x,y) points to render */
  const coordsToRender: {x: number; y: number}[] = [];
  for (let pixelIter = 0; pixelIter < TetrisConsts.MAX_PIXEL; pixelIter += 1) {
    const renderX = pivotX + tiles[tile][tileRotate][pixelIter][TetrisConsts.X_INDEX];
    const renderY = pivotY + tiles[tile][tileRotate][pixelIter][TetrisConsts.Y_INDEX];
    coordsToRender.push({ x: renderX, y: renderY });
  }

  /* Init a blank field for the tile */
  const retField: number[][] = [];
  for (let x = 0; x < TetrisConsts.MAX_PIXEL; x += 1) {
    const col: number[] = [];
    for (let y = 0; y < TetrisConsts.MAX_PIXEL; y += 1) {
      col.push(0);
    }
    retField.push(col);
  }

  /* Populate the return field with the correct render values for each pixel */
  coordsToRender.forEach((coord) => {
    retField[coord.y][coord.x] = tile;
  });

  return retField;
}

/**
 * @brief: fieldToJsxElement: Convert a field of coords to a JSX element for render
 * @param[in]: field - Field to render
 * @return: JSX element of field
 */
export function fieldToJsxElement(field: number[][]): JSX.Element[] {
  const retField: JSX.Element[] = [];

  field.forEach((col) => {
    const rows = col.map((row: number) => <div className={`row-${row}`} />);
    retField.push(<div className="tetris-col">{rows}</div>);
  });

  return retField;
}

export default {
  getNewTile,
  getTileField,
  fieldToJsxElement,
};
