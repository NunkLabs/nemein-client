import { useEffect, useState } from "react";

import { fieldToJsxElement } from "utils/GameUtils";

import ControlPrompt from "./(prompts)/Control";
import styles from "./Main.module.css";

type props = {
  isReady: boolean;
  isActive: boolean;
  isOver: boolean;
  gameStates: ClassicStates | NemeinStates | null;
  restartGame: () => void;
};

const DEFAULT_BOARD_HEIGHT = 20;
const DEFAULT_BOARD_WIDTH = 10;

export default function MainPanel({
  isReady,
  isActive,
  isOver,
  gameStates,
  restartGame,
}: props) {
  const [game, setGame] = useState<number[][]>([]);

  useEffect(() => {
    if (!gameStates) return;

    /* Prepare an HTML element for the main game board */
    const renderField: number[][] = [];

    for (let y = 0; y < DEFAULT_BOARD_HEIGHT; y += 1) {
      const row = [];

      for (let x = 0; x < DEFAULT_BOARD_WIDTH; x += 1) {
        const col = gameStates.field[x].colArr[y];

        row.push(typeof col === "number" ? col : col.type);
      }

      renderField.push(row);
    }

    setGame(renderField);
  }, [gameStates]);

  return (
    <div className={styles.main}>
      {isReady && !isActive ? (
        <ControlPrompt isOver={isOver} restartGame={restartGame} />
      ) : null}
      <div>{fieldToJsxElement(game, gameStates?.gameOver)}</div>
    </div>
  );
}
