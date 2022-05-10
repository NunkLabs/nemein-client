import React, { useState } from 'react';

import styles from '../../styles/start.module.css'

type props = {
  setInit: () => void;
};

export const StartPrompt = ({ setInit }: props) => {
  const [animate, setAnimate] = useState(false);

  return (
    <div
      className={`
        ${styles.outer} ${styles[animate ? 'transform-outer-wrapper' : '']}
      `}
      onAnimationEnd={setInit}
    >
      {animate
        ? null
        : <p className={styles.logo}>TetriBASS</p>
      }
      <div className={`
        ${styles.inner} ${styles[animate ? 'transform-inner-wrapper' : '']}
      `}>
        {animate
          ? null
          : <button
            className={`${styles.start} button button-light`}
            onClick={() => setAnimate(true)}
          >
            Play
          </button>
        }
      </div>
    </div>
  )
}
