import { Container, Sprite } from "@pixi/react";
import { Texture } from "pixi.js";
import { useContext, useEffect, useRef, useState } from "react";

import { GameContext } from "../Game";
import {
  STAGE_SPACER,
  HOLD_PANEL,
  GAME_PANEL,
  QUEUE_PANEL,
  TETROMINO_STYLES,
  TETROMINOS_ARR,
  TetrominoType,
} from "./Utils";
import StageWrapper from "./ContextBridge";
import BorderGraphics from "./BorderGraphics";
import ClearedLines from "./ClearedLines";
import PerformanceTracker from "./PerformanceTracker";
import ClearedBlock from "./ClearedBlock";

const SCREEN_SHAKE_INTERVAL_MS = 10;
const SCREEN_SHAKE_OFFSETS: [number, number][] = [
  [0, 0],
  [-10, -10],
  [10, 10],
  [0, 0],
];

export default function Stage() {
  const { gameStates, gameSettings } = useContext(GameContext);

  const textures = useRef({
    blank: Texture.from("/textures/blank.svg"),
  });

  const [stagePosition, setStagePosition] = useState<[number, number]>([0, 0]);
  const [gameSprites, setGameSprites] = useState<JSX.Element[]>([]);
  const [clearedLines, setClearedLines] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (!gameStates) return;

    const sprites: JSX.Element[] = [];

    /* Constructs the main game sprites */
    if (gameStates.type === "nemein") {
      gameStates.gameField.forEach((col, colIndex) => {
        col.colArr.forEach((row, rowIndex) => {
          const tetrominoName = TetrominoType[row.type];

          sprites.push(
            gameStates.gameOver ? (
              <ClearedBlock
                type={row.type}
                gameOver={gameStates.gameOver}
                initialXDisplacement={
                  GAME_PANEL.X + GAME_PANEL.CHILD * colIndex
                }
                initialYDisplacement={
                  GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex
                }
                key={`game-over-${colIndex}-${rowIndex}`}
              />
            ) : (
              <Sprite
                alpha={row.type === TetrominoType.Ghost ? 0.25 : 1}
                height={GAME_PANEL.CHILD}
                width={GAME_PANEL.CHILD}
                position={[
                  GAME_PANEL.X + GAME_PANEL.CHILD * colIndex,
                  GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex,
                ]}
                texture={textures.current.blank}
                tint={TETROMINO_STYLES[tetrominoName]}
                key={`game-${colIndex}-${rowIndex}`}
              />
            )
          );
        });
      });

      /* Handles line clear on Nemein game mode */
      if (gameStates.clearRecordsArr.length) {
        setClearedLines(
          <ClearedLines clearRecordsArr={gameStates.clearRecordsArr} />
        );

        if (!gameSettings.stageShake) return;

        let offsetIterationIndex = 0;

        const stageShakeInterval = setInterval(() => {
          setStagePosition(SCREEN_SHAKE_OFFSETS[offsetIterationIndex]);

          offsetIterationIndex += 1;

          if (offsetIterationIndex < SCREEN_SHAKE_OFFSETS.length) return;

          clearInterval(stageShakeInterval);
        }, SCREEN_SHAKE_INTERVAL_MS);
      }
    } else {
      gameStates.gameField.forEach((col, colIndex) => {
        col.colArr.forEach((row, rowIndex) => {
          const tetrominoName = TetrominoType[row];

          sprites.push(
            gameStates.gameOver ? (
              <ClearedBlock
                type={row}
                gameOver={gameStates.gameOver}
                initialXDisplacement={
                  GAME_PANEL.X + GAME_PANEL.CHILD * colIndex
                }
                initialYDisplacement={
                  GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex
                }
                key={`game-over-${colIndex}-${rowIndex}`}
              />
            ) : (
              <Sprite
                alpha={row === TetrominoType.Ghost ? 0.25 : 1}
                height={GAME_PANEL.CHILD}
                width={GAME_PANEL.CHILD}
                position={[
                  GAME_PANEL.X + GAME_PANEL.CHILD * colIndex,
                  GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex,
                ]}
                texture={textures.current.blank}
                tint={TETROMINO_STYLES[tetrominoName]}
                key={`game-${colIndex}-${rowIndex}`}
              />
            )
          );
        });
      });
    }

    /* Constructs the hold panel sprites */
    const holdField = TETROMINOS_ARR[gameStates.heldTetromino];

    holdField.forEach((col, colIndex) => {
      col.forEach((row, rowIndex) => {
        const tetrominoName = TetrominoType[row];

        sprites.push(
          <Sprite
            alpha={gameStates.gameOver ? 0.25 : 1}
            height={HOLD_PANEL.CHILD}
            width={HOLD_PANEL.CHILD}
            position={[
              HOLD_PANEL.X + HOLD_PANEL.CHILD * colIndex,
              HOLD_PANEL.Y + HOLD_PANEL.CHILD * rowIndex,
            ]}
            texture={textures.current.blank}
            tint={TETROMINO_STYLES[tetrominoName]}
            key={`hold-${colIndex}-${rowIndex}`}
          />
        );
      });
    });

    /* Constructs the queue panel sprites */
    let queuePanelYCoord = QUEUE_PANEL.Y;

    gameStates.spawnedTetrominos.forEach((spawnedTetromino, spawnedIndex) => {
      const queueField = TETROMINOS_ARR[spawnedTetromino];

      queueField.forEach((col, colIndex) => {
        col.forEach((row, rowIndex) => {
          const tetrominoName = TetrominoType[row];

          sprites.push(
            <Sprite
              alpha={gameStates.gameOver ? 0.25 : 1}
              height={QUEUE_PANEL.CHILD}
              width={QUEUE_PANEL.CHILD}
              position={[
                QUEUE_PANEL.X + QUEUE_PANEL.CHILD * colIndex,
                queuePanelYCoord + QUEUE_PANEL.CHILD * rowIndex,
              ]}
              texture={textures.current.blank}
              tint={TETROMINO_STYLES[tetrominoName]}
              key={`queue-${spawnedIndex}-${colIndex}-${rowIndex}`}
            />
          );
        });
      });

      queuePanelYCoord += QUEUE_PANEL.HEIGHT + STAGE_SPACER;
    });

    setGameSprites(sprites);
  }, [gameStates, gameSettings]);

  return (
    <StageWrapper>
      <Container position={stagePosition}>
        <BorderGraphics />
        {gameSprites}
        {clearedLines}
      </Container>
      {gameSettings.performanceDisplay ? <PerformanceTracker /> : null}
    </StageWrapper>
  );
}
