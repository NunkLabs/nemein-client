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
  const isPaused = useRef(false);
  const isOver = useRef(false);

  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  const [over, setOver] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [countdown, setCountdown] = useState(false);

  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  const [gameField, setGameField] = useState<number[][]>([]);
  const [heldField, setHeldField] = useState<number[][]>(
    TetrisConsts.RENDER_TETROMINOS_ARR[0]
  );
  const [spawnedFields, setSpawnedFields] = useState<JSX.Element[]>(
    Array(TetrisConsts.MAX_SPAWNED_FIELDS)  
      .fill(<div className={styles.next} />)
      .map((_, index) => <div className={styles.next} key={`next-${index}`} />)
  );

  const startAnimation = useCallback(() => setAnimate(true), []);
  const startCountdown = useCallback((restart: boolean) => {
    if (restart) {
      socket.current?.send("Restart");
    }

    setCountdown(true);
  }, []);
  const startGame = useCallback(() => {
    setCountdown(false);

    if (!ready) {
      setReady(true);
    }

    if (!active || over) {
      socket.current?.send("ToggleGame");
    }

    setActive(true);
    setOver(false);

    isOver.current = false;
    isPaused.current = false;
  }, [ready, active, over]);

  useEffect(() => {
    if (!ready) return;

    socket.current = new WebSocket("ws://localhost:8080");

    const handleKeydown = ({ key }: { key: string }) => {
      if (isOver.current) return;
    
      if (key === "Escape") {
        if (isPaused.current) {
          return startCountdown(false);
        }

        setActive(false);

        isPaused.current = true;

        return socket.current?.send("ToggleGame");
      }

      if (!VALID_KEYS.includes(key)) return;

      return socket.current?.send(key);
    };

    socket.current.onopen = () =>
      document.addEventListener("keydown", handleKeydown);

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.gameOver) {
        setOver(true)

        isOver.current = true;
      }

      setLevel(data.level);
      setScore(data.score);

      /* Prepare an HTML element for the main game board */
      const renderField: number[][] = [];

      for (let y = 0; y < TetrisConsts.DEFAULT_BOARD_HEIGHT; y += 1) {
        const row = [];

        for (let x = 0; x < TetrisConsts.DEFAULT_BOARD_WIDTH; x += 1) {
          row.push(data.field[x].colArr[y]);
        }

        renderField.push(row);
      }

      setGameField(renderField);

      /* Prepare an HTML element for the currently held tetromino */
      setHeldField(TetrisConsts.RENDER_TETROMINOS_ARR[data.heldTetromino]);

      /* Prepare HTML elements for the tetromino queue */
      const spawnedFieldsRender: JSX.Element[][] = [];

      data.spawnedTetrominos.forEach((tetromino: TetrisConsts.Tetromino) => {
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

    const currentSocket = socket.current;

    return () => {
      /* Clean up on component unmount */
      currentSocket.close();

      document.removeEventListener("keydown", handleKeydown);
    };
  }, [socket, ready, startCountdown]);

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
        {!ready ? <StartPrompt startAnimation={startAnimation} /> : null}
        {ready && (!active || over) && !countdown  ? (
          <ControlPrompt gameOver={over} startCountdown={startCountdown} />
        ) : null}
        {(!active || over) && countdown ? (
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
