import { Fragment, useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";

import { useGameStore } from "libs/Store";
import { buttonVariants } from "components/ui/Button";

export default function ControlPanel({
  startGame,
  toggleGame,
}: {
  startGame: () => void;
  toggleGame: () => void;
}) {
  const gameStatus = useGameStore((state) => state.gameStatus);

  const [presence, setPresence] = useState<boolean>(false);

  useEffect(() => {
    if (gameStatus !== "pausing" && gameStatus !== "ending") return;

    setPresence(true);
  }, [gameStatus]);

  return (
    presence && (
      <div className="fixed left-1/2 top-1/2 flex translate-x-[-50%] translate-y-[-50%] flex-col place-items-center gap-y-2 text-center">
        <AnimatePresence onExitComplete={() => setPresence(false)}>
          {(gameStatus === "pausing" || gameStatus === "ending") && (
            /**
             * The animation sequence here creates an vertical fold/unfold effect
             * from the top with the initial y offset being -10px. A delay of
             * 0.05s is added between the component visibility to veil/unveil
             * them one by one.
             *
             * The animate in property also includes a spring easing to make the
             * motion more lifelike.The exit property skips the vertical
             * translate and the spring easing because the spring motion at the
             * end won't be visible anyway.
             */
            <Fragment>
              <m.h1
                className="text-3xl"
                key="control-panel-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring" },
                }}
                exit={{ opacity: 0, transition: { delay: 0.1 } }}
              >
                {gameStatus === "ending" ? "Game Over" : "Paused"}
              </m.h1>
              <m.button
                className={buttonVariants({ variant: "primary" })}
                key="control-panel-restart"
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.05, type: "spring" },
                }}
                exit={{ opacity: 0, transition: { delay: 0.05 } }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                type="button"
              >
                Restart
              </m.button>
              {gameStatus === "pausing" && (
                <m.button
                  className={buttonVariants({ variant: "primary" })}
                  key="control-panel-resume"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.1, type: "spring" },
                  }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleGame}
                  type="button"
                >
                  Resume
                </m.button>
              )}
            </Fragment>
          )}
        </AnimatePresence>
      </div>
    )
  );
}
