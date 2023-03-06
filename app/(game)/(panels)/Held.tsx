import { useEffect, useState } from "react";

import { fieldToJsxElement } from "utils/GameUtils";

import { RENDER_TETROMINOS_ARR } from "constants/Game";

import styles from "./Held.module.css";

type props = {
  gameStates: ClassicStates | NemeinStates | null;
};

export default function HeldPanel({ gameStates }: props) {
  const [held, setHeld] = useState<number[][]>(RENDER_TETROMINOS_ARR[0]);

  useEffect(() => {
    if (!gameStates) return;

    setHeld(RENDER_TETROMINOS_ARR[gameStates.heldTetromino]);
  }, [gameStates]);

  return (
    <div className={styles.held}>
      {fieldToJsxElement(held, gameStates?.gameOver)}
    </div>
  );
}
