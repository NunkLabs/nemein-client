import { Container, Graphics } from "@pixi/react";
import { useEffect, useState } from "react";

import {
  GAME_PANEL,
  ClassicStates,
  NemeinStates,
  drawPanels,
  getGameRender,
} from "./Utils";
import ClearedBlock from "./ClearedBlock";

type GameProps = {
  gameStates: ClassicStates | NemeinStates | null;
};

const SCREEN_SHAKE_INTERVAL_MS = 10;
const SCREEN_SHAKE_OFFSETS: [number, number][] = [
  [0, 0],
  [-10, -10],
  [10, 10],
  [0, 0],
];

export default function Game({ gameStates }: GameProps) {
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [gameRender, setGameRender] = useState<JSX.Element[]>([]);
  const [clearedBlocks, setClearedBlocks] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!gameStates) return;

    const render = getGameRender(gameStates);

    setGameRender(render);

    if ("clearRecordsArr" in gameStates && gameStates.clearRecordsArr.length) {
      const timestamp = Date.now();

      gameStates.clearRecordsArr.forEach(({ idx: rowIndex, lineTypeArr }) => {
        const newClearedBlocks = lineTypeArr.map((type, colIndex) => (
          <ClearedBlock
            type={type}
            initialXDisplacement={GAME_PANEL.X + GAME_PANEL.CHILD * colIndex}
            initialYDisplacement={GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex}
            key={`cleared-${colIndex}-${rowIndex}}-${timestamp}`}
          />
        ));

        setClearedBlocks((clearedBlocks) => [
          ...clearedBlocks,
          ...newClearedBlocks,
        ]);
      });

      let offsetIterationIndex = 0;

      const screenShakeInterval = setInterval(() => {
        setPosition(SCREEN_SHAKE_OFFSETS[offsetIterationIndex]);

        offsetIterationIndex += 1;

        if (offsetIterationIndex < SCREEN_SHAKE_OFFSETS.length) return;

        clearInterval(screenShakeInterval);
      }, SCREEN_SHAKE_INTERVAL_MS);
    }
  }, [gameStates]);

  return (
    <Container position={position}>
      <Graphics draw={drawPanels}></Graphics>
      {gameRender}
      {clearedBlocks}
    </Container>
  );
}
