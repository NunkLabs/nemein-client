import { useEffect, useState } from "react";

import { fieldToJsxElement } from "utils/GameUtils";

import { RENDER_TETROMINOS_ARR, TetrominoType } from "constants/Game";

import styles from "./Queue.module.css";

type props = {
  isAnimated: boolean;
  gameStates: ClassicStates | NemeinStates | null;
};

const MAX_SPAWNED_FIELDS = 6;

export default function QueuePanel({ isAnimated, gameStates }: props) {
  const [queue, setQueue] = useState<JSX.Element[]>(
    Array(MAX_SPAWNED_FIELDS)
      .fill(<div className={styles.next} />)
      .map((_, index) => <div className={styles.next} key={`next-${index}`} />)
  );

  useEffect(() => {
    if (!gameStates) return;

    /* Prepare HTML elements for the tetromino queue */
    const spawnedFieldsRender: JSX.Element[][] = [];

    gameStates.spawnedTetrominos.forEach((tetromino: TetrominoType) => {
      const spawnedFieldRender = fieldToJsxElement(
        RENDER_TETROMINOS_ARR[tetromino],
        gameStates.gameOver,
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
  }, [gameStates]);

  return (
    <div
      className={`
        ${styles.queue} ${styles[isAnimated ? "transform-queue" : ""]}
      `}
    >
      {queue}
    </div>
  );
}
