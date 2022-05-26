import { useEffect, useState } from "react";

import { fieldToJsxElement } from "utils/TetrisUtils";

import { RENDER_TETROMINOS_ARR, TetrominoType } from "constants/Tetris";

import styles from "styles/components/game/Queue.module.css";

type props = {
  isAnimated: boolean;
  gameState: TetrisState | null;
};

const MAX_SPAWNED_FIELDS = 6;

export const QueuePanel = ({ isAnimated, gameState }: props) => {
  const [queue, setQueue] = useState<JSX.Element[]>(
    Array(MAX_SPAWNED_FIELDS)
      .fill(<div className={styles.next} />)
      .map((_, index) => <div className={styles.next} key={`next-${index}`} />)
  );

  useEffect(() => {
    if (!gameState) return;

    /* Prepare HTML elements for the tetromino queue */
    const spawnedFieldsRender: JSX.Element[][] = [];

    gameState.spawnedTetrominos.forEach((tetromino: TetrominoType) => {
      const spawnedFieldRender = fieldToJsxElement(
        RENDER_TETROMINOS_ARR[tetromino],
        gameState.gameOver,
        false,
        true
      );

      spawnedFieldsRender.push(spawnedFieldRender);
    });

    setQueue(
      spawnedFieldsRender.map((tetromino, index) => (
        <div className={styles.next} key={`next-${index}`}>
          {tetromino}
        </div>
      ))
    );
  }, [gameState]);

  return (
    <div
      className={`
        ${styles.queue} ${styles[isAnimated ? "transform-queue" : ""]}
      `}
    >
      {queue}
    </div>
  );
};
