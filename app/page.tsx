"use client";

import { Montserrat } from "next/font/google";
import { Fragment, useCallback, useEffect, useState, useRef } from "react";
import { FeatureBundle, LazyMotion } from "framer-motion";
import dynamic from "next/dynamic";

import { Opcodes, GameSocket } from "libs/Socket";
import { useGameStore } from "libs/Store";

/* Loads the game components dynamically */
const ControlPanel = dynamic(() => import("app/(panels)/Control"), {
  ssr: false,
});
const StartPanel = dynamic(() => import("app/(panels)/Start"), {
  ssr: false,
});
const Stage = dynamic(() => import("app/(game)/Stage"), { ssr: false });

const ESCAPE_KEY = "Escape";
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

const montserrat = Montserrat({
  subsets: ["latin"],
});

export default function Nemein() {
  const gameLoadStates = useGameStore((state) => state.gameLoadStates);
  const gameOptions = useGameStore((state) => state.gameOptions);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const updateGameLoadStates = useGameStore(
    (state) => state.updateGameLoadStates,
  );
  const updateGamePerformance = useGameStore(
    (state) => state.updateGamePerformance,
  );
  const updateGameStates = useGameStore((state) => state.updateGameStates);
  const updateGameStatus = useGameStore((state) => state.updateGameStatus);

  const gameSocket = useRef<GameSocket | null>(null);
  const isActive = useRef<boolean>(false);

  const [featureBundle, setFeatureBundle] = useState<FeatureBundle | null>(
    null,
  );

  const startGame = useCallback(() => {
    if (!gameSocket.current) return;

    gameSocket.current.send({
      op: Opcodes.SOCKET_READY,
      data: gameOptions.gameMode,
    });

    updateGameStatus("ongoing");
  }, [gameOptions.gameMode, updateGameStatus]);

  const toggleGame = useCallback(() => {
    if (!gameSocket.current) return;

    isActive.current = !isActive.current;

    gameSocket.current.send({
      op: Opcodes.GAME_TOGGLE,
      data: isActive.current,
    });
  }, []);

  const handleKeydown = useCallback(
    ({ key }: { key: string }) => {
      if (!gameSocket.current || gameStatus === "initializing") return;

      if (gameStatus !== "ending" && key === ESCAPE_KEY) {
        toggleGame();

        return;
      }

      if (gameStatus !== "ongoing" || !VALID_KEYS.includes(key)) return;

      gameSocket.current.send({
        op: Opcodes.GAME_KEYDOWN,
        data: key,
      });
    },
    [gameStatus, toggleGame],
  );

  useEffect(() => {
    /* Listens for keyboard input */
    document.addEventListener("keydown", handleKeydown);

    return () => {
      /* Removes listener on component unmount */
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  useEffect(() => {
    /* Imports and loads the feature bundle for Framer Motion */
    if (!gameLoadStates.featureBundle) {
      import("libs/Animation").then((res) => {
        setFeatureBundle(res.default);

        updateGameLoadStates({ featureBundle: true });
      });
    }

    /* Initializes and listens for socket events */
    if (!gameLoadStates.gameSocket) {
      gameSocket.current = new GameSocket();

      gameSocket.current
        .on("progress", ({ percent }) => {
          if (percent < 100) return;

          updateGameLoadStates({ gameSocket: true });
        })
        .on("data", ({ op, data }) => {
          switch (op) {
            case Opcodes.SOCKET_READY: {
              if (data !== gameOptions.gameMode) {
                throw new Error("Game mode mismatched!");
              }

              isActive.current = true;

              updateGameStatus("ongoing");

              break;
            }

            case Opcodes.SOCKET_HEARTBEAT: {
              updateGamePerformance({
                currentLatency: Date.now() - data,
              });

              break;
            }

            case Opcodes.GAME_STATES: {
              updateGameStates(data);

              if (data.gameOver) {
                isActive.current = false;

                updateGameStatus("ending");
              }

              break;
            }

            case Opcodes.GAME_TOGGLE: {
              updateGameStatus(isActive.current ? "ongoing" : "pausing");

              break;
            }

            default:
          }
        });
    }

    return () => {
      /* Cleans up socket on component unmount */
      if (!gameSocket.current) return;

      gameSocket.current.removeAllListeners();

      gameSocket.current.destroy();
    };
  }, [
    gameLoadStates.featureBundle,
    gameLoadStates.gameSocket,
    gameOptions.gameMode,
    updateGameLoadStates,
    updateGamePerformance,
    updateGameStates,
    updateGameStatus,
  ]);

  return (
    <div
      className={`${montserrat.className} grid h-screen min-w-fit place-items-center bg-gray-50 dark:bg-gray-950`}
    >
      {gameLoadStates.initialLoad && (
        /* Acts as a placeholder while waiting for the start panel */
        <div
          className="fixed left-1/2 top-1/2 h-32 translate-x-[-50%] translate-y-[-50%] animate-pulse text-center text-5xl"
          id="start-panel-initial-header"
        >
          nemein
        </div>
      )}
      {featureBundle && (
        /* Lazy-loads in the feature bundle */
        <LazyMotion features={featureBundle} strict>
          {gameLoadStates.featureBundle && (
            <Fragment>
              <Stage />
              <StartPanel startGame={startGame} />
              <ControlPanel startGame={startGame} toggleGame={toggleGame} />
            </Fragment>
          )}
        </LazyMotion>
      )}
    </div>
  );
}
