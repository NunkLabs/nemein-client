import React from 'react';
import TetrisBoard from './TetrisBoard';
import './Tetris.css';
import * as TetrisConsts from './TetrisConsts';

type TetrisProps =
{
  boardWidth: number;
  boardHeight: number;
};

type TetrisState =
{
  init: boolean;
  gameOver: boolean;
  isPaused: boolean;
  activeTileX: number;
  activeTileY: number;
  activeTile: number;
  activeTileRotate: number;
  score: number;
  level: number;
  tileCount: number;
  timerId: number;
  field: number[][];
};

class Tetris extends React.Component<TetrisProps, TetrisState> {
  constructor(props: TetrisProps) {
    super(props);

    /* Binding handles */
    this.keyboardInputHandle = this.keyboardInputHandle.bind(this);

    const initStates = this.initNewGame();

    this.state = {
      init: true,
      gameOver: false,
      isPaused: false,
      activeTileX: initStates.xStart,
      activeTileY: TetrisConsts.Y_START,
      activeTile: initStates.tileStart,
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
   * @brief: handlePauseClick: Callback for the event of the pause
   * button being clicked on
   */
  handlePauseClick(): void {
    this.setState((prev) => ({
      isPaused: !prev.isPaused,
    }));
  }

  /**
   * @brief: handleNewGameClick: Callback for the event of the new game
   * button being clicked on
   */
  handleNewGameClick(): void {
    const newStates = this.initNewGame();

    this.setState(() => ({
      init: true,
      gameOver: false,
      isPaused: false,
      activeTileX: newStates.xStart,
      activeTileY: TetrisConsts.Y_START,
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
    const {
      gameOver, isPaused, init, field, activeTileX, activeTileY, activeTileRotate, activeTile,
    } = this.state;

    let newField = field;
    let newX = activeTileX;
    let newY = activeTileY;
    let newRotate = activeTileRotate;
    let newTile = activeTile;
    let xAdd = 0;
    let yAdd = 0;
    let rotateAdd = 0;

    /* Return if game is over or paused */
    if (gameOver || isPaused) {
      return;
    }

    /* Handling init */
    if (init) {
      this.renderTile(activeTileX, activeTileY, activeTile, activeTileRotate, activeTile);
      this.setState(() => ({
        init: false,
      }));

      return;
    }

    /* Determine which value to be modified (x - y - rotate ?) */
    switch (command) {
      case TetrisConsts.Command.Left:
        xAdd = -1;
        break;
      case TetrisConsts.Command.Right:
        xAdd = 1;
        break;
      case TetrisConsts.Command.Rotate:
        rotateAdd = 1;
        break;
      case TetrisConsts.Command.Down:
        yAdd = 1;
        break;
      default:
        return;
    }

    /* Remove current tile from field for next logic */
    this.renderTile(newX, newY, newTile, newRotate, 0);

    /* Determine horizontal movement */
    if (this.isMoveValid(newX, xAdd, newY, 0, newTile, newRotate, 0)) {
      newX += xAdd;
    }

    /* Determine rotation */
    if (this.isMoveValid(newX, 0, newY, 0, newTile, newRotate, rotateAdd)) {
      newRotate = newRotate + rotateAdd === TetrisConsts.MAX_ROTATE
        ? TetrisConsts.Rotation.Up : (newRotate + rotateAdd);
    }

    /* Determine vertical movement */
    const yAddValid = this.isMoveValid(newX, 0, newY, yAdd, newTile, newRotate, 0);
    if (yAddValid) {
      newY += yAdd;
    }

    /* Rerender tile */
    this.renderTile(newX, newY, newTile, newRotate, newTile);

    /* Handling blocked movement */
    if (!yAddValid) {
      const newStates = this.handleBlockedMovement();
      /* Game over */
      if (newStates === undefined) {
        return;
      }

      newX = newStates.activeTileX;
      newY = newStates.activeTileY;
      newTile = newStates.activeTile;
      newRotate = newStates.tileRotate;
      newField = newStates.field;
    }

    /* Update new states */
    this.setState(() => ({
      activeTileX: newX,
      activeTileY: newY,
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
    switch (event.keyCode) {
      case TetrisConsts.ARROW_DOWN_UNICODE:
        this.handleBoardUpdate(TetrisConsts.Command.Down);
        break;
      case TetrisConsts.ARROW_LEFT_UNICODE:
        this.handleBoardUpdate(TetrisConsts.Command.Left);
        break;
      case TetrisConsts.ARROW_UP_UNICODE:
        this.handleBoardUpdate(TetrisConsts.Command.Rotate);
        break;
      case TetrisConsts.ARROW_RIGHT_UNICODE:
        this.handleBoardUpdate(TetrisConsts.Command.Right);
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
   * @param[in]: xAdd - Amount of x to be added
   * @param[in]: activeTileY - Current y value
   * @param[in]: yAdd - Amount of y to be added
   * @param[in]: activeTile - Current tile type
   * @param[in]: activeTileRotate - Current rotation
   * @param[in]: rotateAdd - Amount of rotation to be added
   * @return: True of the move is valid, false otw
   */
  isMoveValid(activeTileX: number, xAdd: number,
    activeTileY: number, yAdd: number,
    activeTile: TetrisConsts.Tile,
    activeTileRotate: TetrisConsts.Rotation, rotateAdd: number): boolean {
    const { field } = this.state;
    const { boardWidth, boardHeight } = this.props;
    const tiles = TetrisConsts.TILES_COORDS_ARR;

    const newX = xAdd ? (activeTileX + xAdd) : activeTileX;
    const newY = yAdd ? (activeTileY + yAdd) : activeTileY;
    const newRotate = activeTileRotate + rotateAdd === TetrisConsts.MAX_ROTATE
      ? TetrisConsts.Rotation.Up : (activeTileRotate + rotateAdd);

    /* We scan through each pixel of the tile to determine if the
    move is valid */
    for (let i = 0; i < TetrisConsts.MAX_PIXEL; i += 1) {
      /* Check to see if any pixel goes out of the board */
      const xValid = newX + tiles[activeTile][newRotate][i][0] >= 0
        && newX + tiles[activeTile][newRotate][i][0] < boardWidth;
      const yValid = newY + tiles[activeTile][newRotate][i][1] >= 0
        && newY + tiles[activeTile][newRotate][i][1] < boardHeight;

      if (xValid && yValid) {
        /* Check for any overlap */
        const pixelOverlapped = field[newY + tiles[activeTile][newRotate][i][1]][
          newX + tiles[activeTile][newRotate][i][0]] !== 0;
        if (pixelOverlapped) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  /**
   * @brief: handleBlockedMovement: Handle for blocked movements
   * @return: Object containing the updated value for states; returning
   * undefined if game is over
   */
  handleBlockedMovement(): { activeTileX: number; activeTileY: number;
    activeTile: TetrisConsts.Tile; tileRotate: TetrisConsts.Rotation;
    field: number[][]; } | undefined {
    const { field } = this.state;
    const { boardWidth, boardHeight } = this.props;
    const tiles = TetrisConsts.TILES_COORDS_ARR;

    const newField = field;

    /* Check for complete lines */
    for (let row = boardHeight - 1; row >= 0; row -= 1) {
      let isLineComplete = true;

      for (let col = 0; col < boardWidth; col += 1) {
        if (newField[row][col] === 0) {
          isLineComplete = false;
          break;
        }
      }

      if (isLineComplete) {
        for (let detectedRow = row; detectedRow > 0; detectedRow -= 1) {
          for (let col = 0; col < boardWidth; col += 1) {
            newField[detectedRow][col] = newField[detectedRow - 1][col];
          }
        }
        row += 1;
      }
    }

    const newTile = Math.floor(Math.random()
      * (TetrisConsts.MAX_TILE_INDEX - TetrisConsts.MIN_TILE_INDEX + 1)) + 1;
    const newX = boardWidth / 2;
    const newY = 1;
    const newRotate = TetrisConsts.Rotation.Up;

    /* Check if game is over. If not, update score + spawn a new tile
    + set new time interval and continue */
    let isGameOver = false;
    for (let i = 0; i < TetrisConsts.MAX_PIXEL; i += 1) {
      if (newField[newY + tiles[newTile][newRotate][i][1]][
        newX + tiles[newTile][newRotate][i][0]] !== 0) {
        isGameOver = true;
        break;
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
      activeTileX: newX,
      activeTileY: newY,
      activeTile: newTile,
      tileRotate: newRotate,
      field: newField,
    };
  }

  /**
   * @brief: initNewGame: Init a new game by calculating new x value
   * and randomizing the new tile
   * @return: Object containing the init value for states
   */
  initNewGame(): { xStart: number;
    tileStart: TetrisConsts.Tile;
    fieldStart: number[][]; } {
    const { boardWidth, boardHeight } = this.props;

    const fieldInit: number[][] = [];

    for (let y = 0; y < boardHeight; y += 1) {
      const row = [];
      for (let x = 0; x < boardWidth; x += 1) {
        row.push(0);
      }
      fieldInit.push(row);
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
   * @brief: renderTile: Render the desired tile
   * @param[in]: tileX - Desired tile's x
   * @param[in]: tileY - Desired tile's x
   * @param[in]: tile - Desired tile type
   * @param[in]: tileRotate - Desired tile's rotation
   * @param[in]: renderValue - Render value (color of tile)
   */
  renderTile(tileX: number, tileY: number,
    tile: TetrisConsts.Tile,
    tileRotate: TetrisConsts.Rotation,
    renderValue: number): void {
    const { field } = this.state;
    const tiles = TetrisConsts.TILES_COORDS_ARR;

    const newField = field;

    for (let i = 0; i < TetrisConsts.MAX_PIXEL; i += 1) {
      newField[tileY + tiles[tile][tileRotate][i][1]][
        tileX + tiles[tile][tileRotate][i][0]] = renderValue;
    }

    this.setState(() => ({
      field: newField,
    }));
  }

  render(): JSX.Element {
    const {
      field, gameOver, score, level, activeTileRotate, isPaused,
    } = this.state;
    return (
      <div className="game-wrap">
        <div className="board-wrap">
          <TetrisBoard
            field={field}
            gameOver={gameOver}
            score={score}
            level={level}
            rotate={activeTileRotate}
          />
        </div>
        <div className="controls-wrap">
          <button
            type="button"
            className="btn-custom btn-custom-light btn-block"
            onClick={(): void => this.handleNewGameClick()}
          >
            New Game
          </button>
          <button
            type="button"
            className="btn-custom btn-custom-light btn-block"
            onClick={(): void => this.handlePauseClick()}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>
    );
  }
}

export default Tetris;
