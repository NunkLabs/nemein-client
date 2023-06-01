import "./Control.css";

type ControlProps = {
  isOver: boolean;
  restartGame: () => void;
};

export default function ControlPrompt({ isOver, restartGame }: ControlProps) {
  return (
    <div className={"control"}>
      <p className={"font-bold text-slate-100 text-3xl"}>
        {isOver ? "Game Over" : "Settings"}
      </p>
      <button className={`button button-light h-8 w-40`} onClick={restartGame}>
        {isOver ? "New Game" : "Restart"}
      </button>
    </div>
  );
}
