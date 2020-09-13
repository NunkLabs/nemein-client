import React from 'react';
import axios from 'axios';
import moment from 'moment';

import TetrisBoard from './TetrisBoard';
import './Tetris.css';
import * as TetrisConsts from './TetrisConsts';
import * as TetrisUtils from './TetrisUtils';

type TetrisProps = {
  boardWidth: number;
  boardHeight: number;
  gamePaused: boolean;
  gameRestart: boolean; /* We now use the newGame prop as a 'switch' to toggle a new game
  instead of polling its' value to determine whether or not a new game should start */
  gameState: (arg0: boolean) => void; /* We use a callback as another switch to let the
  parent component know whether the game is over */
  firstGameStart: boolean;
};

type TetrisCol = {
  colArr: number[];
  lowestY: number;
};

type TetrisState = {
  init: boolean;
  gameOver: boolean;
  newGameSwitch: boolean;
  onHold: boolean;
  activeTileX: number;
  activeTileY: number;
  activeGhostTileY: number;
  heldTile: TetrisConsts.Tile;
  activeTile: TetrisConsts.Tile;
  activeTileRotate: TetrisConsts.Rotation;
  score: number;
  level: number;
  progressSaved: boolean;
  tileCount: number;
  timerId: number;
  field: TetrisCol[];
  spawnedTiles: TetrisConsts.Tile[];
};

class Tetris extends React.Component<TetrisProps, TetrisState> {
  constructor(props: TetrisProps) {
    super(props);

    /* Binding handles */
    this.keyboardInputHandle = this.keyboardInputHandle.bind(this);

    const initStates = this.initNewGame();

    this.state = {
      init: initStates.initGame,
      gameOver: initStates.initGameOver,
      newGameSwitch: props.gameRestart,
      onHold: initStates.initOnHold,
      activeTileX: initStates.initActiveTileX,
      activeTileY: initStates.initActiveTileY,
      activeGhostTileY: initStates.initActiveGhostTileY,
      heldTile: initStates.initHeldTile,
      activeTile: initStates.initActiveTile,
      activeTileRotate: initStates.initActiveTileRotate,
      score: initStates.initScore,
      level: initStates.initLevel,
      progressSaved: initStates.initProgressSaved,
      tileCount: initStates.initTileCount,
      timerId: 0,
      field: initStates.initField,
      spawnedTiles: initStates.initSpawnedTiles,
    };
  }

  componentDidMount(): void {
    const { keyboardInputHandle } = this;

    document.addEventListener(TetrisConsts.KEYBOARD_EVENT, keyboardInputHandle);

    this.setGameInterval(TetrisConsts.DEFAULT_TIME_INTERVAL_MS);
  }

  componentWillUnmount(): void {
    const { keyboardInputHandle } = this;
    const {
      timerId,
    } = this.state;

    document.removeEventListener(TetrisConsts.KEYBOARD_EVENT, keyboardInputHandle);

    window.clearInterval(timerId);
  }

