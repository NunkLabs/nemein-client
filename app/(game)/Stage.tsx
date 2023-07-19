import { useEffect, useRef, useState } from "react";
import { Container, Sprite, Stage as PixiStage } from "@pixi/react";
import { Texture } from "pixi.js";

import { DmgType, TetrominoType, useGameStore } from "libs/Store";
import {
  DAMAGE_TYPE_STYLES,
  HOLD_PANEL,
  GAME_PANEL,
  QUEUE_PANEL,
  STAGE_SIZE,
  STAGE_SPACER,
  TETROMINO_STYLES,
  TETROMINOS_ARR,
} from "./Misc";
import BorderGraphics from "./BorderGraphics";
import ClearedSprite from "./ClearedSprite";
import DamageSprite from "./DamageSprite";
import PerformanceTracker from "./PerformanceTracker";

const SCREEN_SHAKE_INTERVAL_MS = 10;
const SCREEN_SHAKE_OFFSETS: [number, number][] = [
  [0, 0],
  [-10, -10],
  [10, 10],
  [0, 0],
];

export default function Stage({ startGame }: { startGame: () => void }) {
  const gameOptions = useGameStore((state) => state.gameOptions);
  const gameStates = useGameStore((state) => state.gameStates);

  const blockStyles = useRef({
    texture: {
      blank: Texture.from("/textures/blank.svg"),
    },
    tint: TETROMINO_STYLES,
  });
  const blocksCleared = useRef<number>(0);
  const linesCleared = useRef<number>(0);

  const [stagePosition, setStagePosition] = useState<[number, number]>([0, 0]);
  const [gameSprites, setGameSprites] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!gameStates) {
      startGame();

      return;
    }

    const { texture, tint } = blockStyles.current;

    const sprites: JSX.Element[] = [];

    /* Constructs the main game sprites */
    if (gameStates.type === "nemein") {
      gameStates.gameField.forEach((col, colIndex) => {
        col.colArr.forEach((row, rowIndex) => {
          const tetrominoName = TetrominoType[row.type];

          sprites.push(
            gameStates.gameOver ? (
              <ClearedSprite
                isBlank={tetrominoName === "Blank"}
                tint={tint[tetrominoName]}
                x={GAME_PANEL.X + GAME_PANEL.CHILD * colIndex}
                y={GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex}
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
                texture={texture.blank}
                tint={tint[tetrominoName]}
                key={`game-${colIndex}-${rowIndex}`}
              />
            )
          );
        });
      });

      /* Handles line clear on Nemein game mode */
      if (gameStates.clearRecordsArr.length) {
        gameStates.clearRecordsArr.map((clearRecord) => {
          const { idx: rowIndex, lineTypeArr, dmgDealt } = clearRecord;

          lineTypeArr.forEach((type, colIndex) => {
            blocksCleared.current += 1;

            sprites.push(
              <ClearedSprite
                tint={tint[TetrominoType[type]]}
                x={GAME_PANEL.X + GAME_PANEL.CHILD * colIndex}
                y={GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex}
                key={`cleared-block-${blocksCleared.current}`}
              />
            );
          });

          if (lineTypeArr.includes(TetrominoType.Grey)) return;

          linesCleared.current += 1;

          sprites.push(
            <DamageSprite
              dmgDealt={clearRecord.dmgDealt.value.toString()}
              dmgIndex={rowIndex}
              wasCrit={clearRecord.wasCrit}
              color={DAMAGE_TYPE_STYLES[DmgType[dmgDealt.dominantDmgType]]}
              x={GAME_PANEL.X}
              y={GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex}
              key={`damage-number-${linesCleared.current}`}
            />
          );
        });

        if (!gameOptions.stageShake) return;

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
            <Sprite
              alpha={row === TetrominoType.Ghost ? 0.25 : 1}
              height={GAME_PANEL.CHILD}
              width={GAME_PANEL.CHILD}
              position={[
                GAME_PANEL.X + GAME_PANEL.CHILD * colIndex,
                GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex,
              ]}
              texture={texture.blank}
              tint={tint[tetrominoName]}
              key={`game-${colIndex}-${rowIndex}`}
            />
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
            texture={texture.blank}
            tint={tint[tetrominoName]}
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
              texture={texture.blank}
              tint={tint[tetrominoName]}
              key={`queue-${spawnedIndex}-${colIndex}-${rowIndex}`}
            />
          );
        });
      });

      queuePanelYCoord += QUEUE_PANEL.HEIGHT + STAGE_SPACER;
    });

    setGameSprites(sprites);
  }, [gameStates, gameOptions, startGame]);

  return (
    <PixiStage
      height={STAGE_SIZE}
      width={STAGE_SIZE}
      options={{
        hello: true, // Logs Pixi version & renderer type
        antialias: gameOptions.antialias,
        backgroundAlpha: 0,
        powerPreference: gameOptions.powerPreference,
      }}
    >
      <Container position={stagePosition}>
        <BorderGraphics />
        {gameSprites}
      </Container>
      {gameOptions.performanceDisplay && <PerformanceTracker />}
    </PixiStage>
  );
}
