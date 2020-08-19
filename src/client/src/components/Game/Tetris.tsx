import React from 'react';
import TetrisBoard from './TetrisBoard';
import './Tetris.css';

const MAX_PIXEL = 4;
const MAX_ROTATE = 4;
const TILES_COORDS_ARR = [
  /**
   * Each element in this array represents all 4 rotations of 1 tile
   * Each rotation consists of 4 pixel coordinates [x, y] of the tile
   *
   * NOTE: there are places where the coordinate is -1, this is to specify
   * which pixel is the center or rotation
   */
  [
    /* The default square */
    [[0, 0], [0, 0], [0, 0], [0, 0]],
    [[0, 0], [0, 0], [0, 0], [0, 0]],
    [[0, 0], [0, 0], [0, 0], [0, 0]],
    [[0, 0], [0, 0], [0, 0], [0, 0]],
  ],
  [
    /* 2x2 square tile */
    [[0, -1], [0, 0], [1, 0], [1, -1]],
    [[0, -1], [0, 0], [1, 0], [1, -1]],
    [[0, -1], [0, 0], [1, 0], [1, -1]],
    [[0, -1], [0, 0], [1, 0], [1, -1]],
  ],
  [
    /* I tile */
    [[0, -1], [0, 0], [0, 1], [0, 2]],
    [[-1, 0], [0, 0], [1, 0], [2, 0]],
    [[0, -1], [0, 0], [0, 1], [0, 2]],
    [[-1, 0], [0, 0], [1, 0], [2, 0]],
  ],
  [
    /* T tile */
    [[0, 0], [-1, 0], [1, 0], [0, -1]],
    [[0, 0], [1, 0], [0, 1], [0, -1]],
    [[0, 0], [-1, 0], [1, 0], [0, 1]],
    [[0, 0], [-1, 0], [0, 1], [0, -1]],
  ],
  [
    /* J tile */
    [[0, 0], [-1, 0], [1, 0], [-1, -1]],
    [[0, 0], [0, 1], [0, -1], [1, -1]],
    [[0, 0], [1, 0], [-1, 0], [1, 1]],
    [[0, 0], [0, 1], [0, -1], [-1, 1]],
  ],
  [
    /* L tile */
    [[0, 0], [1, 0], [-1, 0], [1, -1]],
    [[0, 0], [0, 1], [0, -1], [1, 1]],
    [[0, 0], [1, 0], [-1, 0], [-1, 1]],
    [[0, 0], [0, 1], [0, -1], [-1, -1]],
  ],
  [
    /* Z tile */
    [[0, 0], [1, 0], [0, -1], [-1, -1]],
    [[0, 0], [1, 0], [0, 1], [1, -1]],
    [[0, 0], [1, 0], [0, -1], [-1, -1]],
    [[0, 0], [1, 0], [0, 1], [1, -1]],
  ],
  [
    /* S tile */
    [[0, 0], [-1, 0], [0, -1], [1, -1]],
    [[0, 0], [0, -1], [1, 0], [1, 1]],
    [[0, 0], [-1, 0], [0, -1], [1, -1]],
    [[0, 0], [0, -1], [1, 0], [1, 1]],
  ],
];
const ARROW_DOWN_UNICODE = 40;
const ARROW_LEFT_UNICODE = 37;
const ARROW_UP_UNICODE = 38;
const ARROW_RIGHT_UNICODE = 39;
const KEYBOARD_EVENT = 'keydown';

const DEFAULT_TIME_INTERVAL_MS = 1000;

enum Command {
  Down,
  Left,
  Right,
  Rotate,
}

enum Tile {
  Blank,
  Square,
  I,
  T,
  J,
  L,
  Z,
  S,
}

enum Rotation {
  Up,
  Right,
  Down,
  Left,
}

type TetrisProps =
{
  boardWidth: number;
  boardHeight: number;
};

type TetrisState =
{
  init: boolean;
  activeTileX: number;
  activeTileY: number;
  activeTile: number;
  tileRotate: number;
  score: number;
  level: number;
  tileCount: number;
  gameOver: boolean;
  isPaused: boolean;
  field: number[][];
  timerId: number;
};

