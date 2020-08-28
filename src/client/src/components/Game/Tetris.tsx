import React from 'react';
import TetrisBoard from './TetrisBoard';
import './Tetris.css';
import * as TetrisConsts from './TetrisConsts';

type TetrisProps =
{
  boardWidth: number;
  boardHeight: number;
  gamePaused: boolean;
  gameRestart: boolean; /* We now use the newGame prop as a 'switch' to toggle a new game
  instead of polling its' value to determine whether or not a new game should start */
  gameState: Function; /* We use a callback as another switch to let the parent component
  know whether the game is over */
};

type TetrisState =
{
  init: boolean;
  gameOver: boolean;
  newGameSwitch: boolean;
  activeTileX: number;
  activeTileY: number;
  activeGhostTileY: number;
  activeTile: number;
  activeTileRotate: number;
  score: number;
  level: number;
  tileCount: number;
  timerId: number;
  field: [number[], number][];
};

class Tetris extends React.Component<TetrisProps, TetrisState> {
  constructor(props: TetrisProps) {
    super(props);

    const tiles = TetrisConsts.TILES_COORDS_ARR;

    /* Binding handles */
    this.keyboardInputHandle = this.keyboardInputHandle.bind(this);

    const initStates = this.initNewGame();

    /* HACK: Instead of having to call the functions, we simply just calculate
    the ghost tile's Y coordinate as it is only the higest pixel - number of
    pixels to the pivot (0.0) of the init tile */
    const { tileStart } = initStates;
    const pixelsToPivot = tiles[tileStart][TetrisConsts.Rotation.Up][
      TetrisConsts.UPPER_Y_INDEX][TetrisConsts.Y_INDEX];
    const initGhostTileY = props.boardHeight - 1 - pixelsToPivot;

    this.state = {
      init: true,
      gameOver: false,
      newGameSwitch: props.gameRestart,
      activeTileX: initStates.xStart,
      activeTileY: TetrisConsts.Y_START,
      activeGhostTileY: initGhostTileY,
      activeTile: tileStart,
      activeTileRotate: TetrisConsts.Rotation.Up,
      score: 0,
      level: 1,
      tileCount: 0,
      timerId: 0,
      field: initStates.fieldStart,
    };
  }

  componentDidMount(): void {
    const { keyboardInputHandle } = this;

    document.addEventListener(TetrisConsts.KEYBOARD_EVENT, keyboardInputHandle);

    this.setGameInterval(TetrisConsts.DEFAULT_TIME_INTERVAL_MS);
  }

  componentWillUnmount(): void {
    const { keyboardInputHandle } = this;
    const { timerId } = this.state;

    document.removeEventListener(TetrisConsts.KEYBOARD_EVENT, keyboardInputHandle);

    window.clearInterval(timerId);
  }

  /**
   * @brief: setGameInterval: Set the pace/speed of the game
   * @param[in]: interval(ms) - The 'pace' of the game to be set;
   * the lower the value is, the faster the game becomes
   */
  setGameInterval(interval: number): void {
    const { timerId, level } = this.state;

    window.clearInterval(timerId);

    const newTimerId = window.setInterval(
      () => this.handleBoardUpdate(TetrisConsts.Command.Down),
      interval - (level * 10 > 600 ? 600 : level * 10),
    );

    this.setState(() => ({
      timerId: newTimerId,
    }));
  }

  /**
   * @brief: handleNewGameClick: Callback for the event of the new game
   * button being clicked on
   */
  handleNewGameClick(): void {
    const { gameRestart, gameState, boardHeight } = this.props;

    const tiles = TetrisConsts.TILES_COORDS_ARR;

    /* Call gameState callback to reset parent's gameOver prop */
    gameState(false);

    const newStates = this.initNewGame();

    /* HACK: Instead of having to call the functions, we simply just calculate
    the ghost tile's Y coordinate as it is only the higest pixel - number of
    pixels to the pivot (0.0) of the init tile */
    const { tileStart } = newStates;
    const pixelsToPivot = tiles[tileStart][TetrisConsts.Rotation.Up][
      TetrisConsts.UPPER_Y_INDEX][TetrisConsts.Y_INDEX];
    const initGhostTileY = boardHeight - 1 - pixelsToPivot;

    this.setState(() => ({
      init: true,
      gameOver: false,
      newGameSwitch: gameRestart,
      activeTileX: newStates.xStart,
      activeTileY: TetrisConsts.Y_START,
      activeGhostTileY: initGhostTileY,
      activeTile: newStates.tileStart,
      activeTileRotate: TetrisConsts.Rotation.Up,
      score: 0,
      level: 1,
      tileCount: 0,
      field: newStates.fieldStart,
    }));

    /* Reset timer */
    this.setGameInterval(TetrisConsts.DEFAULT_TIME_INTERVAL_MS);
  }

