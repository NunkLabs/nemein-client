import { useEffect, useState } from "react";

import { StartPrompt } from "components/prompt/StartPrompt";
import { ControlPrompt } from "components/prompt/ControlPrompt";
import { CountdownPrompt } from "components/prompt/CountdownPrompt";

import { fieldToJsxElement } from "utils/GameUtils";

import styles from "styles/components/game/Game.module.css";

type props = {
  isReady: boolean;
  isActive: boolean;
  isAnimated: boolean;
  isCountdown: boolean;
  isOver: boolean;
  gameStates: ClassicStates | NemeinStates | null;
  startAnimation: () => void;
  startCountdown: (restart?: boolean) => void;
  startGame: () => void;
};

const DEFAULT_BOARD_HEIGHT = 20;
const DEFAULT_BOARD_WIDTH = 10;

export const GamePanel = ({
  isReady,
  isActive,
  isAnimated,
  isCountdown,
  isOver,
  gameStates,
  startAnimation,
  startCountdown,
  startGame,
}: props) => {
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
    <div
      className={`${styles.game} ${styles[isAnimated ? "transform-game" : ""]}`}
      onAnimationEnd={() => startCountdown()}
    >
      {!isReady ? (
        <StartPrompt isAnimated={isAnimated} startAnimation={startAnimation} />
      ) : null}
      {isReady && !isActive && !isCountdown ? (
        <ControlPrompt isOver={isOver} startCountdown={startCountdown} />
      ) : null}
      {!isActive && isCountdown ? (
        <CountdownPrompt startGame={startGame} />
      ) : null}
      <div>{fieldToJsxElement(game, gameStates?.gameOver)}</div>
    </div>
  );
};
