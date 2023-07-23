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

export const BASE_STYLE = {
  LIGHT: {
    PRIMARY: 0x030712 /* Tailwind Gray 950 */,
    SECONDARY: 0xf9fafb /* Tailwind Gray 50 */,
    ALTERNATE: 0x111827 /* Tailwind Gray 900 */,
  },
  DARK: {
    PRIMARY: 0xf9fafb /* Tailwind Gray 50 */,
    SECONDARY: 0x030712 /* Tailwind Gray 950 */,
    ALTERNATE: 0xf3f4f6 /* Tailwind Gray 100 */,
  },
};

export const BORDER_STYLE = {
  ALIGNMENT: 1,
  WIDTH: 4,
};

export const TETROMINO_STYLES: {
  [key: string]: {
    [key: string]: number;
  };
} = {
  LIGHT: {
    Blank: BASE_STYLE.LIGHT.SECONDARY,
    Square: 0xfef08a,
    I: 0x93c5fd,
    T: 0xd8b4fe,
    J: 0xa5b4fc,
    L: 0xfdba74,
    Z: 0xfca5a5,
    S: 0x86efac,
    Grey: BASE_STYLE.LIGHT.ALTERNATE,
    Ghost: BASE_STYLE.LIGHT.ALTERNATE,
  },
  DARK: {
    Blank: BASE_STYLE.DARK.SECONDARY,
    Square: 0xfef08a,
    I: 0x93c5fd,
    T: 0xd8b4fe,
    J: 0xa5b4fc,
    L: 0xfdba74,
    Z: 0xfca5a5,
    S: 0x86efac,
    Grey: BASE_STYLE.DARK.ALTERNATE,
    Ghost: BASE_STYLE.DARK.ALTERNATE,
  },
};

export const DAMAGE_TYPE_STYLES: {
  [key: string]: {
    [key: string]: number;
  };
} = {
  LIGHT: {
    Physical: BASE_STYLE.LIGHT.PRIMARY,
    Fire: 0xfca5a5,
    Cold: 0x93c5fd,
    Lightning: 0xfef08a,
  },
  DARK: {
    Physical: BASE_STYLE.DARK.PRIMARY,
    Fire: 0xfca5a5,
    Cold: 0x93c5fd,
    Lightning: 0xfef08a,
  },
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
