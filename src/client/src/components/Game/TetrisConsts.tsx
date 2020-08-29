/* Misc consts */
export const MAX_PIXEL = 4;
export const MAX_ROTATE = 4;
export const Y_START = 0;
export const X_INDEX = 0;
export const Y_INDEX = 1;
export const UPPER_Y_INDEX = 2;

/* Tiles coords consts */
export const MAX_TILE_INDEX = 7;
export const MIN_TILE_INDEX = 1;
export const GHOST_TILE_INDEX = 8;
export const TILES_COORDS_ARR = [
  /**
   * Each element in this array represents all 4 rotations of 1 tile
   * Each rotation consists of 4 pixel coordinates [x, y] of the tile
   *
   * NOTE: there are places where the coordinate is -1, this is to specify
   * which pixel is the center of rotation
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
    [[-1, -1], [0, -1], [-1, 0], [0, 0]],
    [[-1, -1], [0, -1], [-1, 0], [0, 0]],
    [[-1, -1], [0, -1], [-1, 0], [0, 0]],
    [[-1, -1], [0, -1], [-1, 0], [0, 0]],
  ],
  [
    /* I tile */
    [[-2, 0], [-1, 0], [0, 0], [1, 0]],
    [[0, -1], [0, 0], [0, 1], [0, 2]],
    [[-2, 0], [-1, 0], [0, 0], [1, 0]],
    [[0, -1], [0, 0], [0, 1], [0, 2]],
  ],
  [
    /* T tile */
    [[-1, 0], [0, -1], [0, 0], [1, 0]],
    [[0, 0], [0, -1], [0, 1], [1, 0]],
    [[-1, 0], [0, 0], [0, 1], [1, 0]],
    [[-1, 0], [0, -1], [0, 1], [0, 0]],
  ],
  [
    /* J tile */
    [[-1, 0], [-1, -1], [0, 0], [1, 0]],
    [[0, 0], [0, -1], [0, 1], [1, -1]],
    [[-1, 0], [0, 0], [1, 1], [1, 0]],
    [[-1, 1], [0, -1], [0, 1], [0, 0]],
  ],
  [
    /* L tile */
    [[-1, 0], [1, -1], [0, 0], [1, 0]],
    [[0, 0], [0, -1], [0, 1], [1, 1]],
    [[-1, 0], [0, 0], [-1, 1], [1, 0]],
    [[-1, -1], [0, -1], [0, 1], [0, 0]],
  ],
  [
    /* Z tile */
    [[-1, -1], [0, -1], [0, 0], [1, 0]],
    [[0, 0], [1, -1], [0, 1], [1, 0]],
    [[-1, -1], [0, -1], [0, 0], [1, 0]],
    [[0, 0], [1, -1], [0, 1], [1, 0]],
  ],
  [
    /* S tile */
    [[-1, 0], [0, -1], [0, 0], [1, -1]],
    [[0, 0], [0, -1], [1, 1], [1, 0]],
    [[-1, 0], [0, -1], [0, 0], [1, -1]],
    [[0, 0], [0, -1], [1, 1], [1, 0]],
  ],
];

/* Keyboard event consts */
export const ARROW_DOWN = 'ArrowDown';
export const ARROW_LEFT = 'ArrowLeft';
export const ARROW_UP = 'ArrowUp';
export const ARROW_RIGHT = 'ArrowRight';
export const SPACE = 'c'; /* TODO: Change this after space is resolved */
export const KEYBOARD_EVENT = 'keydown';

/* Timer consts */
export const DEFAULT_TIME_INTERVAL_MS = 1000;

/* Enum 'types' */
export enum Command {
  Down,
  Left,
  Right,
  Rotate,
  HardDrop,
}

export enum Tile {
  Blank,
  Square,
  I,
  T,
  J,
  L,
  Z,
  S,
}

export enum Rotation {
  Up,
  Right,
  Down,
  Left,
}
