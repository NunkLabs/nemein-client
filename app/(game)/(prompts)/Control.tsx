import "./Control.css";

type ControlProps = {
  isOver: boolean;
  restartGame: () => void;
};

export default function ControlPrompt({ isOver, restartGame }: ControlProps) {
  return (
    <div className={"control"}>
      <p className={"text-3xl font-bold text-slate-100"}>
        {isOver ? "Game Over" : "Settings"}
      </p>
      <button className={`button button-light h-8 w-40`} onClick={restartGame}>
        {isOver ? "New Game" : "Restart"}
      </button>
    </div>
  );
}
