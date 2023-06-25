"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import anime from "animejs/lib/anime.es";

import { Opcodes, GameSocket } from "libs/Socket";
import { ClassicStates, NemeinStates } from "./(components)/Utils";
import Stage from "./(components)/Stage";
import StartPrompt from "./(prompts)/Start";
import ControlPrompt from "./(prompts)/Control";
import SettingsPrompt from "./(prompts)/Settings";

type GameSettings = {
  gameMode: "classic" | "nemein";
  antialias: boolean;
  powerPreference: "default" | "high-performance" | "low-power";
  performanceDisplay: boolean;
  stageShake: boolean;
};

type PerformanceDetails = {
  fps: number;
  frameTime: number;
};

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

const PROGRESS_BAR_ANIMATION_DURATION_MS = 250;
const GAME_STAGE_ANIMATION_DURATION_MS = 500;

const DEFAULT_GAME_SETTINGS: GameSettings = {
  gameMode: "nemein",
  antialias: true,
  powerPreference: "default",
  performanceDisplay: process.env.NODE_ENV === "development",
  stageShake: true,
};

export const GameContext = createContext<{
  gameStates: ClassicStates | NemeinStates | null;
  gameSettings: GameSettings;
  setGameSettings: Dispatch<SetStateAction<GameSettings>> | null;
  setStageVisibility: Dispatch<SetStateAction<boolean>> | null;
  setSettingsVisibility: Dispatch<SetStateAction<boolean>> | null;
  setPerformanceDetails: Dispatch<SetStateAction<PerformanceDetails>> | null;
}>({
  gameStates: null,
  gameSettings: DEFAULT_GAME_SETTINGS,
  setGameSettings: null,
  setStageVisibility: null,
  setSettingsVisibility: null,
  setPerformanceDetails: null,
});

export default function Game() {
  const gameSocket = useRef<GameSocket | null>(null);
  const isActive = useRef<boolean>(false);
  const isOver = useRef<boolean>(false);

  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [stageVisibility, setStageVisibility] = useState<boolean>(false);
  const [settingsVisibility, setSettingsVisibility] = useState<boolean>(false);
  const [controlVisibility, setControlVisibility] = useState<boolean>(false);
  const [gameStates, setGameStates] = useState<
    ClassicStates | NemeinStates | null
  >(null);
  const [gameSettings, setGameSettings] = useState<GameSettings>(
    DEFAULT_GAME_SETTINGS
  );
  const [gameLatency, setGameLatency] = useState<number>(0);
  const [performanceDetails, setPerformanceDetails] =
    useState<PerformanceDetails>({
      fps: 0,
      frameTime: 0,
    });

  const handleKeydown = ({ key }: { key: string }) => {
    if (isOver.current || !gameSocket.current) return;

    if (key === ESCAPE_KEY) {
      isActive.current = !isActive.current;

      gameSocket.current.send({
        op: Opcodes.GAME_TOGGLE,
        data: isActive.current,
      });

      return;
    }

    if (!isActive.current || !VALID_KEYS.includes(key)) return;

    gameSocket.current.send({
      op: Opcodes.GAME_KEYDOWN,
      data: key,
    });
  };

  const toggleGame = useCallback(() => {
    if (!gameSocket.current) return;

    gameSocket.current.send({
      op: Opcodes.SOCKET_READY,
      data: gameSettings.gameMode,
    });

    isActive.current = true;
    isOver.current = false;

    setControlVisibility(false);
  }, [gameSettings]);

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
      .on("data", ({ op, data }) => {
        switch (op) {
          case Opcodes.SOCKET_READY: {
            const gameMode = data;

            if (gameMode !== gameSettings.gameMode) {
              throw new Error("Game mode mismatched!");
            }

            /* Listens for keyboard input */
            document.addEventListener("keydown", handleKeydown);

            break;
          }

          case Opcodes.SOCKET_HEARTBEAT: {
            if (!gameSettings.performanceDisplay) return;

            const previousTimestamp = data;

            setGameLatency(Date.now() - previousTimestamp);

            break;
          }

          case Opcodes.GAME_STATES: {
            setGameStates(data);

            if (data.gameOver) {
              isActive.current = false;
              isOver.current = true;

              setControlVisibility(true);
            }

            break;
          }

          case Opcodes.GAME_TOGGLE: {
            setControlVisibility(!isActive.current);

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
  }, [gameSettings]);

  useEffect(() => {
    if (loadingProgress < 100 || !stageVisibility) return;

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
  }, [loadingProgress, stageVisibility, toggleGame]);

  return (
    <GameContext.Provider
      value={{
        gameStates,
        gameSettings,
        setGameSettings,
        setStageVisibility,
        setSettingsVisibility,
        setPerformanceDetails,
      }}
    >
      <div
        className="grid h-screen min-w-fit place-items-center bg-gray-800
          px-5 py-5"
      >
        {stageVisibility ? <Stage /> : <StartPrompt />}
        {settingsVisibility ? <SettingsPrompt /> : null}
        {controlVisibility ? (
          <ControlPrompt isOver={isOver.current} toggleGame={toggleGame} />
        ) : null}
        {gameSettings.performanceDisplay ? (
          <div
            className="text-md absolute bottom-[1%] left-1/2  
              translate-x-[-50%] translate-y-[-50%] font-medium text-slate-100"
          >
            latency: {gameLatency}ms • fps: {performanceDetails.fps} • frame
            time: {performanceDetails.frameTime}ms
          </div>
        ) : null}
      </div>
    </GameContext.Provider>
  );
}
