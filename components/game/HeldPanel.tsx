import { useEffect, useState } from "react";

import { fieldToJsxElement } from "utils/GameUtils";

import { RENDER_TETROMINOS_ARR } from "constants/Game";

import styles from "styles/components/game/Held.module.css";

type props = {
  isAnimated: boolean;
  gameStates: ClassicStates | NemeinStates | null;
};

export const HeldPanel = ({ isAnimated, gameStates }: props) => {
  const [held, setHeld] = useState<number[][]>(RENDER_TETROMINOS_ARR[0]);

  useEffect(() => {
    if (!gameStates) return;

    setHeld(RENDER_TETROMINOS_ARR[gameStates.heldTetromino]);
  }, [gameStates]);

  return (
    <div
      className={`
        ${styles.held} ${styles[isAnimated ? "transform-held" : ""]}
      `}
    >
      {fieldToJsxElement(held, gameStates?.gameOver)}
    </div>
  );
};