  /**
   * @brief: handleBoardUpdate: Handler for each 'tick' of the game
   * or when a command is issued
   * @param[in]: command - The command to be executed. The command is
   * always 'Down' for each tick of the game
   */
  handleBoardUpdate(command: TetrisConsts.Command): void {
    const { gamePaused, gameRestart, gameState } = this.props;
    const {
      init, gameOver, newGameSwitch, activeTileX, activeTileY,
      activeGhostTileY, activeTile, activeTileRotate, field,
    } = this.state;

    /* Call new game handler and return if the new game/restart button was clicked */
    if (newGameSwitch !== gameRestart) {
      this.handleNewGameClick();
      return;
    }

    /* Call gameState callback and return if game is over */
    if (gameOver) {
      gameState(true);
      return;
    }

    /* Return if game is paused */
    if (gamePaused) {
      return;
    }

    let newInit = init;
    let newField = field;
    let newX = activeTileX;
    let newY = activeTileY;
    let newTile = activeTile;
    let newRotate = activeTileRotate;

    let xAdd = 0;
    let yAdd = 0;
    let rotateAdd = 0;
    let yAddValid = true;

    /* Handling init - We only render the newly
    spawned tile */
    if (init) {
      this.renderTile(activeTileX, activeGhostTileY, activeTile,
        activeTileRotate, TetrisConsts.GHOST_TILE_INDEX);
      this.renderTile(activeTileX, activeTileY, activeTile, activeTileRotate, activeTile);
      this.setState(() => ({
        init: false,
      }));

      return;
    }

    /* Remove current tile from field for next logic */
    this.renderTile(activeTileX, activeGhostTileY, activeTile, activeTileRotate, 0);
    this.renderTile(activeTileX, activeTileY, activeTile, activeTileRotate, 0);

    /* Determine which value to be modified (x - y - rotate ?) */
    switch (command) {
      case TetrisConsts.Command.Left:
        xAdd = -1;
        if (this.isMoveValid(newX, xAdd, newY, 0, newTile, newRotate, 0)) {
          newX += xAdd;
        }
        break;
      case TetrisConsts.Command.Right:
        xAdd = 1;
        if (this.isMoveValid(newX, xAdd, newY, 0, newTile, newRotate, 0)) {
          newX += xAdd;
        }
        break;
      case TetrisConsts.Command.Rotate:
        rotateAdd = 1;
        if (this.isMoveValid(newX, 0, newY, 0, newTile, newRotate, rotateAdd)) {
          newRotate = newRotate + rotateAdd === TetrisConsts.MAX_ROTATE
            ? TetrisConsts.Rotation.Up : (newRotate + rotateAdd);
        }
        break;
      case TetrisConsts.Command.Down:
        yAdd = 1;
        yAddValid = this.isMoveValid(newX, 0, newY, yAdd, newTile, newRotate, 0);
        if (yAddValid) {
          newY += yAdd;
        }
        break;
      case TetrisConsts.Command.HardDrop:
        newY = activeGhostTileY;
        yAddValid = false;
        break;
      default:
        return;
    }

    /* Render new tile after the new coords are updated */
    let newGhostY = this.findYGhostTile(newX, newY, newTile, newRotate);
    this.renderTile(newX, newGhostY, newTile, newRotate, TetrisConsts.GHOST_TILE_INDEX);
    this.renderTile(newX, newY, newTile, newRotate, newTile);

    /* Handling blocked movement */
    if (!yAddValid) {
      const newStates = this.handleBlockedMovement();
      /* Game over */
      if (newStates === undefined) {
        return;
      }

      newInit = newStates.newInit;
      newX = newStates.newX;
      newY = newStates.newY;
      newTile = newStates.newTile;
      newRotate = newStates.newRotate;
      newGhostY = this.findYGhostTile(newX, newY, newTile, newRotate);
      newField = newStates.newField;
    }

    /* Update new states */
    this.setState(() => ({
      init: newInit,
      activeTileX: newX,
      activeTileY: newY,
      activeGhostTileY: newGhostY,
      activeTile: newTile,
      activeTileRotate: newRotate,
      field: newField,
    }));
  }

