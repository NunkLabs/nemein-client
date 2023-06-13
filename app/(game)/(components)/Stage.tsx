import { Container, Graphics } from "@pixi/react";
import { useContext, useEffect, useState } from "react";

import { GameContext } from "../Game";
import { GAME_PANEL, drawPanels, getGameContainers } from "./Utils";
import StageWrapper from "./ContextBridge";
import ClearedBlock from "./ClearedBlock";
import PerformanceTracker from "./PerformanceTracker";

const MAX_CLEARED_BLOCKS = 200;
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
  const [gameContainers, setGameContainers] = useState<JSX.Element[]>([]);
  const [clearedBlocks, setClearedBlocks] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!gameStates) return;

    const containers = getGameContainers(gameStates);

    setGameContainers(containers);

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
        <Graphics draw={drawPanels} />
        {gameContainers}
        {gameSettings.isClassic ? null : clearedBlocks}
      </Container>
      {gameSettings.performanceDisplay ? <PerformanceTracker /> : null}
    </StageWrapper>
  );
}
