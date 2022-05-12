import { useEffect, useState } from "react";

import styles from "../../styles/countdown.module.css";

type props = {
  startGame: () => void;
};

export const CountdownPrompt = ({ startGame }: props) => {
  const [remainingTime, setRemainingTime] = useState(3);

  useEffect(() => {
    let interval: NodeJS.Timer | null = null;

    if (remainingTime) {
      interval = setInterval(() => {
        setRemainingTime(remainingTime => remainingTime - 1);
      }, 1000);
    } else {
      startGame();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    }
  });

  return (
    <div className={styles.countdown}>
      <p>{remainingTime}</p>
    </div>
  );
};
