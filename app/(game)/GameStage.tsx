"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import anime from "animejs/lib/anime.es";

import { Opcodes, GameSocket } from "libs/Socket";
import { ClassicStates, NemeinStates } from "./(components)/Utils";
import Game from "./(components)/Game";
import StartPrompt from "./(prompts)/Start";
import ControlPrompt from "./(prompts)/Control";
import SettingsPrompt from "./(prompts)/Settings";

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

const PROGRESS_BAR_ANIMATION_DURATION_MS = 250;
const GAME_STAGE_ANIMATION_DURATION_MS = 500;

export default function GameStage() {
  const gameSocket = useRef<GameSocket | null>(null);
  const isOver = useRef<boolean>(false);

  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [showGameStage, setShowGameStage] = useState<boolean>(false);
  const [showControl, setShowControl] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [gameLatency, setGameLatency] = useState<number>(0);
  const [performanceInfo, setPerformanceInfo] = useState<{
    fps: number;
    frameTime: number;
  }>({
    fps: 0,
    frameTime: 0,
  });
  const [gameStates, setGameStates] = useState<
    ClassicStates | NemeinStates | null
  >(null);
  const [gameOptions, setGameOptions] = useState<{
    isClassic: boolean;
    antialias: boolean;
    powerPreference: "default" | "high-performance" | "low-power";
    performanceDisplay: boolean;
    screenShake: boolean;
  }>({
    isClassic: process.env.NODE_ENV === "production",
    antialias: true,
    powerPreference: "default",
    performanceDisplay: false,
    screenShake: true,
  });

  const handleKeydown = ({ key }: { key: string }) => {
    if (isOver.current || !gameSocket.current || !VALID_KEYS.includes(key))
      return;

    gameSocket.current.send({
      op: Opcodes.INPUT,
      data: key,
    });
  };

  const toggleGame = useCallback(() => {
    if (!gameSocket.current) return;

    gameSocket.current.send({
      op: Opcodes.READY,
      data: gameOptions.isClassic ? "classic" : "nemein",
    });

    isOver.current = false;

    setShowControl(false);
  }, [gameOptions]);

  useEffect(() => {
    gameSocket.current = new GameSocket();

    gameSocket.current
      .on("progress", ({ percent }) => {
        /* Updates the progress bar */
        anime({
          targets: "#init-progress",
          easing: "easeInOutCubic",
          duration: PROGRESS_BAR_ANIMATION_DURATION_MS,
          value: percent,
        });

        setLoadingProgress(percent);
      })
      .on("data", ({ op, timestamp, data }) => {
        switch (op) {
          case Opcodes.READY: {
            document.addEventListener("keydown", handleKeydown);

            break;
          }

          case Opcodes.HEARTBEAT: {
            if (!timestamp || !gameOptions.performanceDisplay) return;

            setGameLatency(Date.now() - timestamp);

            break;
          }

          case Opcodes.DATA: {
            setGameStates(data);

            if (data.gameOver) {
              isOver.current = true;

              setShowControl(true);
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
  }, [gameOptions]);

  useEffect(() => {
    if (loadingProgress < 100 || !showGameStage) return;

    anime
      .timeline({
        easing: "easeInOutCubic",
        duration: GAME_STAGE_ANIMATION_DURATION_MS,
      })
      /* Hides the animation wrapper & the progress bar */
      .add({
        targets: ["#animation-wrapper", "#init-progress"],
        opacity: 0,
        zIndex: 0,
      })
      /* Reveals the game stage */
      .add({
        targets: "#game-stage",
        opacity: 1,
        zIndex: 50,
        complete: toggleGame,
      });
  }, [loadingProgress, showGameStage, toggleGame]);

  return (
    <div className="grid h-screen place-items-center px-5 py-5">
      {showGameStage ? (
        <Game
          gameStates={gameStates}
          gameOptions={gameOptions}
          setPerformanceInfo={setPerformanceInfo}
        />
      ) : (
        <StartPrompt
          showGameStage={setShowGameStage}
          showSettings={setShowSettings}
        />
      )}
      {showControl ? (
        <ControlPrompt isOver={isOver.current} toggleGame={toggleGame} />
      ) : null}
      {showSettings ? (
        <SettingsPrompt
          options={gameOptions}
          applyOptions={setGameOptions}
          showSettings={setShowSettings}
        />
      ) : null}
      {gameOptions.performanceDisplay ? (
        <div
          className="text-md absolute bottom-[1%] left-1/2  
            translate-x-[-50%] translate-y-[-50%] font-medium text-slate-100"
        >
          latency: {gameLatency}ms • fps: {performanceInfo.fps} • frame time:{" "}
          {performanceInfo.frameTime}ms
        </div>
      ) : null}
    </div>
  );
}
