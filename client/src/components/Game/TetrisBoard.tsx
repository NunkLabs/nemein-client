import React from 'react';

import * as TetrisConsts from './TetrisConsts';
import * as TetrisUtils from './TetrisUtils';

type TetrisBoardProps =
{
  field: number[][];
  score: number;
  level: number;
  spawnedTiles: TetrisConsts.Tile[];
  heldTile: TetrisConsts.Tile;
  firstGameStart: boolean;
  displayGrid: boolean;
};

const TetrisBoard: React.FC<TetrisBoardProps> = (props: TetrisBoardProps) => {
  const {
    field, score, level, spawnedTiles, heldTile, firstGameStart, displayGrid,
  } = props;
  const renderTiles = TetrisConsts.RENDER_TILES_ARR;

  /* Prepare an HTML element for the main game board */
  const gameBoard = TetrisUtils.fieldToJsxElement(field, displayGrid);

  /* Prepare HTML elements for the tile queue */
  const spawnedTilesFieldsRender: JSX.Element[][] = [];
  spawnedTiles.forEach((tile) => {
    const spawnedTileField = firstGameStart ? renderTiles[tile]
      : renderTiles[TetrisConsts.Tile.Blank];
    const spawnedTileFieldRender = TetrisUtils.fieldToJsxElement(spawnedTileField, displayGrid);
    spawnedTilesFieldsRender.push(spawnedTileFieldRender);
  });
  const tileRenderFields = spawnedTilesFieldsRender.map((tile) => <div className="tetris-next">{tile}</div>);

  /* Prepare an HTML element for the currently held tile */
  const heldTileField = renderTiles[heldTile];
  const heldTileFieldRender = TetrisUtils.fieldToJsxElement(heldTileField, displayGrid);

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
            <div className="tetris-held">{heldTileFieldRender}</div>
          </div>
          <div className="col">
            <div className="tetris-board">{gameBoard}</div>
          </div>
          <div className="col">
            <div>{tileRenderFields}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TetrisBoard;
