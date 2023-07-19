"use client";

import { useCallback, useEffect, useState, useRef } from "react";

import { Opcodes, GameSocket } from "libs/Socket";
import { useGameStore } from "libs/Store";
import Stage from "app/(game)/Stage";
import StartPrompt from "app/(panels)/Start";
import ControlPrompt from "app/(panels)/Control";

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

export default function Nemein() {
  const gameOptions = useGameStore((state) => state.gameOptions);
  const gamePerformance = useGameStore((state) => state.gamePerformance);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const updateGamePerformance = useGameStore(
    (state) => state.updateGamePerformance
  );
  const updateGameStates = useGameStore((state) => state.updateGameStates);
  const updateGameStatus = useGameStore((state) => state.updateGameStatus);

  const gameSocket = useRef<GameSocket | null>(null);
  const isActive = useRef<boolean>(false);

  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  const handleKeydown = useCallback(
    ({ key }: { key: string }) => {
      if (!gameSocket.current || gameStatus === "initializing") return;

      if (key === ESCAPE_KEY) {
        isActive.current = !isActive.current;

        gameSocket.current.send({
          op: Opcodes.GAME_TOGGLE,
          data: isActive.current,
        });

        return;
      }

      if (gameStatus !== "ongoing" || !VALID_KEYS.includes(key)) return;

      gameSocket.current.send({
        op: Opcodes.GAME_KEYDOWN,
        data: key,
      });
    },
    [gameStatus]
  );

  const startGame = useCallback(() => {
    if (!gameSocket.current) return;

    gameSocket.current.send({
      op: Opcodes.SOCKET_READY,
      data: gameOptions.gameMode,
    });

    isActive.current = true;
  }, [gameOptions.gameMode]);

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
      className="grid h-screen min-w-fit place-items-center bg-gray-800
          px-5 py-5"
    >
      {gameStatus === "initializing" ? (
        <StartPrompt
          loadingProgress={loadingProgress}
          loadStage={() => updateGameStatus("ongoing")}
        />
      ) : (
        <Stage startGame={startGame} />
      )}
      {(gameStatus === "pausing" || gameStatus === "ending") && (
        <ControlPrompt startGame={startGame} />
      )}
      {gameOptions.performanceDisplay && (
        <div
          className="text-md absolute bottom-[1%] left-1/2  
              translate-x-[-50%] translate-y-[-50%] font-medium text-slate-100"
        >
          current latency: {gamePerformance.currentLatency} ms • frame rate:{" "}
          {gamePerformance.frameRate} fps • frame time:{" "}
          {gamePerformance.frameTime} ms
        </div>
      )}
    </div>
  );
}
