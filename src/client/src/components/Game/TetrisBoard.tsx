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
};

const TetrisBoard: React.FC<TetrisBoardProps> = (props: TetrisBoardProps) => {
  const {
    field, score, level, spawnedTiles, heldTile,
  } = props;
  const renderTiles = TetrisConsts.RENDER_TILES_ARR;

  /* Prepare an HTML element for the main game board */
  const gameBoard = TetrisUtils.fieldToJsxElement(field);

  /* Prepare HTML elements for the tile queue */
  const spawnedTilesFieldsRender: JSX.Element[][] = [];
  spawnedTiles.forEach((tile) => {
    const spawnedTileField = renderTiles[tile];
    const spawnedTileFieldRender = TetrisUtils.fieldToJsxElement(spawnedTileField);
    spawnedTilesFieldsRender.push(spawnedTileFieldRender);
  });
  const tileRenderFields = spawnedTilesFieldsRender.map((tile) => <div className="tetris-next">{tile}</div>);

  /* Prepare an HTML element for the currently held tile */
  const heldTileField = renderTiles[heldTile];
  const heldTileFieldRender = TetrisUtils.fieldToJsxElement(heldTileField);

  return (
    <div className="tetris-main">
      <div className="tetris-info">
        <div className="row">
          <div className="col">
            <p className="tetris-text">
              Level
            </p>
            <p>
              {level}
            </p>
          </div>
          <div className="col">
            <p className="tetris-text">
              Score
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