  /**
   * @brief: setGameInterval: Set the pace/speed of the game
   * @param[in]: interval(ms) - The 'pace' of the game to be set;
   * the lower the value is, the faster the game becomes
   */
  setGameInterval(interval: number): void {
    const {
      timerId,
    } = this.state;

    window.clearInterval(timerId);

    const newTimerId = window.setInterval(
      () => this.handleBoardUpdate(TetrisConsts.Command.Down),
      interval,
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
    const {
      gameRestart, gameState,
    } = this.props;

    /* Call gameState callback to reset parent's gameOver prop */
    gameState(false);

    const initStates = this.initNewGame();

    this.setState(() => ({
      init: initStates.initGame,
      gameOver: initStates.initGameOver,
      newGameSwitch: gameRestart,
      onHold: initStates.initOnHold,
      activeTileX: initStates.initActiveTileX,
      activeTileY: initStates.initActiveTileY,
      activeGhostTileY: initStates.initActiveGhostTileY,
      activeTile: initStates.initActiveTile,
      heldTile: initStates.initHeldTile,
      activeTileRotate: initStates.initActiveTileRotate,
      score: initStates.initScore,
      level: initStates.initLevel,
      progressSaved: initStates.initProgressSaved,
      tileCount: initStates.initTileCount,
      field: initStates.initField,
      spawnedTiles: initStates.initSpawnedTiles,
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
    const {
      gamePaused, gameRestart, gameState, boardWidth,
    } = this.props;

    const {
      init, gameOver, newGameSwitch, onHold, activeTileX, activeTileY, activeGhostTileY,
      heldTile, activeTile, activeTileRotate, score, field, progressSaved, spawnedTiles,
    } = this.state;

    /* Call new game handler and return if the new game/restart button was clicked */
    if (newGameSwitch !== gameRestart) {
      this.handleNewGameClick();

      return;
    }

    /* Call gameState callback, save user's score and return if game is over */
    if (gameOver) {
      gameState(true);

      if (!progressSaved) {
        axios.put('/api/user/update/scores', JSON.stringify({
          newScore: {
            score,
            timestamp: moment().format('MMMM Do, YYYY'),
          },
        }), {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .catch(() => {});

        this.setState({
          progressSaved: true,
        });
      }

      return;
    }

    /* Return if game is paused */
    if (gamePaused) {
      return;
    }

    let newInit = init;
    let newOnHold = onHold;
    let newX = activeTileX;
    let newY = activeTileY;
    let newGhostY = activeGhostTileY;
    let newHeldTile = heldTile;
    let newTile = activeTile;
    let newRotate = activeTileRotate;
    let newField = field;
    let newTiles = spawnedTiles;

    let xAdd = 0;
    let yAdd = 0;
    let rotateAdd = 0;
    let yAddValid = true;

    /* Handling init - We only render the newly spawned tile */
    if (init) {
      this.renderTile(newX, newGhostY, newTile, newRotate, TetrisConsts.GHOST_TILE_INDEX);
      this.renderTile(newX, newY, newTile, newRotate, newTile);
      this.setState(() => ({
        init: false,
      }));

      return;
    }

    /* Remove current tile from field for next logic */
    this.renderTile(newX, newGhostY, newTile, newRotate, 0);
    this.renderTile(newX, newY, newTile, newRotate, 0);

    /* Determine which value to be modified (x - y - rotate ?) */
    switch (command) {
      case TetrisConsts.Command.Left: {
        xAdd = -1;
        if (this.isMoveValid(newX, xAdd, newY, 0, newTile, newRotate, 0)) {
          newX += xAdd;
        }
        break;
      }
      case TetrisConsts.Command.Right: {
        xAdd = 1;
        if (this.isMoveValid(newX, xAdd, newY, 0, newTile, newRotate, 0)) {
          newX += xAdd;
        }
        break;
      }
      case TetrisConsts.Command.Rotate: {
        rotateAdd = 1;
        if (this.isMoveValid(newX, 0, newY, 0, newTile, newRotate, rotateAdd)) {
          newRotate = newRotate + rotateAdd === TetrisConsts.MAX_ROTATE
            ? TetrisConsts.Rotation.Up : (newRotate + rotateAdd);
        }
        break;
      }
      case TetrisConsts.Command.Down: {
        yAdd = 1;
        yAddValid = this.isMoveValid(newX, 0, newY, yAdd, newTile, newRotate, 0);
        if (yAddValid) {
          newY += yAdd;
        }
        break;
      }
      case TetrisConsts.Command.HardDrop: {
        newY = newGhostY;
        yAddValid = false;
        break;
      }
      case TetrisConsts.Command.HoldTile: {
        if (!newOnHold) {
          if (newHeldTile !== TetrisConsts.Tile.Blank) {
            const prevTile = newTile;
            newTile = newHeldTile;
            newHeldTile = prevTile;
          } else {
            const getTileRet = TetrisUtils.getNewTile(newTiles);
            newHeldTile = newTile;
            newTile = getTileRet.newTile;
            newTiles = getTileRet.newTiles;
          }
          newX = Math.floor(boardWidth / 2);
          newY = TetrisConsts.Y_START;
          newRotate = TetrisConsts.Rotation.Up;
          newOnHold = true;
        }
        break;
      }
      default: {
        return;
      }
    }

    /* Render new tile after the new coords are updated */
    newGhostY = this.findGhostTileY(newX, newY, newTile, newRotate);
    this.renderTile(newX, newGhostY, newTile, newRotate, TetrisConsts.GHOST_TILE_INDEX);
    this.renderTile(newX, newY, newTile, newRotate, newTile);

    /* Handling blocked movement */
    if (!yAddValid) {
      const newStates = this.handleBlockedMovement(newX, newY, newTile, newRotate);
      /* Game over */
      if (newStates === undefined) {
        return;
      }

      newInit = newStates.newInit;
      newX = newStates.newX;
      newY = newStates.newY;
      newTile = newStates.newTile;
      newRotate = newStates.newRotate;
      newGhostY = this.findGhostTileY(newX, newY, newTile, newRotate);
      newField = newStates.newField;
      newTiles = newStates.newTiles;
      newOnHold = (newOnHold === true) ? false : newOnHold;
    }

    /* Update new states */
    this.setState(() => ({
      init: newInit,
      onHold: newOnHold,
      activeTileX: newX,
      activeTileY: newY,
      activeGhostTileY: newGhostY,
      heldTile: newHeldTile,
      activeTile: newTile,
      activeTileRotate: newRotate,
      field: newField,
      spawnedTiles: newTiles,
    }));

    /* TBS-36: Getting new tile to spawn immediately

    This recursive call should not affect performance as we'd fall in the init
    handling section of this function - which should return anyway. Unless I'm wrong..? */
    if (!yAddValid) {
      this.handleBoardUpdate(TetrisConsts.Command.Down);
    }
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
      case TetrisConsts.C_KEY:
        this.handleBoardUpdate(TetrisConsts.Command.HoldTile);
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
   * @return: True if the move is valid, false otw
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

    /* We scan through each pixel of the tile to determine if the move is valid */
    for (let pixelIter = 0; pixelIter < TetrisConsts.MAX_PIXEL; pixelIter += 1) {
      /* Check to see if any pixel goes out of the board */
      /* HACK - We check pixels' y coords first to safely render tiles
      pixel by pixel initially */
      const yToCheck = newY + tiles[activeTile][newRotate][pixelIter][TetrisConsts.Y_INDEX];
      const xToCheck = newX + tiles[activeTile][newRotate][pixelIter][TetrisConsts.X_INDEX];
      const xValid = xToCheck >= 0 && xToCheck < boardWidth;
      if (yToCheck >= 0) {
        const yValid = yToCheck < boardHeight;
        if (xValid && yValid) {
          /* Check for any overlap */
          const pixelOverlapped = field[xToCheck].colArr[yToCheck] !== 0;
          if (pixelOverlapped) {
            return false;
          }
        } else {
          return false;
        }
      } else if (!xValid) {
        return false;
      }
    }
    return true;
  }

  /**
   * @brief: handleBlockedMovement: Handle for blocked movements
   * @param[in]: activeTileX: Rendered X coord
   * @param[in]: activeTileY: Rendered Y coord
   * @return: Object containing the updated value for states; returning
   * undefined if game is over
   */
  handleBlockedMovement(activeTileX: number,
    activeTileY: number,
    activeTile: TetrisConsts.Tile,
    activeTileRotate: TetrisConsts.Rotation): {
      newInit: boolean;
      newX: number;
      newY: number;
      newTile: TetrisConsts.Tile;
      newRotate: TetrisConsts.Rotation;
      newField: TetrisCol[];
      newTiles: TetrisConsts.Tile[];
    } | undefined {
    const { field, spawnedTiles, level } = this.state;
    const { boardWidth, boardHeight } = this.props;

    const tiles = TetrisConsts.TILES_COORDS_ARR;

    const retField = field;

    /* Update the lowest pixel for each column */
    for (let pixelIter = 0; pixelIter < TetrisConsts.MAX_PIXEL; pixelIter += 1) {
      const xToRender = activeTileX + tiles[activeTile][activeTileRotate][
        pixelIter][TetrisConsts.X_INDEX];
      const yToRender = activeTileY + tiles[activeTile][activeTileRotate][
        pixelIter][TetrisConsts.Y_INDEX];
      if (yToRender >= 0) {
        const { lowestY } = retField[xToRender];
        if (lowestY > yToRender) {
          retField[xToRender].lowestY = yToRender;
        }
      }
    }

    /* Check for complete lines and clear if there are any */
    for (let row = boardHeight - 1; row >= 0; row -= 1) {
      let isLineComplete = true;

      for (let col = 0; col < boardWidth; col += 1) {
        if (retField[col].colArr[row] === 0) {
          isLineComplete = false;
          break;
        }
      }

      if (isLineComplete) {
        for (let detectedRow = row; detectedRow > 0; detectedRow -= 1) {
          for (let col = 0; col < boardWidth; col += 1) {
            retField[col].colArr[detectedRow] = retField[col].colArr[detectedRow - 1];
          }
        }
        row += 1;

        /* Update the lowest row value for each col */
        for (let col = 0; col < boardWidth; col += 1) {
          if (retField[col].lowestY !== boardHeight - 1) {
            retField[col].lowestY += 1;
          }
        }
      }
    }

    /* Prepare new tile for the next board update */
    const getTileRet = TetrisUtils.getNewTile(spawnedTiles);
    const retTile = getTileRet.newTile;
    const retTiles = getTileRet.newTiles;

    const retX = Math.floor(boardWidth / 2);
    const retY = TetrisConsts.Y_START;
    const retRotate = TetrisConsts.Rotation.Up;

    /* Check if game is over. If not, update score + spawn a new tile
    + set new time interval and continue */
    let isGameOver = false;
    for (let pixelIter = 0; pixelIter < TetrisConsts.MAX_PIXEL; pixelIter += 1) {
      const yToCheck = retY + tiles[retTile][retRotate][pixelIter][TetrisConsts.Y_INDEX];
      const xToCheck = retX + tiles[retTile][retRotate][pixelIter][TetrisConsts.X_INDEX];
      if (yToCheck >= 0) {
        if (retField[xToCheck].colArr[yToCheck] !== 0) {
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

    const newGameInterval = level * TetrisConsts.EARLY_LEVEL_MULTIPLIER > TetrisConsts.INTERVAL_CAP
      ? (TetrisConsts.INTERVAL_CAP + level * TetrisConsts.LATE_LEVEL_MULTIPLIER)
      : (level * TetrisConsts.EARLY_LEVEL_MULTIPLIER);
    this.setGameInterval(TetrisConsts.DEFAULT_TIME_INTERVAL_MS - newGameInterval);

    return {
      newInit: true,
      newX: retX,
      newY: retY,
      newTile: retTile,
      newRotate: retRotate,
      newField: retField,
      newTiles: retTiles,
    };
  }

  /**
   * @brief: initNewGame: Init a new game by calculating new x value
   * and randomizing the new tile
   * @return: Object containing the init value for states
   */
  initNewGame(): { initGame: boolean;
    initGameOver: boolean;
    initOnHold: boolean;
    initActiveTileX: number;
    initActiveTileY: number;
    initActiveGhostTileY: number;
    initHeldTile: TetrisConsts.Tile;
    initActiveTile: TetrisConsts.Tile;
    initActiveTileRotate: TetrisConsts.Rotation;
    initScore: number;
    initLevel: number;
    initProgressSaved: boolean;
    initTileCount: number;
    initField: TetrisCol[];
    initSpawnedTiles: TetrisConsts.Tile[];
  } {
    const { boardWidth, boardHeight } = this.props;

    const retTiles = [];
    /* Add an additional tile to pop in init */
    for (let pixelIter = 0; pixelIter < TetrisConsts.MAX_SPAWNED_TILES + 1; pixelIter += 1) {
      const spawnedTile = Math.floor(Math.random()
        * (TetrisConsts.MAX_TILE_INDEX - TetrisConsts.MIN_TILE_INDEX + 1)) + 1;
      retTiles.push(spawnedTile);
    }
    const getTileRet = TetrisUtils.getNewTile(retTiles);
    const retTile = getTileRet.newTile;
    const retRotation = TetrisConsts.Rotation.Up;
    const retGhostTileY = this.prepareGhostTileY(retTile, retRotation);

    const retField: TetrisCol[] = [];
    for (let x = 0; x < boardWidth; x += 1) {
      const col: number[] = [];
      for (let y = 0; y < boardHeight; y += 1) {
        col.push(0);
      }
      const initCol: TetrisCol = {
        colArr: col,
        lowestY: boardHeight - 1,
      };
      retField.push(initCol);
    }

    return {
      initGame: true,
      initGameOver: false,
      initOnHold: false,
      initActiveTileX: Math.floor(boardWidth / 2),
      initActiveTileY: TetrisConsts.Y_START,
      initActiveGhostTileY: retGhostTileY,
      initHeldTile: TetrisConsts.Tile.Blank,
      initActiveTile: retTile,
      initActiveTileRotate: retRotation,
      initScore: 0,
      initLevel: 1,
      initProgressSaved: false,
      initTileCount: 0,
      initField: retField,
      initSpawnedTiles: retTiles,
    };
  }

  /**
   * @brief: findGhostTileY: Find the optimal Y for the ghost tile
   * @param[in]: tileX - Actual tile's x
   * @param[in]: tileY - Actual tile's y
   * @param[in]: tile - Actual tile type
   * @param[in]: tileRotate - Actual tile's rotation
   */
  findGhostTileY(tileX: number,
    tileY: number,
    tile: TetrisConsts.Tile,
    tileRotate: TetrisConsts.Rotation): number {
    const { boardWidth, boardHeight } = this.props;
    const { field } = this.state;

    const tiles = TetrisConsts.TILES_COORDS_ARR;

    /* First we find the lowest Y among the number of cols this
    tile spans */
    let yHigherThanCmp = false;
    const yToCmpArr: number[] = [];
    for (let pixelIter = 0; pixelIter < TetrisConsts.MAX_PIXEL; pixelIter += 1) {
      const xToCheck = tileX + tiles[tile][tileRotate][pixelIter][TetrisConsts.X_INDEX];
      const yToCheck = tileY + tiles[tile][tileRotate][pixelIter][TetrisConsts.Y_INDEX];
      if (yToCheck >= 0) {
        const xValid = xToCheck >= 0 && xToCheck < boardWidth;
        const yValid = yToCheck < boardHeight;
        if (xValid && yValid) {
          const yToCmp = field[xToCheck].lowestY;
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
      }
    }

    let ret = 0;
    /* We have to manually look for the best fit of the
    tile since the lowest Y doesn't help here */
    if (yHigherThanCmp) {
      let iter = 0;
      while (this.isMoveValid(tileX, 0, tileY, iter, tile, tileRotate, 0)) {
        iter += 1;
      }
      ret = tileY + iter - 1;
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
    while (this.isMoveValid(tileX, 0, ret, 1, tile, tileRotate, 0)) {
      ret += 1;
      upperBoundAttempts += 1;
    }
    /* If the number of attempts to move Y upwards is not 0, it means that the
      actual point to render the ghost tile is in the upper region */
    if (upperBoundAttempts !== 0) {
      return ret;
    }

    /* Otherwise, it is in the lower region */
    while (!this.isMoveValid(tileX, 0, ret, 0, tile, tileRotate, 0)) {
      ret -= 1;
    }

    return ret;
  }

  /**
   * @brief: prepareGhostTileY: Get the Y coord of the ghost tile
   * of a newly spawned tile
   * @note: This is basically a quick hack - Instead of having to
   * call other functions (findGhostTileY), we can simply just
   * calculate the ghost tile's Y coordinate as it is only
   * [the higest pixel - number of pixels to the pivot
   * (0, 0) of the init tile]
   * @param[in]: tile - Actual tile type
   * @param[in]: tileRotate - Actual tile's rotation
   */
  prepareGhostTileY(tile: TetrisConsts.Tile,
    tileRotate: TetrisConsts.Rotation): number {
    const { boardHeight } = this.props;

    const tiles = TetrisConsts.TILES_COORDS_ARR;

    const pixelsToPivot = tiles[tile][tileRotate][
      TetrisConsts.UPPER_Y_INDEX][TetrisConsts.Y_INDEX];
    return boardHeight - 1 - pixelsToPivot;
  }

  /**
   * @brief: renderTile: Render the desired tile
   * @note: Field state will be updated after the function returns
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

    for (let pixelIter = 0; pixelIter < TetrisConsts.MAX_PIXEL; pixelIter += 1) {
      const xToRender = tileX + tiles[tile][tileRotate][pixelIter][TetrisConsts.X_INDEX];
      const yToRender = tileY + tiles[tile][tileRotate][pixelIter][TetrisConsts.Y_INDEX];
      if (yToRender >= 0) {
        newField[xToRender].colArr[yToRender] = renderValue;
      }
    }

    this.setState(() => ({
      field: newField,
    }));
  }

  render(): JSX.Element {
    const {
      boardHeight, boardWidth, firstGameStart,
    } = this.props;
    const {
      score, level, heldTile, field, spawnedTiles,
    } = this.state;

    const renderField: number[][] = [];

    for (let y = 0; y < boardHeight; y += 1) {
      const row = [];
      for (let x = 0; x < boardWidth; x += 1) {
        row.push(field[x].colArr[y]);
      }
      renderField.push(row);
    }

    return (
      <div className="game-wrap">
        <TetrisBoard
          field={renderField}
          score={score}
          level={level}
          spawnedTiles={spawnedTiles}
          heldTile={heldTile}
          firstGameStart={firstGameStart}
        />
      </div>
    );
  }
}

export default Tetris;
