import { Container, useApp } from "@pixi/react";

type PerfTrackerProps = {
  setPerformanceInfo: (info: { fps: number; frameTime: number }) => void;
};

export default function PerfTracker({ setPerformanceInfo }: PerfTrackerProps) {
  const app = useApp();

  setPerformanceInfo({
    fps: Math.floor(app.ticker.FPS),
    frameTime: parseFloat(app.ticker.deltaMS.toFixed(2)),
  });

  return <Container />;
}
