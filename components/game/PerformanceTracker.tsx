import { Container, useTick } from "@pixi/react";

import { useGameStore } from "libs/Store";

export default function PerformanceTracker() {
  const updateGamePerformance = useGameStore(
    (state) => state.updateGamePerformance,
  );

  useTick((delta, ticker) => {
    updateGamePerformance({
      frameRate: Math.floor(ticker.FPS),
      frameTime: parseFloat(ticker.deltaMS.toFixed(2)),
    });
  });

  return <Container />;
}
