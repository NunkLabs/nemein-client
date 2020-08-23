/* Misc consts */
export const MAX_PIXEL = 4;
export const MAX_ROTATE = 4;
export const Y_START = 0;

/* Tiles coords consts */
export const MAX_TILE_INDEX = 7;
export const MIN_TILE_INDEX = 1;
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
    [[-1, -1], [-1, 0], [0, 0], [0, -1]],
    [[-1, -1], [-1, 0], [0, 0], [0, -1]],
    [[-1, -1], [-1, 0], [0, 0], [0, -1]],
    [[-1, -1], [-1, 0], [0, 0], [0, -1]],
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

/* Keyboard event consts */
export const ARROW_DOWN_UNICODE = 40;
export const ARROW_LEFT_UNICODE = 37;
export const ARROW_UP_UNICODE = 38;
export const ARROW_RIGHT_UNICODE = 39;
export const KEYBOARD_EVENT = 'keydown';

/* Timer consts */
export const DEFAULT_TIME_INTERVAL_MS = 1000;

/* Enum 'types' */
export enum Command {
  Down,
  Left,
  Right,
  Rotate,
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
