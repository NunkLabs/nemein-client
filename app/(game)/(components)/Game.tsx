import { Container, Graphics, Stage } from "@pixi/react";
import { useEffect, useState, useRef } from "react";

import {
  GAME_PANEL,
  STAGE_SIZE,
  ClassicStates,
  NemeinStates,
  drawPanels,
  getGameRender,
} from "./Utils";
import ClearedBlock from "./ClearedBlock";
import PerfTracker from "./PerfTracker";

export type PowerPreference = "default" | "high-performance" | "low-power";

export type GameOptions = {
  isClassic: boolean;
  antialias: boolean;
  powerPreference: PowerPreference;
  performanceDisplay: boolean;
  screenShake: boolean;
};

type GameProps = {
  gameStates: ClassicStates | NemeinStates | null;
  gameOptions: GameOptions;
  setPerformanceInfo: (info: { fps: number; frameTime: number }) => void;
};

const MAX_CLEARED_BLOCKS = 200;
const SCREEN_SHAKE_INTERVAL_MS = 10;
const SCREEN_SHAKE_OFFSETS: [number, number][] = [
  [0, 0],
  [-10, -10],
  [10, 10],
  [0, 0],
];

export default function Game({
  gameStates,
  gameOptions,
  setPerformanceInfo,
}: GameProps) {
  const devicePixelRatio = useRef<number | undefined>(undefined);

  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [gameRender, setGameRender] = useState<JSX.Element[]>([]);
  const [clearedBlocks, setClearedBlocks] = useState<JSX.Element[]>([]);

  useEffect(() => {
    devicePixelRatio.current = window.devicePixelRatio;

    if (!gameStates) return;

    const render = getGameRender(gameStates);

    setGameRender(render);

    if ("clearRecordsArr" in gameStates && gameStates.clearRecordsArr.length) {
      const timestamp = Date.now();

      gameStates.clearRecordsArr.forEach(({ idx: rowIndex, lineTypeArr }) => {
        const nextClearedBlocks = lineTypeArr.map((type, colIndex) => (
          <ClearedBlock
            type={type}
            initialXDisplacement={GAME_PANEL.X + GAME_PANEL.CHILD * colIndex}
            initialYDisplacement={GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex}
            key={`cleared-${colIndex}-${rowIndex}}-${timestamp}`}
          />
        ));

        setClearedBlocks((clearedBlocks) => {
          const newClearedBlocks = clearedBlocks.concat(nextClearedBlocks);

          /* Detaches older blocks if max cleared blocks is reached */
          return newClearedBlocks.length > MAX_CLEARED_BLOCKS
            ? newClearedBlocks.splice(
                newClearedBlocks.length - MAX_CLEARED_BLOCKS,
                MAX_CLEARED_BLOCKS
              )
            : newClearedBlocks;
        });
      });

      if (!gameOptions.screenShake) return;

      let offsetIterationIndex = 0;

      const screenShakeInterval = setInterval(() => {
        setPosition(SCREEN_SHAKE_OFFSETS[offsetIterationIndex]);

        offsetIterationIndex += 1;

        if (offsetIterationIndex < SCREEN_SHAKE_OFFSETS.length) return;

        clearInterval(screenShakeInterval);
      }, SCREEN_SHAKE_INTERVAL_MS);
    }
  }, [gameStates, gameOptions]);

  return (
    <Stage
      className="opacity-0"
      id="game-stage"
      height={STAGE_SIZE}
      width={STAGE_SIZE}
      options={{
        hello: true, // Logs Pixi version & renderer type
        antialias: gameOptions.antialias,
        backgroundAlpha: 0,
        powerPreference: gameOptions.powerPreference,
        resolution: devicePixelRatio.current,
      }}
    >
      <Container position={position}>
        <Graphics draw={drawPanels}></Graphics>
        {gameRender}
        {clearedBlocks}
      </Container>
      {gameOptions.performanceDisplay ? (
        <PerfTracker setPerformanceInfo={setPerformanceInfo} />
      ) : null}
    </Stage>
  );
}
