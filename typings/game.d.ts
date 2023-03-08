const Game = import("constants/Game");

/* Classic game state typings */
declare type ClassicStates = {
  level: number;
  score: number;
  gameField: {
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
  level: number /* Deprecated but still kept to suppress errors */;
  score: number /* Deprecated but still kept to suppress errors */;
  gameField: {
    colArr: NemeinCell[];
    lowestY: number;
  }[];
  statusField: Game.TetrominoType[][];
  gameOver: boolean;
  heldTetromino: Game.TetrominoType;
  spawnedTetrominos: Game.TetrominoType[];
};
