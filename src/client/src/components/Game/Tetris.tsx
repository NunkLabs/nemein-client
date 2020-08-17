import React from "react";
import TetrisBoard from "./TetrisBoard";
import './Tetris.css';

const k_maxPixel = 4;
const k_maxRotate = 4;
const k_tilesCoordsArr = [ 
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
    [[0, 0], [0, 0], [0, 0], [0, 0]]
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
    [[-1, 0], [0, 0], [1, 0], [2, 0]]
  ],
  [
    /* T tile */
    [[0, 0], [-1, 0], [1, 0], [0, -1]],
    [[0, 0], [1, 0], [0, 1], [0, -1]],
    [[0, 0], [-1, 0], [1, 0], [0, 1]],
    [[0, 0], [-1, 0], [0, 1], [0, -1]]
  ],
  [
    /* J tile */
    [[0, 0], [-1, 0], [1, 0], [-1, -1]],
    [[0, 0], [0, 1], [0, -1], [1, -1]],
    [[0, 0], [1, 0], [-1, 0], [1, 1]],
    [[0, 0], [0, 1], [0, -1], [-1, 1]]
  ],
  [
    /* L tile */
    [[0, 0], [1, 0], [-1, 0], [1, -1]],
    [[0, 0], [0, 1], [0, -1], [1, 1]],
    [[0, 0], [1, 0], [-1, 0], [-1, 1]],
    [[0, 0], [0, 1], [0, -1], [-1, -1]]
  ],
  [
    /* Z tile */
    [[0, 0], [1, 0], [0, -1], [-1, -1]],
    [[0, 0], [1, 0], [0, 1], [1, -1]],
    [[0, 0], [1, 0], [0, -1], [-1, -1]],
    [[0, 0], [1, 0], [0, 1], [1, -1]]
  ],
  [
    /* S tile */
    [[0, 0], [-1, 0], [0, -1], [1, -1]],
    [[0, 0], [0, -1], [1, 0], [1, 1]],
    [[0, 0], [-1, 0], [0, -1], [1, -1]],
    [[0, 0], [0, -1], [1, 0], [1, 1]]
  ]
];
const k_arrowDownUnicode = 40;
const k_arrowLeftUnicode = 37;
const k_arrowUpUnicode = 38;
const k_arrowRightUnicode = 39;
const k_keyboardEvent = "keydown";

enum Command_t 
{
  Down,
  Left,
  Right,
  Rotate,
};

enum Tile_t 
{
  Blank,
  Square,
  I,
  T,
  J,
  L,
  Z,
  S,
};

enum Rotation_t
{
  Up,
  Right,
  Down,
  Left,
};

type TetrisProps =
{
  boardWidth: any,
  boardHeight: any
};

type TetrisState =
{
  init: boolean,
  activeTileX: number,
  activeTileY: number,
  activeTile: number,
  tileRotate: number,
  score: number,
  level: number,
  tileCount: number,
  gameOver: boolean,
  isPaused: boolean,
  field: any[],
  timerId: any,
};

class Tetris extends React.Component<TetrisProps, TetrisState> 
{
  /**
   * @brief: constructor
   * @param[in]: props
   */
  constructor(props: any) 
  {
    super(props);
    
    /* Binding handles */
    this.keyboardInputHandle = this.keyboardInputHandle.bind(this);

    /* Populating data for states */
    let field = [];
    for (let y = 0; y < props.boardHeight; y++) 
    {
      let row = [];
      for (let x = 0; x < props.boardWidth; x++) 
      {
        row.push(0);
      }
      field.push(row);
    }

    let xStart = Math.floor(parseInt(props.boardWidth) / 2);
    let tileStart = Math.floor(Math.random() * 7 + 1);

    this.state = 
    {
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
      field: field,
      timerId: null,
    };
  }

  /**
   * @brief: componentDidMount
   */
  componentDidMount()
  {
    document.addEventListener(k_keyboardEvent, this.keyboardInputHandle);

    this.setNewInterval(1000);
  }

  /**
   * @brief: componentWillUnmount
   */
  componentWillUnmount()
  {
    document.removeEventListener(k_keyboardEvent, this.keyboardInputHandle);

    window.clearInterval(this.state.timerId);
  }

