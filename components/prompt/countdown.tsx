import { useEffect, useState } from "react";

import {
  DEFAULT_MAX_COUNTDOWN,
  DEFAULT_COUNTDOWN_INTERVAL,
} from "constants/tetris";
import styles from "../../styles/countdown.module.css";

type props = {
  startGame: () => void;
};

export const CountdownPrompt = ({ startGame }: props) => {
  const [remainingTime, setRemainingTime] = useState(DEFAULT_MAX_COUNTDOWN);

  useEffect(() => {
    let interval: NodeJS.Timer | null = null;

    if (remainingTime) {
      interval = setInterval(() => {
        setRemainingTime((remainingTime) => remainingTime - 1);
      }, DEFAULT_COUNTDOWN_INTERVAL);
    } else {
      startGame();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  });

  return (
    <div className={styles.countdown}>
      <p>{remainingTime}</p>
    </div>
  );
};
