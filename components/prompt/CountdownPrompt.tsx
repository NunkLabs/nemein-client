import { useEffect, useState } from "react";

import styles from "styles/components/prompt/Countdown.module.css";

type props = {
  startGame: () => void;
};

const DEFAULT_COUNTDOWN_INTERVAL = 1000;
const DEFAULT_MAX_COUNTDOWN = 3;

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
      if (!interval) return;

      clearInterval(interval);
    };
  });

  return (
    <div className={styles.countdown}>
      <p>{remainingTime}</p>
    </div>
  );
};
