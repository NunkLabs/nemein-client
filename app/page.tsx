"use client";

import { Montserrat } from "next/font/google";
import { useCallback, useEffect, useState, useRef } from "react";

import { Opcodes, GameSocket } from "libs/Socket";
import { useGameStore } from "libs/Store";
import ControlPanel from "app/(panels)/Control";
import StartPanel from "app/(panels)/Start";
import Stage from "app/(game)/Stage";

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
  const gameOptions = useGameStore((state) => state.gameOptions);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const updateGamePerformance = useGameStore(
    (state) => state.updateGamePerformance
  );
  const updateGameStates = useGameStore((state) => state.updateGameStates);
  const updateGameStatus = useGameStore((state) => state.updateGameStatus);

  const gameSocket = useRef<GameSocket | null>(null);
  const isActive = useRef<boolean>(false);

  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  const startGame = useCallback(() => {
    if (!gameSocket.current) return;

    gameSocket.current.send({
      op: Opcodes.SOCKET_READY,
      data: gameOptions.gameMode,
    });
  }, [gameOptions.gameMode]);

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
    [gameStatus, toggleGame]
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
    gameSocket.current = new GameSocket();

    gameSocket.current
      .on("progress", ({ percent }) => setLoadingProgress(percent))
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

    const currentSocket = gameSocket.current;

    return () => {
      /* Cleans up socket on component unmount */
      currentSocket.removeAllListeners();

      currentSocket.destroy();
    };
  }, [
    gameOptions.gameMode,
    updateGamePerformance,
    updateGameStates,
    updateGameStatus,
  ]);

  return (
    <div
      className={`${montserrat.className} grid h-screen min-w-fit place-items-center bg-gray-50 dark:bg-gray-950`}
    >
      <StartPanel loadingProgress={loadingProgress} />
      <ControlPanel startGame={startGame} toggleGame={toggleGame} />
      <Stage startGame={startGame} />
    </div>
  );
}
