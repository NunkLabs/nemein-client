const Game = import("constants/Game");

/* Classic game state typings */
declare type ClassicStates = {
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

/* Nemein game state typings */
declare type NemeinCell = {
  type: Game.TetrominoType;
  hp: number;
};

declare type NemeinStates = {
  level: number;
  score: number;
  field: {
    colArr: NemeinCell[];
    lowestY: number;
  }[];
  gameOver: boolean;
  heldTetromino: Game.TetrominoType;
  spawnedTetrominos: Game.TetrominoType[];
};
