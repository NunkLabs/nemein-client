import { useEffect, useState, useRef } from "react";
import anime from "animejs/lib/anime.es";

import { Opcodes, GameSocket } from "libs/Socket";
import { TetrominoType, RENDER_TETROMINOS_ARR } from "constants/Game";
import ControlPrompt from "./(prompts)/Control";
import fieldToJsxElement from "utils/GameUtils";

import "./Game.css";

const VALID_KEYS = [
  /* Left */
  "0",
  "ArrowLeft",

  /* Right */
  "6",
  "ArrowRight",

  /* Down */
  "2",
  "ArrowDown",

  /* Clockwise rotate */
  "1",
  "5",
  "9",
  "x",
  "ArrowUp",

  /* Counterclockwise rotate */
  "3",
  "7",
  "z",
  "Control",

  /* Hold */
  "0",
  "c",
  "Shift",

  /* Hard drop */
  "8",
  " ",
];

const DEFAULT_BOARD_HEIGHT = 20;
const DEFAULT_BOARD_WIDTH = 10;
const MAX_SPAWNED_FIELDS = 6;

export default function Game() {
  const socket = useRef<GameSocket | null>(null);
  const isOver = useRef<boolean>(false);

  const [ready, setReady] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);

  const [gameData, setGameData] = useState<{
    level: number;
    score: number;
    main: JSX.Element[];
    held: JSX.Element[];
    queue: JSX.Element[];
  }>({
    level: 1,
    score: 0,
    main: [],
    held: fieldToJsxElement(RENDER_TETROMINOS_ARR[0]),
    queue: Array(MAX_SPAWNED_FIELDS)
      .fill(<div className="next" />)
      .map((_, index) => <div className="next" key={`next-${index}`} />),
  });

  const startGame = () => {
    if (!ready) {
      setReady(true);
    }

    if (!active) {
      socket.current?.send({
        op: Opcodes.READY,
        data: process.env.NODE_ENV === "development" ? "nemein" : "classic",
      });

      setActive(true);
    }

    isOver.current = false;
  };

  const restartGame = () => {
    socket.current?.send({ op: Opcodes.RESTART });

    startGame();
  };

  const handleKeydown = ({ key }: { key: string }) => {
    if (isOver.current || !VALID_KEYS.includes(key)) return;

    socket.current?.send({
      op: Opcodes.INPUT,
      data: key,
    });
  };

  useEffect(() => {
    socket.current = new GameSocket();

    socket.current
      .on("progress", (data) => {
        const initTimeline = anime.timeline({
          easing: "easeInOutCubic",
        });

        initTimeline
          .add({
            targets: ".init-progress",
            value: data.percent,
          })
          .add({
            targets: [".init-progress", ".animation-wrapper "],
            height: 32,
          })
          .add({
            targets: [".init-progress"],
            duration: 500,
            opacity: 0,
            zIndex: 0,
          })
          .add({
            targets: [".start-button"],
            duration: 100,
            opacity: 1,
            zIndex: 50,
          });
      })
      .on("message", (message) => {
        switch (message.op) {
          case Opcodes.READY: {
            document.addEventListener("keydown", handleKeydown);

            break;
          }

          case Opcodes.DATA: {
            const gameStates = message.data;

            const { gameField, heldTetromino, spawnedTetrominos, gameOver } =
              gameStates;

            /* Prepare an array to render the main game panel */
            const gameRender: number[][] = [];

            for (let y = 0; y < DEFAULT_BOARD_HEIGHT; y += 1) {
              const row = [];

              for (let x = 0; x < DEFAULT_BOARD_WIDTH; x += 1) {
                const col = gameField[x].colArr[y];

                row.push(typeof col === "number" ? col : col.type);
              }

              gameRender.push(row);
            }

            /* Prepare an array to render the queue panel */
            const spawnedRender: JSX.Element[][] = [];

            spawnedTetrominos.forEach((tetromino: TetrominoType) => {
              const spawnedFieldRender = fieldToJsxElement(
                RENDER_TETROMINOS_ARR[tetromino],
                gameStates.gameOver,
                true
              );

              spawnedRender.push(spawnedFieldRender);
            });

            setGameData({
              level: gameStates.level,
              score: gameStates.score,
              main: fieldToJsxElement(gameRender, gameStates.gameOver),
              held: fieldToJsxElement(
                RENDER_TETROMINOS_ARR[heldTetromino],
                gameStates.gameOver
              ),
              queue: spawnedRender.map((tetromino, index) => (
                <div className="next" key={`next-${index}`}>
                  {tetromino}
                </div>
              )),
            });

            if (gameStates.gameOver) {
              setActive(false);

              isOver.current = true;
            }

            break;
          }

          default:
        }
      });

    const currentSocket = socket.current;

    return () => {
      /* Clean up on component unmount */
      document.removeEventListener("keydown", handleKeydown);

      currentSocket.destroy();
    };
  }, []);

  return (
    <div className="grid h-screen place-items-center px-5 py-5">
      {ready ? null : <div className="animation-wrapper" />}
      <div className="game-wrapper">
        <div className="top">
          <div className="text-slate-100 text-xl">
            <p className="font-bold">LEVEL</p>
            <p className="font-medium">{gameData.level}</p>
          </div>
          <div className="text-slate-100 text-xl">
            <p className="font-bold">SCORE</p>
            <p className="font-medium">{gameData.score}</p>
          </div>
        </div>
        <div className="flex gap-x-2">
          <div className="held">{gameData.held}</div>
          <div className="main">
            {ready && !active ? (
              <ControlPrompt
                isOver={isOver.current}
                restartGame={restartGame}
              />
            ) : null}
            <div>{gameData.main}</div>
          </div>
          <div className="queue">{gameData.queue}</div>
        </div>
      </div>
      {ready ? null : (
        <button
          className={"start-button button button-light"}
          onClick={() => {
            const startTimeline = anime.timeline({
              easing: "easeInOutCubic",
              duration: 750,
            });

            startTimeline
              .add({
                targets: ".start-button",
                opacity: 0,
                zIndex: 0,
              })
              .add({
                targets: ".animation-wrapper",
                height: 440,
                width: 220,
              })
              .add({
                targets: ".game-wrapper",
                opacity: 1,
                zIndex: 40,
                complete: startGame,
              });
          }}
        >
          Play
        </button>
      )}
      {ready ? null : (
        <progress className="init-progress" value="10" max="100" />
      )}
    </div>
  );
}
