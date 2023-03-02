import styles from "./Start.module.css";

type props = {
  isAnimated: boolean;
  startAnimation: () => void;
};

export default function StartPrompt({ isAnimated, startAnimation }: props) {
  return (
    <div className={styles.outer}>
      {isAnimated ? null : <p className={styles.logo}>TetriBASS</p>}
      <div
        className={`${styles.inner} ${
          styles[isAnimated ? "transform-inner" : ""]
        }`}
      >
        {isAnimated ? null : (
          <button
            className={`${styles.start} button button-light`}
            onClick={startAnimation}
          >
            Play
          </button>
        )}
      </div>
    </div>
  );
}
