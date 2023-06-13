import { Container, useApp } from "@pixi/react";
import { useContext } from "react";

import { GameContext } from "../Game";

export default function PerformanceTracker() {
  const { setPerformanceDetails } = useContext(GameContext);

  if (!setPerformanceDetails) {
    throw new Error("Set state action is nullish.");
  }

  const app = useApp();

  setPerformanceDetails({
    fps: Math.floor(app.ticker.FPS),
    frameTime: parseFloat(app.ticker.deltaMS.toFixed(2)),
  });

  return <Container />;
}
