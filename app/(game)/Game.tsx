"use client";

import { Graphics, Stage } from "@pixi/react";
import { useEffect, useState, useRef } from "react";
import anime from "animejs/lib/anime.es";

import { Opcodes, GameSocket } from "libs/Socket";
import { drawPanels, getGameRender } from "./Utils";
import ControlPrompt from "./(prompts)/Control";

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

const INIT_ANIMATION_DURATION_MS = 500;
const START_GAME_ANIMATION_DURATION_MS = 250;

const DEFAULT_STAGE_SIZE = 720;

export default function Game() {
  const socket = useRef<GameSocket | null>(null);
  const isOver = useRef<boolean>(false);

  const [ready, setReady] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [resolution, setResolution] = useState<number | undefined>(undefined);
  const [game, setGame] = useState<JSX.Element[]>([]);

  const handleKeydown = ({ key }: { key: string }) => {
    if (isOver.current || !VALID_KEYS.includes(key)) return;

    socket.current?.send({
      op: Opcodes.INPUT,
      data: key,
    });
  };

  useEffect(() => {
    setResolution(window.devicePixelRatio);

    socket.current = new GameSocket();

    socket.current
      .on("progress", (progress: { percent: number }) => {
        const initTimeline = anime.timeline({
          easing: "easeInOutCubic",
          duration: INIT_ANIMATION_DURATION_MS,
        });

        initTimeline.add({
          targets: ".init-progress",
          value: progress.percent,
        });

        if (progress.percent < 100) return;

        initTimeline
          /* Matches the wrapper and the progress bar to the start button size */
          .add({
            targets: [".animation-wrapper", ".init-progress"],
            height: 32,
          })
          /* Hides progress bar */
          .add({
            targets: [".init-progress"],
            opacity: 0,
            zIndex: 0,
          })
          /* Reveals the start button & brings it the the top most layer */
          .add({
            targets: [".start-button"],
            opacity: 1,
            zIndex: 50,
          });
      })
      .on("data", (data) => {
        switch (data.op) {
          case Opcodes.READY: {
            document.addEventListener("keydown", handleKeydown);

            break;
          }

          case Opcodes.DATA: {
            const gameStates = data.data;

            setGame(getGameRender(gameStates));

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

      currentSocket.removeAllListeners();

      currentSocket.destroy();
    };
  }, []);

  return (
    <div className="grid h-screen place-items-center px-5 py-5">
      {ready ? null : (
        <>
          <div className="animation-wrapper" />
          <progress className="init-progress" value="10" max="100" />
          <button
            className={"start-button button button-light"}
            onClick={() => {
              const startTimeline = anime.timeline({
                easing: "easeInOutCubic",
                duration: START_GAME_ANIMATION_DURATION_MS,
              });

              startTimeline
                /* Hides the wrapper & start button */
                .add({
                  targets: [".animation-wrapper", ".start-button"],
                  opacity: 0,
                  zIndex: 0,
                })
                /* Reveals the game stage */
                .add({
                  targets: ".stage",
                  opacity: 1,
                  complete: () => {
                    setReady(true);

                    socket.current?.send({
                      op: Opcodes.READY,
                      data:
                        process.env.NODE_ENV === "production"
                          ? "classic"
                          : "nemein",
                    });

                    setActive(true);
                  },
                });
            }}
          >
            Play
          </button>
        </>
      )}
      <Stage
        className={"stage"}
        height={DEFAULT_STAGE_SIZE}
        width={DEFAULT_STAGE_SIZE}
        options={{
          antialias: true,
          backgroundAlpha: 0,
          powerPreference: "high-performance",
          resolution,
        }}
      >
        <Graphics draw={drawPanels}></Graphics>
        {game}
      </Stage>
      {ready && !active ? (
        <ControlPrompt
          isOver={isOver.current}
          restartGame={() => {
            if (!socket.current) return;

            socket.current.send({ op: Opcodes.RESTART });

            socket.current.send({
              op: Opcodes.READY,
              data:
                process.env.NODE_ENV === "production" ? "classic" : "nemein",
            });

            setActive(true);

            isOver.current = false;
          }}
        />
      ) : null}
    </div>
  );
}
