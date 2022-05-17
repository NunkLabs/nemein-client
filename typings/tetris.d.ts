/* Tetris game state typings */
declare type TetrisState = {
  level: number;
  score: number;
  field: {
    colArr: number[];
    lowestY: number;
  }[];
  gameOver: boolean;
  heldTetromino: TetrominoType;
  spawnedTetrominos: TetrominoType[];
};
