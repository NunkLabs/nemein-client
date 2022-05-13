import styles from "../../styles/control.module.css";

type props = {
  gameOver: boolean;
  startCountdown: (restart: boolean) => void;
};

export const ControlPrompt = ({ gameOver, startCountdown }: props) => {
  return (
    <div className={styles.control}>
      <p className="text-slate-100 text-3xl font-bold">
        {gameOver ? "Game Over" : "Paused"}
      </p>
      {!gameOver ? (
        <button
          className={`button button-light h-12 w-52`}
          onClick={() => startCountdown(false)}
        >
          Resume
        </button>
      ) : null}
      <button
        className={`button button-light h-12 w-52`}
        onClick={() => startCountdown(true)}
      >
        {gameOver ? "New Game" : "Restart"}
      </button>
    </div>
  );
};
