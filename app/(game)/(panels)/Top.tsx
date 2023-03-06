import { useEffect, useState } from "react";

import styles from "./Top.module.css";

type props = {
  gameStates: ClassicStates | NemeinStates | null;
};

export default function TopPanel({ gameStates }: props) {
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (!gameStates) return;

    setLevel(gameStates.level);
    setScore(gameStates.score);
  }, [gameStates]);

  return (
    <div className={styles.top}>
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
}
