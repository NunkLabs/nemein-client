import { Container, Graphics, PixiRef, Sprite } from "@pixi/react";

/* Tetromino enum types */
enum TetrominoType {
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

type ClearRecord = {
  idx: number;
  lineTypeArr: TetrominoType[];
};

/* Classic game state typings */
type ClassicStates = {
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
type NemeinStates = {
  level: number /* Deprecated but still kept to suppress errors */;
  score: number /* Deprecated but still kept to suppress errors */;
  gameField: {
    colArr: {
      type: TetrominoType;
      hp: number;
    }[];
    lowestY: number;
  }[];
  clearRecordsArr: ClearRecord[];
  gameOver: boolean;
  heldTetromino: TetrominoType;
  spawnedTetrominos: TetrominoType[];
};

type IGraphics = PixiRef<typeof Graphics>;

/* Base game sizes in pixels */
const STAGE_SIZE = 720;
const STAGE_SPACER = 24;

const HOLD_PANEL = {
  CHILD: 24,
  HEIGHT: 120,
  WIDTH: 120,
  X: 66,
  Y: STAGE_SPACER * 2,
};

const GAME_PANEL = {
  CHILD: 30,
  HEIGHT: 600,
  WIDTH: 300,
  X: HOLD_PANEL.X + HOLD_PANEL.WIDTH + STAGE_SPACER,
  Y: STAGE_SPACER * 2,
};

const QUEUE_PANEL = {
  CHILD: 16,
  HEIGHT: 80,
  WIDTH: 80,
  X: GAME_PANEL.X + GAME_PANEL.WIDTH + STAGE_SPACER,
  Y: STAGE_SPACER * 2,
};

const BORDER_STYLE = {
  WIDTH: 4,
  COLOR: 0xf1f5f9,
  ALIGNMENT: 1,
};

const TETROMINO_STYLE: {
  [key: string]: number;
} = {
  BLANK: 0x1f2937,
  SQUARE: 0xfef08a,
  I: 0x93c5fd,
  T: 0xd8b4fe,
  J: 0xa5b4fc,
  L: 0xfdba74,
  Z: 0xfca5a5,
  S: 0x86efac,
  GREY: 0xf1f5f9,
  GHOST: 0xf1f5f9,
};

/* Tetrominos coords consts */
const TETROMINOS_ARR = [
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
    [0, 4, 0, 0, 0],
    [0, 4, 4, 4, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    /* L tetromino */
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 5, 0],
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

export function drawPanels(panelGraphics: IGraphics): void {
  panelGraphics.clear();

  panelGraphics.lineStyle({
    width: BORDER_STYLE.WIDTH,
    color: BORDER_STYLE.COLOR,
    alignment: BORDER_STYLE.ALIGNMENT,
  });

  panelGraphics.drawRect(
    HOLD_PANEL.X,
    HOLD_PANEL.Y,
    HOLD_PANEL.WIDTH,
    HOLD_PANEL.HEIGHT
  );

  panelGraphics.drawRect(
    GAME_PANEL.X,
    GAME_PANEL.Y,
    GAME_PANEL.WIDTH,
    GAME_PANEL.HEIGHT
  );

  for (
    let queuePanelYCoord = QUEUE_PANEL.Y;
    queuePanelYCoord + QUEUE_PANEL.HEIGHT + STAGE_SPACER < STAGE_SIZE;
    queuePanelYCoord += QUEUE_PANEL.HEIGHT + STAGE_SPACER
  ) {
    panelGraphics.drawRect(
      QUEUE_PANEL.X,
      queuePanelYCoord,
      QUEUE_PANEL.WIDTH,
      QUEUE_PANEL.HEIGHT
    );
  }
}

export function getGameRender(
  gameStates: ClassicStates | NemeinStates
): JSX.Element[] {
  const pixiContainers: JSX.Element[] = [];

  const { gameField, heldTetromino, spawnedTetrominos } = gameStates;

  /* Render the main game panel */
  gameField.forEach((col, colIndex) => {
    pixiContainers.push(
      <Container
        position={[GAME_PANEL.X + GAME_PANEL.CHILD * colIndex, GAME_PANEL.Y]}
        key={`game-col-${colIndex}`}
      >
        {col.colArr.map((row, rowIndex) => {
          const tetromino =
            TetrominoType[typeof row === "number" ? row : row.type];
          const tintColor = TETROMINO_STYLE[tetromino.toUpperCase()];

          return (
            <Sprite
              alpha={
                gameStates.gameOver ||
                tetromino === TetrominoType[TetrominoType.Ghost]
                  ? 0.25
                  : 1
              }
              height={GAME_PANEL.CHILD}
              width={GAME_PANEL.CHILD}
              position={[0, GAME_PANEL.CHILD * rowIndex]}
              image={"/textures/blank.svg"}
              tint={tintColor}
              key={`game-row-${rowIndex}`}
            />
          );
        })}
      </Container>
    );
  });

  /* Render the hold panel */
  const holdField = TETROMINOS_ARR[heldTetromino];

  holdField.forEach((col, colIndex) => {
    pixiContainers.push(
      <Container
        position={[HOLD_PANEL.X + HOLD_PANEL.CHILD * colIndex, HOLD_PANEL.Y]}
        key={`hold-col-${colIndex}`}
      >
        {col.map((row, rowIndex) => {
          const tetromino = TetrominoType[row];
          const tintColor = TETROMINO_STYLE[tetromino.toUpperCase()];

          return (
            <Sprite
              alpha={gameStates.gameOver ? 0.25 : 1}
              height={HOLD_PANEL.CHILD}
              width={HOLD_PANEL.CHILD}
              position={[0, HOLD_PANEL.CHILD * rowIndex]}
              image={"/textures/blank.svg"}
              tint={tintColor}
              key={`hold-row-${rowIndex}`}
            />
          );
        })}
      </Container>
    );
  });

  /* Render the queue panel */
  let queuePanelYCoord = QUEUE_PANEL.Y;

  spawnedTetrominos.forEach((spawnedTetromino, spawnedIndex) => {
    const queueField = TETROMINOS_ARR[spawnedTetromino];

    queueField.forEach((col, colIndex) => {
      pixiContainers.push(
        <Container
          position={[
            QUEUE_PANEL.X + QUEUE_PANEL.CHILD * colIndex,
            queuePanelYCoord,
          ]}
          key={`queue-${spawnedIndex}-col-${colIndex}`}
        >
          {col.map((row, rowIndex) => {
            const tetromino = TetrominoType[row];
            const tintColor = TETROMINO_STYLE[tetromino.toUpperCase()];

            return (
              <Sprite
                alpha={gameStates.gameOver ? 0.25 : 1}
                height={QUEUE_PANEL.CHILD}
                width={QUEUE_PANEL.CHILD}
                position={[0, QUEUE_PANEL.CHILD * rowIndex]}
                image={"/textures/blank.svg"}
                tint={tintColor}
                key={`queue-${spawnedIndex}-row-${rowIndex}`}
              />
            );
          })}
        </Container>
      );
    });

    queuePanelYCoord += QUEUE_PANEL.HEIGHT + STAGE_SPACER;
  });

  return pixiContainers;
}
