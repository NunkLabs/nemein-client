import { Fragment, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useGameStore } from "libs/Store";
import { buttonVariants } from "components/ui/Button";
import OptionsPanel from "./Options";

export default function StartPanel({
  loadingProgress,
}: {
  loadingProgress: number;
}) {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const updateGameStatus = useGameStore((state) => state.updateGameStatus);

  const [presence, setPresence] = useState<boolean>(true);
  const [requestStage, setRequestStage] = useState<boolean>(false);

  useEffect(() => {
    if (loadingProgress < 100 || !requestStage) return;

    updateGameStatus("ongoing");
  }, [loadingProgress, requestStage, updateGameStatus]);

  return (
    presence && (
      <div className="fixed left-1/2 top-1/2 flex h-32 translate-x-[-50%] translate-y-[-50%] flex-col gap-y-2 text-center">
        {requestStage ? (
          /**
           * We don't need the enter animation handling because the static
           * header is our placeholder until we need this loading animation.
           */
          <AnimatePresence onExitComplete={() => setPresence(false)}>
            {gameStatus === "initializing" && (
              <motion.div
                className="flex flex-row text-5xl"
                key="start-panel-loading-header"
                exit={{ opacity: 0 }}
              >
                {Array.from("nemein").map((letter, index) => (
                  <motion.span
                    initial="initial"
                    animate="animate"
                    variants={{
                      /**
                       * Raises y position by 15px and shifts the opacity of
                       * each letter sequentially to create a wave effect
                       */
                      animate: () => ({
                        opacity: [0.25, 1, 0.25],
                        y: [0, -10, 0],
                        transition: {
                          duration: 1,
                          delay: index * 0.2,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 1.5,
                        },
                      }),
                    }}
                    key={`start-panel-loading-${index}`}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          /**
           * The enter animation sequence offsets the components -10px
           * vertically then slide them down with the spring effect for a more
           * lifelike effect.
           *
           * We don't care about the exit animation handling here because the
           * loading header will directly replace it. Until then, this acts as
           * a placeholder for the loading header.
           */
          <motion.div
            className="text-5xl"
            id="start-panel-static-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, transition: { type: "spring" } }}
          >
            nemein
          </motion.div>
        )}
        <AnimatePresence onExitComplete={() => null}>
          {!requestStage && (
            /**
             * The enter animation of these two buttons is the same as the
             * static header.
             *
             * However, delays of 0.05 second and 0.1 second are added to
             * the start button and the options button respectively to create
             * the enter order:
             *
             *   static header > start button > options button
             *
             * The exit order is reversed:
             *
             *   options button > start button > static/loading header
             */
            <Fragment>
              <motion.button
                className={`${buttonVariants({
                  variant: "primary",
                })} place-self-center`}
                key="start-panel-start"
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.05, type: "spring" },
                }}
                exit={{ opacity: 0, transition: { delay: 0.05 } }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRequestStage(true)}
                type="button"
              >
                Play
              </motion.button>
              <motion.div
                className="place-self-center"
                key="start-panel-options"
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.1, type: "spring" },
                }}
                exit={{ opacity: 0 }}
              >
                <OptionsPanel />
              </motion.div>
            </Fragment>
          )}
        </AnimatePresence>
      </div>
    )
  );
}
