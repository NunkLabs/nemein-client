import { useEffect, useState } from "react";

import styles from "styles/components/game/Top.module.css";

type props = {
  isAnimated: boolean;
  gameState: TetrisState | null;
};

export const TopPanel = ({ isAnimated, gameState }: props) => {
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (!gameState) return;

    setLevel(gameState.level);
    setScore(gameState.score);
  }, [gameState]);

  return (
    <div
      className={`${styles.info} ${styles[isAnimated ? "transform-info" : ""]}`}
    >
      <div className="text-slate-100 text-xl">
        <p className="font-bold">LEVEL</p>
        <p className="font-medium">{level}</p>
      </div>
      <div className="text-slate-100 text-xl">
        <p className="font-bold">SCORE</p>
        <p className="font-medium">{score}</p>
      </div>
    </div>
  );
};
