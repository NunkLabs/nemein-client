import { useCallback, useEffect, useState, useRef } from "react";

import { ControlPrompt, CountdownPrompt, StartPrompt } from "components";
import * as TetrisConsts from "constants/tetris";
import styles from "../../styles/tetris.module.css";

const VALID_KEYS = [
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "c",
  " ",
];

/**
 * @brief: fieldToJsxElement: Convert a field of coords to a JSX element for
 * render
 * @param  {number[][]}     field  Field to render
 * @param  {boolean}        grid   Toggle for the game grid
 * @return {JSX.Element[]}         JSX element of field
 */
const fieldToJsxElement = (
  field: number[][],
  grid: boolean = false
): JSX.Element[] => {
  const retField: JSX.Element[] = [];

  field.forEach((col, colIndex) => {
    const rows = col.map((row, rowIndex) => (
      <div
        className={`
          ${styles.row} ${styles[grid ? `row-wgrid-${row}` : `row-${row}`]}
        `}
        key={`row-${rowIndex}`}
      />
    ));

    retField.push(
      <div className="flex" key={`col-${colIndex}`}>
        {rows}
      </div>
    );
  });

  return retField;
};

export const Tetris = () => {
  const socket = useRef<WebSocket | null>(null);
  const isActive = useRef<boolean>(false);
  const isOver = useRef<boolean>(false);

  const [ready, setReady] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [animate, setAnimate] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<boolean>(false);

  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);

  const [gameField, setGameField] = useState<number[][]>([]);
  const [heldField, setHeldField] = useState<number[][]>(
    TetrisConsts.RENDER_TETROMINOS_ARR[0]
  );
  const [spawnedFields, setSpawnedFields] = useState<JSX.Element[]>(
    Array(TetrisConsts.MAX_SPAWNED_FIELDS)
      .fill(<div className={styles.next} />)
      .map((_, index) => <div className={styles.next} key={`next-${index}`} />)
  );

  const startCountdown = (restart: boolean) => {
    if (restart) {
      socket.current?.send("Restart");
    }

    setCountdown(true);
  };

  const startGame = () => {
    setCountdown(false);

    if (!ready) {
      setReady(true);
    }

    if (!active) {
      socket.current?.send("ToggleGame");
    }

    setActive(true);

    isActive.current = true;
    isOver.current = false;
  };

  const handleKeydown = useCallback(({ key }: { key: string }) => {
    if (isOver.current) return;

    if (key === "Escape") {
      if (!isActive.current) {
        return startCountdown(false);
      }

      setActive(false);

      isActive.current = false;

      return socket.current?.send("ToggleGame");
    }

    if (!isActive.current || !VALID_KEYS.includes(key)) return;

    return socket.current?.send(key);
  }, []);

  const handleMessageEvent = (data: MessageEvent["data"]) => {
    const gameState = JSON.parse(data);

    if (gameState.gameOver) {
      setActive(false);

      isActive.current = false;
      isOver.current = true;
    }

    setLevel(gameState.level);
    setScore(gameState.score);

    /* Prepare an HTML element for the main game board */
    const renderField: number[][] = [];

    for (let y = 0; y < TetrisConsts.DEFAULT_BOARD_HEIGHT; y += 1) {
      const row = [];

      for (let x = 0; x < TetrisConsts.DEFAULT_BOARD_WIDTH; x += 1) {
        row.push(gameState.field[x].colArr[y]);
      }

      renderField.push(row);
    }

    setGameField(renderField);

    /* Prepare an HTML element for the currently held tetromino */
    setHeldField(TetrisConsts.RENDER_TETROMINOS_ARR[gameState.heldTetromino]);

    /* Prepare HTML elements for the tetromino queue */
    const spawnedFieldsRender: JSX.Element[][] = [];

    gameState.spawnedTetrominos.forEach((tetromino: TetrisConsts.Tetromino) => {
      const spawnedFieldRender = fieldToJsxElement(
        TetrisConsts.RENDER_TETROMINOS_ARR[tetromino]
      );

      spawnedFieldsRender.push(spawnedFieldRender);
    });

    const spawnedTetrominosFields = spawnedFieldsRender.map(
      (tetromino, index) => (
        <div className={styles.next} key={`next-${index}`}>
          {tetromino}
        </div>
      )
    );

    setSpawnedFields(spawnedTetrominosFields);
  };

  useEffect(() => {
    if (!ready) return;

    socket.current = new WebSocket("ws://localhost:8080");

    socket.current.onopen = () =>
      document.addEventListener("keydown", handleKeydown);

    socket.current.onmessage = ({ data }) => handleMessageEvent(data);

    const currentSocket = socket.current;

    return () => {
      /* Clean up on component unmount */
      currentSocket.close();

      document.removeEventListener("keydown", handleKeydown);
    };
  }, [socket, ready, handleKeydown]);

  return (
    <div className="grid place-items-center px-5 py-5">
      <div
        className={`${styles.info} ${styles[animate ? "transform-info" : ""]}`}
        onAnimationEnd={() => startCountdown(false)}
      >
        <div>
          <p>LEVEL</p>
          <p>{level}</p>
        </div>
        <div>
          <p>SCORE</p>
          <p>{score}</p>
        </div>
      </div>
      <div className="relative">
        {!ready ? (
          <StartPrompt startAnimation={() => setAnimate(true)} />
        ) : null}
        {ready && !active && !countdown ? (
          <ControlPrompt
            isOver={!active && isOver.current}
            startCountdown={startCountdown}
          />
        ) : null}
        {!active && countdown ? (
          <CountdownPrompt startGame={startGame} />
        ) : null}
        <div className="flex gap-x-3">
          <div
            className={`
              ${styles.held} ${styles[animate ? "transform-held" : ""]}
            `}
          >
            {fieldToJsxElement(heldField)}
          </div>
          <div
            className={`
              ${styles.game} ${styles[animate ? "transform-game" : ""]}
            `}
          >
            {fieldToJsxElement(gameField)}
          </div>
          <div
            className={`
              ${styles.queue} ${styles[animate ? "transform-queue" : ""]}
            `}
          >
            {spawnedFields}
          </div>
        </div>
      </div>
    </div>
  );
};
