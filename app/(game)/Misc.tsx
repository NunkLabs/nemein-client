/* Base game sizes in pixels */
export const STAGE_SIZE = 720;
export const STAGE_SPACER = 24;

export const HOLD_PANEL = {
  CHILD: 24,
  HEIGHT: 120,
  WIDTH: 120,
  X: 66,
  Y: STAGE_SPACER * 2,
};

export const GAME_PANEL = {
  CHILD: 30,
  HEIGHT: 600,
  WIDTH: 300,
  X: HOLD_PANEL.X + HOLD_PANEL.WIDTH + STAGE_SPACER,
  Y: STAGE_SPACER * 2,
};

export const QUEUE_PANEL = {
  CHILD: 16,
  HEIGHT: 80,
  WIDTH: 80,
  X: GAME_PANEL.X + GAME_PANEL.WIDTH + STAGE_SPACER,
  Y: STAGE_SPACER * 2,
};

export const BORDER_STYLE = {
  WIDTH: 4,
  COLOR: 0xf1f5f9,
  ALIGNMENT: 1,
};

export const TETROMINO_STYLES: {
  [key: string]: number;
} = {
  Blank: 0x1f2937,
  Square: 0xfef08a,
  I: 0x93c5fd,
  T: 0xd8b4fe,
  J: 0xa5b4fc,
  L: 0xfdba74,
  Z: 0xfca5a5,
  S: 0x86efac,
  Grey: 0xf1f5f9,
  Ghost: 0xf1f5f9,
};

export const DAMAGE_TYPE_STYLES: {
  [key: string]: number;
} = {
  Physical: 0xcbd5e1,
  Fire: 0xfca5a5,
  Cold: 0x93c5fd,
  Lightning: 0xfef08a,
};

/* Tetrominos coords consts */
export const TETROMINOS_ARR = [
  [
    /* Blank */
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    /* 2x2 square tetromino */
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    /* I tetromino */
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    /* T tetromino */
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 3, 0, 0],
    [0, 3, 3, 3, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    /* J tetromino */
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 4, 0],
    [0, 4, 4, 4, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    /* L tetromino */
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 5, 0, 0, 0],
    [0, 5, 5, 5, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    /* Z tetromino */
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 6, 6, 0],
    [0, 6, 6, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    /* S tetromino */
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 7, 7, 0, 0],
    [0, 0, 7, 7, 0],
    [0, 0, 0, 0, 0],
  ],
];