class Tetris extends React.Component<TetrisProps, TetrisState> {
  /**
   * @brief: constructor
   * @param[in]: props
   */
  constructor(props: TetrisProps) {
    super(props);

    /* Binding handles */
    this.keyboardInputHandle = this.keyboardInputHandle.bind(this);

    /* Populating data for states */
    const newField = [];
    for (let y = 0; y < props.boardHeight; y += 1) {
      const row = [];
      for (let x = 0; x < props.boardWidth; x += 1) {
        row.push(0);
      }
      newField.push(row);
    }

    const xStart = Math.floor(props.boardWidth / 2);
    const tileStart = Math.floor(Math.random() * 7 + 1);

    this.state = {
      init: true,
      activeTileX: xStart,
      activeTileY: 1,
      activeTile: tileStart,
      tileRotate: 0,
      score: 0,
      level: 1,
      tileCount: 0,
      gameOver: false,
      isPaused: false,
      field: newField,
      timerId: DEFAULT_TIME_INTERVAL_MS,
    };
  }

  /**
   * @brief: componentDidMount
   */
  componentDidMount(): void {
    const { keyboardInputHandle } = this;
    document.addEventListener(KEYBOARD_EVENT, keyboardInputHandle);

    this.setNewInterval(DEFAULT_TIME_INTERVAL_MS);
  }

  /**
   * @brief: componentWillUnmount
   */
  componentWillUnmount(): void {
    const { keyboardInputHandle } = this;
    const { timerId } = this.state;

    document.removeEventListener(KEYBOARD_EVENT, keyboardInputHandle);

    window.clearInterval(timerId);
  }

  /**
   * @brief: setNewInterval:
   * @param[in]: interval
   */
  setNewInterval(interval: number): void {
    const { timerId, level } = this.state;

    clearInterval(timerId);

    const newTimerId = window.setInterval(
      () => this.handleBoardUpdate(Command.Down),
      interval - (level * 10 > 600 ? 600 : level * 10),
    );

    this.setState(() => ({
      timerId: newTimerId,
    }));
  }

  /**
   * @brief: handlePauseClick:
   */
  handlePauseClick(): void {
    this.setState((prev) => ({
      isPaused: !prev.isPaused,
    }));
  }

  /**
   * @brief: handleNewGameClick:
   */
  handleNewGameClick(): void {
    const newField: number[][] = [];
    const { boardHeight, boardWidth } = this.props;

    for (let y = 0; y < boardHeight; y += 1) {
      const row = [];
      for (let x = 0; x < boardWidth; x += 1) {
        row.push(0);
      }
      newField.push(row);
    }

    const xStart = Math.floor(boardWidth / 2);

    this.setState(() => ({
      init: true,
      activeTileX: xStart,
      activeTileY: 1,
      activeTile: 1,
      tileRotate: 0,
      score: 0,
      level: 1,
      tileCount: 0,
      gameOver: false,
      isPaused: false,
      field: newField,
    }));
  }

  /**
   * @brief: handleBoardUpdate
   * @param[in]: command
   */
  handleBoardUpdate(command: Command): void {
    const {
      gameOver, isPaused, init, field, activeTileX, activeTileY, tileRotate, activeTile,
    } = this.state;

    /* Return if game is over or paused */
    if (gameOver || isPaused) {
      return;
    }

    /* Handling init */
    if (init) {
      this.renderTile(activeTileX, activeTileY, activeTile, tileRotate, activeTile);
      this.setState(() => ({
        init: false,
      }));

      return;
    }

    /* Determine which value to be modified (x - y - rotate ?) */
    let newField = field;
    let newX = activeTileX;
    let newY = activeTileY;
    let newRotate = tileRotate;
    let newTile = activeTile;
    let xAdd = 0;
    let yAdd = 0;
    let rotateAdd = 0;

    switch (command) {
      case Command.Left:
        xAdd = -1;
        break;
      case Command.Right:
        xAdd = 1;
        break;
      case Command.Rotate:
        rotateAdd = 1;
        break;
      case Command.Down:
        yAdd = 1;
        break;
      default:
        return;
    }

    /* Remove current tile from field for next logic */
    this.renderTile(newX, newY, newTile, newRotate, 0);

    /* Determine horizontal movement */
    if (this.checkValidMovement(newX, xAdd, newY, 0, newTile, newRotate, 0)) {
      newX += xAdd;
    }

    /* Determine rotation */
    if (this.checkValidMovement(newX, 0, newY, 0, newTile, newRotate, rotateAdd)) {
      newRotate = newRotate + rotateAdd === MAX_ROTATE ? Rotation.Up : (newRotate + rotateAdd);
    }

    /* Determine vertical movement */
    const yAddValid = this.checkValidMovement(newX, 0, newY, yAdd, newTile, newRotate, 0);
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

      newField = newStates.field;
      newX = newStates.activeTileX;
      newY = newStates.activeTileY;
      newRotate = newStates.tileRotate;
      newTile = newStates.activeTile;
    }