  /**
   * @brief: keyboardInputHandle
   * @param[in]: event 
   */
  keyboardInputHandle(event: any)
  {
    switch(event.keyCode)
    {
      case k_arrowDownUnicode:
        return this.handleBoardUpdate(Command_t.Down);
      case k_arrowLeftUnicode:
        return this.handleBoardUpdate(Command_t.Left);
      case k_arrowUpUnicode:
        return this.handleBoardUpdate(Command_t.Rotate);
      case k_arrowRightUnicode:
        return this.handleBoardUpdate(Command_t.Right);
      default:
        console.log("Unknown key unicode");
     }
  }

  /**
   * @brief: handlePauseClick: 
   */
  handlePauseClick()
  {
    this.setState((prev) => {
      return {
        isPaused: !prev.isPaused
      };
    });
  }

  /**
   * @brief: handleNewGameClick: 
   */
  handleNewGameClick()
  {
    let field: any[] = [];

    for(let y = 0; y < this.props.boardHeight; y++)
    {
      let row = [];
      for(let x = 0; x < this.props.boardWidth; x++)
      {
        row.push(0);
      }
      field.push(row);
    }

    let xStart = Math.floor(parseInt(this.props.boardWidth) /2);

    this.setState(() => {
      return {
        init: true,
        activeTileX: xStart,
        activeTileY: 1,
        activeTile: 2,
        tileRotate: 0,
        score: 0,
        level: 1,
        tileCount: 0,
        gameOver: false,
        field: field
      }
    });
  }

  /**
   * @brief: handleBoardUpdate
   * @param[in]: command
   */
  handleBoardUpdate(command: Command_t)
  {
    /* Return if game is over or paused */
    if(this.state.gameOver || this.state.isPaused)
    {
      return;
    }

    let field = this.state.field;
    let x = this.state.activeTileX;
    let y = this.state.activeTileY;
    let rotate = this.state.tileRotate;
    let tile = this.state.activeTile;

    /* Handling init */
    if(this.state.init)
    {
      this.renderTile(x, y, tile, rotate, tile);
      this.setState(() => {
        return {
          init: false
        };
      });
      
      return;
    }

    /* Determine which value to be modified (x - y - rotate ?) */
    let xAdd = 0;
    let yAdd = 0;
    let rotateAdd = 0;
    switch(command)
    {
      case Command_t.Left:
        xAdd = -1;
        break;
      case Command_t.Right:
        xAdd = 1;
        break
      case Command_t.Rotate:
        rotateAdd = 1;
        break;
      case Command_t.Down:
        yAdd = 1;
        break;
      default:
        console.log("Unknown command");
        return;
    }

    /* Remove current tile from field for next logic */
    this.renderTile(x, y, tile, rotate, 0);

    /* Determine horizontal movement */
    if(this.checkValidMovement(x, xAdd, y, 0, tile, rotate, 0))
    {
      x += xAdd;
    }

    /* Determine rotation */
    if(this.checkValidMovement(x, 0, y, 0, tile, rotate, rotateAdd))
    {
      rotate = rotate + rotateAdd === k_maxRotate ? Rotation_t.Up : (rotate + rotateAdd);
    }

    /* Determine vertical movement */
    let yAddValid = this.checkValidMovement(x, 0, y ,yAdd, tile, rotate, 0);
    if(yAddValid) 
    {
      y += yAdd;
    }
    
    /* Rerender tile */
    this.renderTile(x, y, tile, rotate, tile);

    /* Handling blocked movement */
    if(!yAddValid)
    {
      let newStates = this.handleBlockedMovement(x, y, tile, rotate);
      /* Game over */
      if(newStates === undefined) {
        return;
      }
      field = newStates.field;
      x = newStates.activeTileX;
      y = newStates.activeTileY;
      rotate = newStates.tileRotate;
      tile = newStates.activeTile;
    }

    /* Update new states */
    this.setState(() => {
      return {
        field: field,
        activeTileX: x,
        activeTileY: y,
        tileRotate: rotate,
        activeTile: tile
      };
    });
  }

  /**
   * @brief: setNewInterval: 
   * @param[in]: interval
   */
  setNewInterval(interval: number)
  {
    clearInterval(this.state.timerId);

    let timerId = window.setInterval(
      () => this.handleBoardUpdate(Command_t.Down),
      interval - (this.state.level * 10 > 600 ? 600 : this.state.level * 10)
    );

    this.setState(() => {
      return {
        timerId: timerId
      }
    });
  }

