import { useGameStore } from "libs/Store";

export default function PerformancePanel() {
  const gamePerformance = useGameStore((state) => state.gamePerformance);

  const { currentLatency, frameRate, frameTime } = gamePerformance;

  return (
    <div className="fixed bottom-[1%] left-1/2 translate-x-[-50%] translate-y-[-50%]">
      <p
        className="text-sm text-gray-900 dark:text-gray-50"
        key="performance-display"
      >
        latency: {currentLatency} ms • frame rate: {frameRate} fps • frame time:
        {frameTime} ms
      </p>
    </div>
  );
}
