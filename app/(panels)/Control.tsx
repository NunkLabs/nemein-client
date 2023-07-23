import { useGameStore } from "libs/Store";
import { buttonVariants } from "components/ui/Button";

export default function ControlPanel({
  startGame,
  toggleGame,
}: {
  startGame: () => void;
  toggleGame: () => void;
}) {
  const gameStatus = useGameStore((state) => state.gameStatus);

  return (
    <div className="fixed left-1/2 top-1/2 flex w-44 translate-x-[-50%] translate-y-[-50%] flex-col place-items-center gap-y-2 text-center">
      <h1
        className="text-center text-3xl text-gray-900 dark:text-gray-50"
        key="control-panel-header"
      >
        {gameStatus === "ending" ? "Game Over" : "Paused"}
      </h1>
      <button
        className={buttonVariants({ variant: "primary" })}
        key="control-panel-restart"
        onClick={startGame}
        type="button"
      >
        Restart
      </button>
      {gameStatus === "pausing" && (
        <button
          className={buttonVariants({ variant: "primary" })}
          key="control-panel-toggle"
          onClick={toggleGame}
          type="button"
        >
          Resume
        </button>
      )}
    </div>
  );
}
