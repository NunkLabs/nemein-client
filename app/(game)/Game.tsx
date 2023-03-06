import { useEffect, useState, useRef } from "react";
import anime from "animejs/lib/anime.es";

import { Opcodes, GameSocket } from "libs/Socket";
import MainPanel from "./(panels)/Main";
import HeldPanel from "./(panels)/Held";
import QueuePanel from "./(panels)/Queue";
import TopPanel from "./(panels)/Top";

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

export default function Game() {
  const socket = useRef<GameSocket | null>(null);
  const isOver = useRef<boolean>(false);

  const [ready, setReady] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [gameStates, setGameStates] = useState<
    ClassicStates | NemeinStates | null
  >(null);

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
            const initialGameStates = message.data;

            setGameStates(initialGameStates);

            document.addEventListener("keydown", handleKeydown);

            break;
          }

          case Opcodes.DATA: {
            const newGameStates = message.data;

            setGameStates(newGameStates);

            if (newGameStates.gameOver) {
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
      {active ? null : <div className="animation-wrapper" />}
      <div className="game-wrapper">
        <TopPanel gameStates={gameStates} />
        <div className="flex gap-x-2">
          <HeldPanel gameStates={gameStates} />
          <MainPanel
            isReady={ready}
            isActive={active}
            isOver={!active && isOver.current}
            gameStates={gameStates}
            restartGame={restartGame}
          />
          <QueuePanel gameStates={gameStates} />
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
