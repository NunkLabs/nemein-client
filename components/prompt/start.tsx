import { useState } from "react";

import styles from "../../styles/start.module.css";

type props = {
  startAnimation: () => void;
};

export const StartPrompt = ({ startAnimation }: props) => {
  const [animate, setAnimate] = useState(false);

  return (
    <div
      className={`${styles.outer} ${styles[animate ? "transform-outer" : ""]}`}
      onAnimationStart={startAnimation}
    >
      {animate ? null : <p className={styles.logo}>TetriBASS</p>}
      <div
        className={`${styles.inner} ${
          styles[animate ? "transform-inner" : ""]
        }`}
      >
        {animate ? null : (
          <button
            className={`${styles.start} button button-light`}
            onClick={() => setAnimate(true)}
          >
            Play
          </button>
        )}
      </div>
    </div>
  );
};
