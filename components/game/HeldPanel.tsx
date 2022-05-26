import { useEffect, useState } from "react";

import { fieldToJsxElement } from "utils/TetrisUtils";

import { RENDER_TETROMINOS_ARR } from "constants/Tetris";

import styles from "styles/components/game/Held.module.css";

type props = {
  isAnimated: boolean;
  gameState: TetrisState | null;
};

export const HeldPanel = ({ isAnimated, gameState }: props) => {
  const [held, setHeld] = useState<number[][]>(RENDER_TETROMINOS_ARR[0]);

  useEffect(() => {
    if (!gameState) return;

    setHeld(RENDER_TETROMINOS_ARR[gameState.heldTetromino]);
  }, [gameState]);

  return (
    <div
      className={`
        ${styles.held} ${styles[isAnimated ? "transform-held" : ""]}
      `}
    >
      {fieldToJsxElement(held, gameState?.gameOver)}
    </div>
  );
};
