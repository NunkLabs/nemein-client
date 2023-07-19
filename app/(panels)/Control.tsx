import { useGameStore } from "libs/Store";

export default function ControlPrompt({
  startGame,
}: {
  startGame: () => void;
}) {
  const gameStatus = useGameStore((state) => state.gameStatus);

  return (
    <div
      className="absolute left-1/2 top-1/2 z-[65] grid w-44 translate-x-[-50%]
        translate-y-[-50%] place-items-center gap-y-2 text-center"
      id="control-prompt"
    >
      <p className="text-3xl font-bold text-slate-100">
        {gameStatus === "ending" ? "Game Over" : "Paused"}
      </p>
      <button className="button button-light h-8 w-40" onClick={startGame}>
        Restart
      </button>
    </div>
  );
}
