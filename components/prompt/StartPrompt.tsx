import { useState } from "react";

import styles from "styles/components/Start.module.css";

type props = {
  animate: boolean;
  startAnimation: () => void;
};

export const StartPrompt = ({ animate, startAnimation }: props) => {
  return (
    <div
      className={`${styles.outer} ${styles[animate ? "transform-outer" : ""]}`}
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
            onClick={startAnimation}
          >
            Play
          </button>
        )}
      </div>
    </div>
  );
};
