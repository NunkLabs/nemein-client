import React, { useState } from "react";

import styles from "../../styles/start.module.css";

type props = {
  animationStart: () => void;
};

export const StartPrompt = ({ animationStart }: props) => {
  const [animate, setAnimate] = useState(false);

  return (
    <div
      className={`
        ${styles.outer} ${styles[animate ? "transform-outer-wrapper" : ""]}
      `}
      onAnimationStart={animationStart}
    >
      {animate ? null : <p className={styles.logo}>TetriBASS</p>}
      <div
        className={`
        ${styles.inner} ${styles[animate ? "transform-inner-wrapper" : ""]}
      `}
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
