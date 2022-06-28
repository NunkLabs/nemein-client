import { useCallback, useEffect, useState, useRef } from "react";

import { Opcodes, TetrisSocket } from "components/Socket";
import { GamePanel } from "components/game/GamePanel";
import { HeldPanel } from "components/game/HeldPanel";
import { QueuePanel } from "components/game/QueuePanel";
import { TopPanel } from "components/game/TopPanel";

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

export const Tetris = () => {
  const socket = useRef<TetrisSocket | null>(null);
  const isActive = useRef<boolean>(false);
  const isOver = useRef<boolean>(false);

  const [ready, setReady] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [animate, setAnimate] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<boolean>(false);
  const [gameState, setGameState] = useState<TetrisState | null>(null);

  const startCountdown = (restart: boolean = false) => {
    if (restart) {
      socket.current?.send({ op: Opcodes.RESTART });
    }

    setCountdown(true);
  };

  const startGame = () => {
    setCountdown(false);

    if (!ready) {
      setReady(true);
    }

    if (!active) {
      socket.current?.send({ op: Opcodes.TOGGLE });
    }

    setActive(true);

    isActive.current = true;
    isOver.current = false;
  };

  const handleKeydown = useCallback(({ key }: { key: string }) => {
    if (isOver.current) return;

    if (key === "Escape") {
      if (!isActive.current) {
        setCountdown(true);

        return;
      }

      setActive(false);

      isActive.current = false;

      socket.current?.send({ op: Opcodes.TOGGLE });

      return;
    }

    if (!isActive.current || !VALID_KEYS.includes(key)) return;

    socket.current?.send({
      op: Opcodes.INPUT,
      data: key,
    });
  }, []);

  useEffect(() => {
    if (!ready) return;

    socket.current = new TetrisSocket();

    socket.current.on("message", (data) => {
      const message = JSON.parse(data);

      switch (message.op) {
        case Opcodes.READY: {
          const initialGameState = message.data;

          setGameState(initialGameState);

          socket.current?.setHeartbeat(message.heartbeat);

          document.addEventListener("keydown", handleKeydown);

          break;
        }

        case Opcodes.DATA: {
          const newGameState = message.data;

          setGameState(newGameState);

          if (newGameState.gameOver) {
            setActive(false);

            isActive.current = false;
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
  }, [socket, ready, handleKeydown]);

  return (
    <div className="grid place-items-center px-5 py-5">
      <TopPanel isAnimated={animate} gameState={gameState} />
      <div className="relative">
        <div className="flex gap-x-2">
          <HeldPanel isAnimated={animate} gameState={gameState} />
          <GamePanel
            isReady={ready}
            isActive={active}
            isAnimated={animate}
            isCountdown={countdown}
            isOver={!active && isOver.current}
            gameState={gameState}
            startAnimation={() => setAnimate(true)}
            startCountdown={startCountdown}
            startGame={startGame}
          />
          <QueuePanel isAnimated={animate} gameState={gameState} />
        </div>
      </div>
    </div>
  );
};