  /**
   * @brief: keyboardInputHandle: Callback for the event of keyboard
   * input being received; translate the event keycode to the corresponding
   * command
   * @param[in]: event - The keyboard event received
   */
  keyboardInputHandle(event: KeyboardEvent): void {
    switch (event.key) {
      case TetrisConsts.ARROW_DOWN:
        this.handleBoardUpdate(TetrisConsts.Command.Down);
        break;
      case TetrisConsts.ARROW_LEFT:
        this.handleBoardUpdate(TetrisConsts.Command.Left);
        break;
      case TetrisConsts.ARROW_UP:
        this.handleBoardUpdate(TetrisConsts.Command.Rotate);
        break;
      case TetrisConsts.ARROW_RIGHT:
        this.handleBoardUpdate(TetrisConsts.Command.Right);
        break;
      case TetrisConsts.SPACE:
        this.handleBoardUpdate(TetrisConsts.Command.HardDrop);
        break;
      default:
    }
  }

  /**
   * @brief: isMoveValid: Check if this next move is being valid
   * or not:
   *  Does it go out of the board?
   *  Is is blocked by other tiles?
   * @param[in]: activeTileX - Current x value
   * @param[in]: addX - Amount of x to be added
   * @param[in]: activeTileY - Current y value
   * @param[in]: addY - Amount of y to be added
   * @param[in]: activeTile - Current tile type
   * @param[in]: activeTileRotate - Current rotation
   * @param[in]: addRotate - Amount of rotation to be added
   * @return: True of the move is valid, false otw
   */
  isMoveValid(activeTileX: number,
    addX: number,
    activeTileY: number,
    addY: number,
    activeTile: TetrisConsts.Tile,
    activeTileRotate: TetrisConsts.Rotation,
    addRotate: number): boolean {
    const { field } = this.state;
    const { boardWidth, boardHeight } = this.props;
    const tiles = TetrisConsts.TILES_COORDS_ARR;

    const newX = addX ? (activeTileX + addX) : activeTileX;
    const newY = addY ? (activeTileY + addY) : activeTileY;
    const newRotate = activeTileRotate + addRotate === TetrisConsts.MAX_ROTATE
      ? TetrisConsts.Rotation.Up : (activeTileRotate + addRotate);

    /* We scan through each pixel of the tile to determine if the
    move is valid */
    for (let i = 0; i < TetrisConsts.MAX_PIXEL; i += 1) {
      /* Check to see if any pixel goes out of the board */
      /* TBS-5: HACK - we ignore any pixels that has y coord < 0
      so that we can safely spawn tiles pixel by pixel */
      const yToCheck = newY + tiles[activeTile][newRotate][i][TetrisConsts.Y_INDEX];
      const xToCheck = newX + tiles[activeTile][newRotate][i][TetrisConsts.X_INDEX];
      if (yToCheck >= 0) {
        const xValid = xToCheck >= 0 && xToCheck < boardWidth;
        const yValid = yToCheck < boardHeight;

        if (xValid && yValid) {
          /* Check for any overlap */
          const pixelOverlapped = field[xToCheck][TetrisConsts.COL_INDEX][yToCheck] !== 0;
          if (pixelOverlapped) {
            return false;
          }
        } else {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * @brief: handleBlockedMovement: Handle for blocked movements
   * @return: Object containing the updated value for states; returning
   * undefined if game is over
   */
  handleBlockedMovement(): {
    newInit: boolean;
    newX: number;
    newY: number;
    newTile: TetrisConsts.Tile;
    newRotate: TetrisConsts.Rotation;
    newField: [number[], number][];
  } | undefined {
    const {
      activeTileX, activeTileY, activeTile, activeTileRotate, field,
    } = this.state;
    const { boardWidth, boardHeight } = this.props;
    const tiles = TetrisConsts.TILES_COORDS_ARR;

    const retField = field;

    /* Update the lowest pixel for each column */
    for (let i = 0; i < TetrisConsts.MAX_PIXEL; i += 1) {
      const xToRender = activeTileX + tiles[activeTile][activeTileRotate][i][TetrisConsts.X_INDEX];
      const yToRender = activeTileY + tiles[activeTile][activeTileRotate][i][TetrisConsts.Y_INDEX];
      if (yToRender >= 0) {
        const lowestY = retField[xToRender][TetrisConsts.LOWEST_ROW_INDEX];
        if (lowestY > yToRender) {
          retField[xToRender][TetrisConsts.LOWEST_ROW_INDEX] = yToRender;
        }
      }
    }

    /* Check for complete lines and clear if there are any */
    for (let row = boardHeight - 1; row >= 0; row -= 1) {
      let isLineComplete = true;

      for (let col = 0; col < boardWidth; col += 1) {
        if (retField[col][TetrisConsts.COL_INDEX][row] === 0) {
          isLineComplete = false;
          break;
        }
      }

      if (isLineComplete) {
        for (let detectedRow = row; detectedRow > 0; detectedRow -= 1) {
          for (let col = 0; col < boardWidth; col += 1) {
            retField[col][TetrisConsts.COL_INDEX][
              detectedRow] = retField[col][TetrisConsts.COL_INDEX][detectedRow - 1];
          }
        }
        row += 1;

        /* Update the lowest row value for each col */
        for (let col = 0; col < boardWidth; col += 1) {
          if (retField[col][TetrisConsts.LOWEST_ROW_INDEX] !== boardHeight - 1) {
            retField[col][TetrisConsts.LOWEST_ROW_INDEX] += 1;
          }
        }
      }
    }

    /* Prepare new tile for the next board update */
    const newTile = Math.floor(Math.random()
      * (TetrisConsts.MAX_TILE_INDEX - TetrisConsts.MIN_TILE_INDEX + 1)) + 1;
    const newX = Math.floor(boardWidth / 2);
    const newY = TetrisConsts.Y_START;
    const newRotate = TetrisConsts.Rotation.Up;

    /* Check if game is over. If not, update score + spawn a new tile
    + set new time interval and continue */
    let isGameOver = false;
    for (let i = 0; i < TetrisConsts.MAX_PIXEL; i += 1) {
      /* TBS-5: HACK - we ignore any pixels that has y coord < 0
      so that we can safely spawn tiles pixel by pixel */
      const yToCheck = newY + tiles[newTile][newRotate][i][TetrisConsts.Y_INDEX];
      const xToCheck = newX + tiles[newTile][newRotate][i][TetrisConsts.X_INDEX];
      if (yToCheck >= 0) {
        if (retField[xToCheck][TetrisConsts.COL_INDEX][yToCheck] !== 0) {
          isGameOver = true;
          break;
        }
      }
    }

    if (isGameOver) {
      this.setState(() => ({
        gameOver: true,
      }));
      return undefined;
    }

    this.setState((prev) => ({
      score: prev.score + 1 * prev.level,
      tileCount: prev.tileCount + 1,
      level: 1 + Math.floor(prev.tileCount / 10),
    }));

    this.setGameInterval(TetrisConsts.DEFAULT_TIME_INTERVAL_MS);

    return {
      newInit: true,
      newX,
      newY,
      newTile,
      newRotate,
      newField: retField,
    };
  }

  /**
   * @brief: initNewGame: Init a new game by calculating new x value
   * and randomizing the new tile
   * @return: Object containing the init value for states
   */
  initNewGame(): { xStart: number;
    tileStart: TetrisConsts.Tile;
    fieldStart: [number[], number][]; } {
    const { boardWidth, boardHeight } = this.props;

    const fieldInit: [number[], number][] = [];

    for (let x = 0; x < boardWidth; x += 1) {
      const col = [];
      for (let y = 0; y < boardHeight; y += 1) {
        col.push(0);
      }
      fieldInit.push([col, boardHeight - 1]);
    }

    const xInit = Math.floor(boardWidth / 2);
    const tileInit = Math.floor(Math.random()
      * (TetrisConsts.MAX_TILE_INDEX - TetrisConsts.MIN_TILE_INDEX + 1)) + 1;

    return {
      xStart: xInit,
      tileStart: tileInit,
      fieldStart: fieldInit,
    };
  }

  /**
   * @brief: findYGhostTile: Find the optimal Y for the ghost tile
   * @param[in]: tileX - Actual tile's x
   * @param[in]: tileY - Actual tile's y
   * @param[in]: tile - Actual tile type
   * @param[in]: tileRotate - Actual tile's rotation
   */
  findYGhostTile(tileX: number,
    tileY: number,
    tile: TetrisConsts.Tile,
    tileRotate: TetrisConsts.Rotation): number {
    const { field } = this.state;
    const tiles = TetrisConsts.TILES_COORDS_ARR;

    /* First we find the lowest Y among the number of cols this
    tile spans */
    let yHigherThanCmp = false;
    const yToCmpArr: number[] = [];
    for (let i = 0; i < TetrisConsts.MAX_PIXEL; i += 1) {
      const xToCheck = tileX + tiles[tile][tileRotate][i][TetrisConsts.X_INDEX];
      const yToCheck = tileY + tiles[tile][tileRotate][i][TetrisConsts.Y_INDEX];
      const yToCmp = field[xToCheck][TetrisConsts.LOWEST_ROW_INDEX];
      /* If the current tile is already higher than the
      lowest Y among the X range, we have to handle it differently */
      if (yToCheck > yToCmp) {
        yHigherThanCmp = true;
        break;
      }
      if (!yToCmpArr.includes(yToCmp)) {
        yToCmpArr.push(yToCmp);
      }
    }

    let ret = 0;
    /* We have to manually look for the best fit of the
    tile since the lowest Y doesn't help here */
    if (yHigherThanCmp) {
      let iter = 0;
      while (true) {
        const found = this.isMoveValid(tileX, 0, tileY, iter, tile, tileRotate, 0);
        if (!found) {
          ret = tileY + iter - 1;
          break;
        }
        iter += 1;
      }
      return ret;
    }

    const lowestY = Math.min.apply(null, yToCmpArr);

    /* We find the correct starting point for the pivot */
    const pixelsToPivot = tiles[tile][tileRotate][
      TetrisConsts.UPPER_Y_INDEX][TetrisConsts.Y_INDEX];
    ret = lowestY - 1 - pixelsToPivot;

    /* Since we might change the pivot for the tiles in the future,
      it is best to try to find the best fit for the tile starting from
      the lowest Y we just found. We first try to go upwards (Y increases) */
    let upperBoundAttempts = 0;
    while (true) {
      const found = this.isMoveValid(tileX, 0, ret, 1, tile, tileRotate, 0);
      if (!found) {
        break;
      }
      ret += 1;
      upperBoundAttempts += 1;
    }
    /* If the number of attempts to move Y upwards is not 0, it means that the
      actual point to render the ghost tile is in the upper region */
    if (upperBoundAttempts !== 0) {
      return ret;
    }

    /* Otherwise, it is in the lower region */
    while (true) {
      const found = this.isMoveValid(tileX, 0, ret, 0, tile, tileRotate, 0);
      if (found) {
        break;
      }
      ret -= 1;
    }

    return ret;
  }

  /**
   * @brief: renderTile: Render the desired tile
   * @param[in]: tileX - Desired tile's x
   * @param[in]: tileY - Desired tile's y
   * @param[in]: tile - Desired tile type
   * @param[in]: tileRotate - Desired tile's rotation
   * @param[in]: renderValue - Render value (color of tile)
   */
  renderTile(tileX: number,
    tileY: number,
    tile: TetrisConsts.Tile,
    tileRotate: TetrisConsts.Rotation,
    renderValue: number): void {
    const { field } = this.state;
    const tiles = TetrisConsts.TILES_COORDS_ARR;

    const newField = field;

    for (let i = 0; i < TetrisConsts.MAX_PIXEL; i += 1) {
      const xToRender = tileX + tiles[tile][tileRotate][i][TetrisConsts.X_INDEX];
      const yToRender = tileY + tiles[tile][tileRotate][i][TetrisConsts.Y_INDEX];
      if (yToRender >= 0) {
        newField[xToRender][TetrisConsts.COL_INDEX][yToRender] = renderValue;
      }
    }

    this.setState(() => ({
      field: newField,
    }));
  }

  render(): JSX.Element {
    const {
      boardHeight, boardWidth,
    } = this.props;

    const {
      field, score, level, activeTileRotate,
    } = this.state;

    const renderField: number[][] = [];

    for (let y = 0; y < boardHeight; y += 1) {
      const row = [];
      for (let x = 0; x < boardWidth; x += 1) {
        row.push(field[x][TetrisConsts.COL_INDEX][y]);
      }
      renderField.push(row);
    }

    return (
      <div className="game-wrap">
        <TetrisBoard
          field={renderField}
          score={score}
          level={level}
          rotate={activeTileRotate}
        />
      </div>
    );
  }
}

export default Tetris;
