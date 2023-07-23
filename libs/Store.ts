import { create } from "zustand";

/* Game options typings */
type GameOptions = {
  gameMode: "classic" | "nemein";
  antialias: boolean;
  powerPreference: "default" | "high-performance" | "low-power";
  performanceDisplay: boolean;
  stageShake: boolean;
};

/* Game performance typings */
type GamePerformance = {
  currentLatency: number;
  frameRate: number;
  frameTime: number;
};

/* Tetromino enum types */
export enum TetrominoType {
  Blank,
  Square,
  I,
  T,
  J,
  L,
  Z,
  S,
  Grey,
  Ghost,
}

/* Classic game state typings */
export type ClassicStates = {
  type: "classic";
  gameField: {
    colArr: number[];
    lowestY: number;
  }[];
};

/* Nemein game state typings */
export enum DmgType {
  Physical,
  Fire,
  Cold,
  Lightning,
}

export type ClearRecord = {
  idx: number;
  lineTypeArr: TetrominoType[];
  wasCrit: boolean;
  dmgDealt: {
    dominantDmgType: DmgType;
    value: number;
  };
};

export type NemeinStates = {
  type: "nemein";
  gameField: {
    colArr: {
      type: TetrominoType;
      hp: number;
    }[];
    lowestY: number;
  }[];
  clearRecordsArr: ClearRecord[];
};

/* Combined game state typings */
export type GameStates = {
  level: number;
  score: number;
  gameOver: boolean;
  heldTetromino: TetrominoType;
  spawnedTetrominos: TetrominoType[];
} & (ClassicStates | NemeinStates);

/* Game status typings */
type GameStatus = "initializing" | "ongoing" | "pausing" | "ending";

/* Game theme typings, gives autocomplete while satifies string | undefined */
type GameTheme = "light" | "dark" | (string & {}) | undefined;

/* Game store typings */
type GameStoreState = {
  gameOptions: GameOptions;
  gamePerformance: GamePerformance;
  gameStates: GameStates | null;
  gameStatus: GameStatus;
  gameTheme: GameTheme;
};

type GameStoreAction = {
  updateGameOptions: (gameOptions: Partial<GameOptions>) => void;
  updateGamePerformance: (gamePerformance: Partial<GamePerformance>) => void;
  updateGameStates: (gameStates: GameStates) => void;
  updateGameStatus: (gameStatus: GameStatus) => void;
  updateGameTheme: (gameTheme: GameTheme) => void;
};

/* Builds the game store */
export const useGameStore = create<GameStoreState & GameStoreAction>((set) => ({
  gameOptions: {
    gameMode: "nemein",
    antialias: true,
    powerPreference: "default",
    performanceDisplay: process.env.NODE_ENV === "development",
    stageShake: true,
  },
  gamePerformance: {
    currentLatency: 0,
    frameRate: 0,
    frameTime: 0,
  },
  gameStates: null,
  gameStatus: "initializing",
  gameTheme: "dark",
  updateGameOptions: (gameOptions: Partial<GameOptions>) =>
    set((state) => ({ gameOptions: { ...state.gameOptions, ...gameOptions } })),
  updateGamePerformance: (gamePerformance: Partial<GamePerformance>) =>
    set((state) => ({
      gamePerformance: { ...state.gamePerformance, ...gamePerformance },
    })),
  updateGameStates: (gameStates: GameStates) => set(() => ({ gameStates })),
  updateGameStatus: (gameStatus: GameStatus) => set(() => ({ gameStatus })),
  updateGameTheme: (gameTheme: GameTheme) => set(() => ({ gameTheme })),
}));