  /**
   * @brief: renderTile: 
   * @param[in]: 
   */
  renderTile(x: number, y: number, tile: Tile_t, rotate: Rotation_t, renderValue: number)
  {
    let field = this.state.field;
    let tiles = k_tilesCoordsArr;
    for(let i = 0; i < k_maxPixel; i++)
    {
      field[y + tiles[tile][rotate][i][1]][x + tiles[tile][rotate][i][0]] = renderValue;
    }
    this.setState(() => {
      return {
        field: field,
      };
    });
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
    tile: Tile_t, rotate: Rotation_t, rotateAdd: number)
  {
    let field = this.state.field;
    let tiles = k_tilesCoordsArr;
    
    let newX = xAdd ? (x + xAdd) : x;
    let newY = yAdd ? (y + yAdd) : y;
    let newRotate = rotate + rotateAdd === k_maxRotate ? Rotation_t.Up : (rotate + rotateAdd);
  
    for(let i = 0; i < k_maxPixel; i++)
    {
      let xValid = newX + tiles[tile][newRotate][i][0] >= 0 
        &&  newX + tiles[tile][newRotate][i][0] < this.props.boardWidth;
      let yValid = newY + tiles[tile][newRotate][i][1] >= 0 
        &&  newY + tiles[tile][newRotate][i][1] < this.props.boardHeight;
      if(xValid && yValid)
      {
        let pixelOverlapped = field[newY + tiles[tile][newRotate][i][1]][newX + tiles[tile][newRotate][i][0]] !== 0;
        if(pixelOverlapped)
        {
          return false;
        }
      }
      else
      {
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
  handleBlockedMovement(x: number, y: number, tile: Tile_t, rotate: Rotation_t)
  {
    let field = this.state.field;
    let tiles = k_tilesCoordsArr;

    /* Check for complete lines */
    for(let row = this.props.boardHeight - 1; row >= 0; row--) 
    {
      let isLineComplete = true;

      for(let col = 0; col < this.props.boardWidth; col++) 
      {
        if (field[row][col] === 0) {
          isLineComplete = false;
          break;
        }
      }

      if(isLineComplete) 
      {
        for (let detectedRow = row; detectedRow > 0; detectedRow--) 
        {
          for (let col = 0; col < this.props.boardWidth; col++) 
          {
            field[detectedRow][col] = field[detectedRow - 1][col];
          }
        }
        row += 1;
      }
    }

    let newTile = Math.floor(Math.random() * 7 + 1);
    let newX = parseInt(this.props.boardWidth) / 2;
    let newY = 1;
    let newRotate = Rotation_t.Up;

    /* Check if game is over. If not, update score + spawn a new tile + set new time interval and continue */
    let isGameOver = field[newY + tiles[newTile][rotate][0][1]][newX + tiles[newTile][newRotate][0][0]] !== 0 ||
      field[newY + tiles[newTile][newRotate][1][1]][newX + tiles[newTile][newRotate][1][0]] !== 0 ||
      field[newY + tiles[newTile][newRotate][2][1]][newX + tiles[newTile][newRotate][2][0]] !== 0 ||
      field[newY + tiles[newTile][newRotate][3][1]][newX + tiles[newTile][newRotate][3][0]] !== 0;

    if(isGameOver)
    {
      this.setState(() => {
        return {
          gameOver: true
        };
      });
      return;
    }

    this.setState((prev) => {
      return {
        score: prev.score + 1 * prev.level,
        tileCount: prev.tileCount + 1,
        level: 1 + Math.floor(prev.tileCount / 10),
      };
    });
    
    this.setNewInterval(1000);

    return {
      field: field,
      activeTileX: newX,
      activeTileY: newY,
      tileRotate: newRotate,
      activeTile: newTile
    };
  }
  
  /**
   * @brief: render: 
   * @return 
   */
  render()
  {
    return(
      <div className="tetris-wrap">
        <TetrisBoard
          field={this.state.field}
          gameOver={this.state.gameOver}
          score={this.state.score}
          level={this.state.level}
          rotate={this.state.tileRotate}
        />
        <div className="tetris__game-controls">
          <button className="btn-custom btn-custom-light btn-block" onClick={() => {
            return this.handleNewGameClick();}}>
              New Game
          </button>
          <button className="btn-custom btn-custom-light btn-block" onClick={() => {
            return this.handlePauseClick();}}>
              {this.state.isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>
    )
  }
}

export default Tetris;
