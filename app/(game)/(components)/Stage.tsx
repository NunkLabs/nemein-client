import { Container, Sprite } from "@pixi/react";
import { useContext, useEffect, useState } from "react";

import { GameContext } from "../Game";
import {
  STAGE_SPACER,
  TETROMINO_STYLES,
  TETROMINOS_ARR,
  TetrominoType,
  HOLD_PANEL,
  GAME_PANEL,
  QUEUE_PANEL,
} from "./Utils";
import StageWrapper from "./ContextBridge";
import BorderGraphics from "./BorderGraphics";
import ClearedLines from "./ClearedLines";
import PerformanceTracker from "./PerformanceTracker";

const SCREEN_SHAKE_INTERVAL_MS = 10;
const SCREEN_SHAKE_OFFSETS: [number, number][] = [
  [0, 0],
  [-10, -10],
  [10, 10],
  [0, 0],
];

export default function Stage() {
  const { gameStates, gameSettings } = useContext(GameContext);

  const [stagePosition, setStagePosition] = useState<[number, number]>([0, 0]);
  const [gameSprites, setGameSprites] = useState<JSX.Element[]>([]);
  const [clearedLines, setClearedLines] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (!gameStates) return;

    const { gameField, heldTetromino, spawnedTetrominos } = gameStates;

    const sprites: JSX.Element[] = [];

    /* Constructs the main game sprites */
    gameField.forEach((col, colIndex) => {
      col.colArr.forEach((row, rowIndex) => {
        const tetromino =
          TetrominoType[typeof row === "number" ? row : row.type];

        sprites.push(
          <Sprite
            alpha={
              gameStates.gameOver ||
              tetromino === TetrominoType[TetrominoType.Ghost]
                ? 0.25
                : 1
            }
            height={GAME_PANEL.CHILD}
            width={GAME_PANEL.CHILD}
            position={[
              GAME_PANEL.X + GAME_PANEL.CHILD * colIndex,
              GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex,
            ]}
            image={"/textures/blank.svg"}
            tint={TETROMINO_STYLES[tetromino]}
            key={`game-${colIndex}-${rowIndex}`}
          />
        );
      });
    });

    /* Constructs the hold panel sprites */
    const holdField = TETROMINOS_ARR[heldTetromino];

    holdField.forEach((col, colIndex) => {
      col.forEach((row, rowIndex) => {
        const tetromino = TetrominoType[row];

        sprites.push(
          <Sprite
            alpha={gameStates.gameOver ? 0.25 : 1}
            height={HOLD_PANEL.CHILD}
            width={HOLD_PANEL.CHILD}
            position={[
              HOLD_PANEL.X + HOLD_PANEL.CHILD * colIndex,
              HOLD_PANEL.Y + HOLD_PANEL.CHILD * rowIndex,
            ]}
            image={"/textures/blank.svg"}
            tint={TETROMINO_STYLES[tetromino]}
            key={`hold-${colIndex}-${rowIndex}`}
          />
        );
      });
    });

    /* Constructs the queue panel sprites */
    let queuePanelYCoord = QUEUE_PANEL.Y;

    spawnedTetrominos.forEach((spawnedTetromino, spawnedIndex) => {
      const queueField = TETROMINOS_ARR[spawnedTetromino];

      queueField.forEach((col, colIndex) => {
        col.forEach((row, rowIndex) => {
          const tetromino = TetrominoType[row];

          sprites.push(
            <Sprite
              alpha={gameStates.gameOver ? 0.25 : 1}
              height={QUEUE_PANEL.CHILD}
              width={QUEUE_PANEL.CHILD}
              position={[
                QUEUE_PANEL.X + QUEUE_PANEL.CHILD * colIndex,
                queuePanelYCoord + QUEUE_PANEL.CHILD * rowIndex,
              ]}
              image={"/textures/blank.svg"}
              tint={TETROMINO_STYLES[tetromino]}
              key={`queue-${spawnedIndex}-${colIndex}-${rowIndex}`}
            />
          );
        });
      });

      queuePanelYCoord += QUEUE_PANEL.HEIGHT + STAGE_SPACER;
    });

    setGameSprites(sprites);

    /* Handles line clear on Nemein game mode */
    if ("clearRecordsArr" in gameStates && gameStates.clearRecordsArr.length) {
      setClearedLines(
        <ClearedLines clearRecordsArr={gameStates.clearRecordsArr} />
      );

      if (!gameSettings.stageShake) return;

      let offsetIterationIndex = 0;

      const screenShakeInterval = setInterval(() => {
        setStagePosition(SCREEN_SHAKE_OFFSETS[offsetIterationIndex]);

        offsetIterationIndex += 1;

        if (offsetIterationIndex < SCREEN_SHAKE_OFFSETS.length) return;

        clearInterval(screenShakeInterval);
      }, SCREEN_SHAKE_INTERVAL_MS);
    }
  }, [gameStates, gameSettings]);

  return (
    <StageWrapper>
      <Container position={stagePosition}>
        <BorderGraphics />
        {gameSprites}
        {gameSettings.isClassic ? null : clearedLines}
      </Container>
      {gameSettings.performanceDisplay ? <PerformanceTracker /> : null}
    </StageWrapper>
  );
}
