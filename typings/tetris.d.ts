const Tetris = import("constants/Tetris");

/* Tetris game state typings */
declare type TetrisCell = {
  type: Tetris.TetrominoType;
  hp: number;
};

declare type TetrisState = {
  level: number;
  score: number;
  field: {
    colArr: TetrisCell[];
    lowestY: number;
  }[];
  gameOver: boolean;
  heldTetromino: Tetris.TetrominoType;
  spawnedTetrominos: Tetris.TetrominoType[];
};