    /* Update new states */
    this.setState(() => ({
      field: newField,
      activeTileX: newX,
      activeTileY: newY,
      tileRotate: newRotate,
      activeTile: newTile,
    }));
  }

  /**
   * @brief: keyboardInputHandle
   * @param[in]: event
   */
  keyboardInputHandle(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case ARROW_DOWN_UNICODE:
        this.handleBoardUpdate(Command.Down);
        break;
      case ARROW_LEFT_UNICODE:
        this.handleBoardUpdate(Command.Left);
        break;
      case ARROW_UP_UNICODE:
        this.handleBoardUpdate(Command.Rotate);
        break;
      case ARROW_RIGHT_UNICODE:
        this.handleBoardUpdate(Command.Right);
        break;
      default:
    }
  }

  /**
   * @brief: checkValidMovement:
   * @param[in]: x
   * @param[in]: xAdd
   * @param[in]: y
   * @param[in]: yAdd
   * @param[in]: tile
   * @param[in]: rotate
   * @param[in]: rotateAdd
   * @return
   */
  checkValidMovement(x: number, xAdd: number, y: number, yAdd: number,
    tile: Tile, rotate: Rotation, rotateAdd: number): boolean {
    const { field } = this.state;
    const { boardWidth, boardHeight } = this.props;
    const tiles = TILES_COORDS_ARR;

    const newX = xAdd ? (x + xAdd) : x;
    const newY = yAdd ? (y + yAdd) : y;
    const newRotate = rotate + rotateAdd === MAX_ROTATE ? Rotation.Up : (rotate + rotateAdd);

    for (let i = 0; i < MAX_PIXEL; i += 1) {
      const xValid = newX + tiles[tile][newRotate][i][0] >= 0
        && newX + tiles[tile][newRotate][i][0] < boardWidth;
      const yValid = newY + tiles[tile][newRotate][i][1] >= 0
        && newY + tiles[tile][newRotate][i][1] < boardHeight;
      if (xValid && yValid) {
        const pixelOverlapped = field[newY + tiles[tile][newRotate][i][1]][
          newX + tiles[tile][newRotate][i][0]] !== 0;
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
   * @brief: checkValidMovement:
   * @param[in]: x
   * @param[in]: y
   * @param[in]: tile
   * @param[in]: rotate
   * @return
   */
  handleBlockedMovement(): { field: number[][]; activeTileX: number;
    activeTileY: number; tileRotate: Rotation; activeTile: Tile; } | undefined {
    const { field } = this.state;
    const { boardWidth, boardHeight } = this.props;
    const tiles = TILES_COORDS_ARR;
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

    const newTile = Math.floor(Math.random() * 7 + 1);
    const newX = boardWidth / 2;
    const newY = 1;
    const newRotate = Rotation.Up;

    /* Check if game is over. If not, update score + spawn a new tile
    + set new time interval and continue */
    let isGameOver = false;
    for (let i = 0; i < MAX_PIXEL; i += 1) {
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

    this.setNewInterval(DEFAULT_TIME_INTERVAL_MS);

    return {
      field: newField,
      activeTileX: newX,
      activeTileY: newY,
      tileRotate: newRotate,
      activeTile: newTile,
    };
  }

  /**
   * @brief: renderTile:
   * @param[in]:
   */
  renderTile(x: number, y: number, tile: Tile, rotate: Rotation,
    renderValue: number): void {
    const { field } = this.state;
    const tiles = TILES_COORDS_ARR;
    for (let i = 0; i < MAX_PIXEL; i += 1) {
      field[y + tiles[tile][rotate][i][1]][x + tiles[tile][rotate][i][0]] = renderValue;
    }
    this.setState(() => ({
      field,
    }));
  }

  /**
   * @brief: render:
   * @return
   */
  render(): JSX.Element {
    const {
      field, gameOver, score, level, tileRotate, isPaused,
    } = this.state;
    return (
      <div className="tetris-wrap">
        <TetrisBoard
          field={field}
          gameOver={gameOver}
          score={score}
          level={level}
          rotate={tileRotate}
        />
        <div className="tetris-game-controls">
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
