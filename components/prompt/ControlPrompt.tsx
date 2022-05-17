import styles from "styles/components/prompt/Control.module.css";

type props = {
  isOver: boolean;
  startCountdown: (restart: boolean) => void;
};

export const ControlPrompt = ({ isOver, startCountdown }: props) => {
  return (
    <div className={styles.control}>
      <p className="text-slate-100 text-3xl font-bold">
        {isOver ? "Game Over" : "Paused"}
      </p>
      {!isOver ? (
        <button
          className={`button button-light h-10 w-44`}
          onClick={() => startCountdown(true)}
        >
          Resume
        </button>
      ) : null}
      <button
        className={`button button-light h-10 w-44`}
        onClick={() => startCountdown(true)}
      >
        {isOver ? "New Game" : "Restart"}
      </button>
    </div>
  );
};
