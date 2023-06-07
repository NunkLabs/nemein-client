"use client";

import { Stage } from "@pixi/react";
import { useEffect, useState, useRef } from "react";
import anime from "animejs/lib/anime.es";

import { Opcodes, GameSocket } from "libs/Socket";
import { STAGE_SIZE, ClassicStates, NemeinStates } from "./(components)/Utils";
import Game from "./(components)/Game";
import ControlPrompt from "./(prompts)/Control";

import "./GameStage.css";

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

/* Page load animation durations */
const START_BUTTON_ANIMATION_DURATION_MS = 500;
const PROGRESS_BAR_ANIMATION_DURATION_MS = 250;
const GAME_STAGE_ANIMATION_DURATION_MS = 500;

export default function GameStage() {
  const gameSocket = useRef<GameSocket | null>(null);
  const devicePixelRatio = useRef<number | undefined>(undefined);
  const isOver = useRef<boolean>(false);

  const [ready, setReady] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [animateStage, setAnimateStage] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [gameStates, setGameStates] = useState<
    ClassicStates | NemeinStates | null
  >(null);

  const handleKeydown = ({ key }: { key: string }) => {
    if (isOver.current || !VALID_KEYS.includes(key)) return;

    gameSocket.current?.send({
      op: Opcodes.INPUT,
      data: key,
    });
  };

  useEffect(() => {
    devicePixelRatio.current = window.devicePixelRatio;

    gameSocket.current = new GameSocket();

    gameSocket.current
      .on("progress", ({ percent }) => {
        anime({
          targets: ".init-progress",
          easing: "easeInOutCubic",
          duration: PROGRESS_BAR_ANIMATION_DURATION_MS,
          value: percent,
        });

        setLoadingProgress(percent);
      })
      .on("data", ({ op, data }) => {
        switch (op) {
          case Opcodes.READY: {
            document.addEventListener("keydown", handleKeydown);

            break;
          }

          case Opcodes.DATA: {
            setGameStates(data);

            if (data.gameOver) {
              setActive(false);

              isOver.current = true;
            }

            break;
          }

          default:
        }
      });

    const currentSocket = gameSocket.current;

    return () => {
      /* Clean up on component unmount */
      document.removeEventListener("keydown", handleKeydown);

      currentSocket.removeAllListeners();

      currentSocket.destroy();
    };
  }, []);

  useEffect(() => {
    if (!animateStage || loadingProgress < 100) return;

    const stageTimeline = anime.timeline({
      easing: "easeInOutCubic",
      duration: GAME_STAGE_ANIMATION_DURATION_MS,
    });

    stageTimeline
      .add({
        targets: [".animation-wrapper", ".init-progress"],
        opacity: 0,
        zIndex: 0,
      })
      .add({
        targets: ".stage",
        opacity: 1,
        zIndex: 50,
        complete: () => {
          gameSocket.current?.send({
            op: Opcodes.READY,
            data: process.env.NODE_ENV === "production" ? "classic" : "nemein",
          });

          setReady(true);
          setActive(true);
        },
      });
  }, [animateStage, loadingProgress]);

  return (
    <div className="grid h-screen place-items-center px-5 py-5">
      <Stage
        className="stage"
        height={STAGE_SIZE}
        width={STAGE_SIZE}
        options={{
          hello: true, // Logs Pixi version & renderer type
          antialias: true,
          backgroundAlpha: 0,
          powerPreference: "high-performance",
          resolution: devicePixelRatio.current,
        }}
      >
        <Game gameStates={gameStates} />
      </Stage>
      {ready ? null : (
        <div className="animation-wrapper">
          <button
            className={"start-button button button-light"}
            onClick={() => {
              const startTimeline = anime.timeline({
                easing: "easeInOutCubic",
                duration: START_BUTTON_ANIMATION_DURATION_MS,
              });

              startTimeline
                /* Hides start button */
                .add({
                  targets: [".start-button"],
                  opacity: 0,
                  zIndex: 0,
                })
                .add({
                  targets: [".animation-wrapper"],
                  height: 16,
                })
                .add({
                  targets: [".init-progress"],
                  opacity: 1,
                  zIndex: 50,
                  complete: () => setAnimateStage(true),
                });
            }}
          >
            Play
          </button>
          <progress className="init-progress" value="10" max="100" />
        </div>
      )}
      {ready && !active ? (
        <ControlPrompt
          isOver={isOver.current}
          restartGame={() => {
            if (!gameSocket.current) return;

            gameSocket.current.send({
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
