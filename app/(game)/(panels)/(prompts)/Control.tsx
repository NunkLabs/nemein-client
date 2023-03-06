import styles from "./Control.module.css";

type props = {
  isOver: boolean;
  restartGame: () => void;
};

export default function ControlPrompt({ isOver, restartGame }: props) {
  return (
    <div className={styles.control}>
      <p className={"font-bold text-slate-100 text-3xl"}>
        {isOver ? "Game Over" : "Settings"}
      </p>
      <button className={`button button-light h-8 w-40`} onClick={restartGame}>
        {isOver ? "New Game" : "Restart"}
      </button>
    </div>
  );
}
