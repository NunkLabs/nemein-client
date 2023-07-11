import { useContext, useEffect } from "react";
import anime from "animejs/lib/anime.es";

import { GameContext } from "app/(game)/Misc";

const START_BUTTON_ANIMATION_DURATION_MS = 250;
const START_PROMPT_ANIMATION_DURATION_MS = 250;

export default function StartPrompt() {
  const { setStageVisibility, setSettingsVisibility } = useContext(GameContext);

  if (!setStageVisibility || !setSettingsVisibility) {
    throw new Error("Set station actions are nullish.");
  }

  useEffect(() => {
    anime
      .timeline({
        easing: "easeInOutCubic",
        duration: START_PROMPT_ANIMATION_DURATION_MS,
      })
      /* Reveals the start button first */
      .add({
        targets: ["#start-button"],
        opacity: 1,
      })
      /* Reveals the animation wrapper & the setting button */
      .add({
        targets: ["#animation-wrapper", "#settings-button"],
        opacity: 1,
      });
  }, []);

  return (
    <div>
      <div
        className="absolute left-1/2 top-1/2 z-40 h-[32px] w-[176px]
          translate-x-[-50%] translate-y-[-50%] rounded border-4
          border-slate-100 opacity-0"
        id="animation-wrapper"
      >
        <button
          className="button button-light absolute left-1/2 top-1/2 z-[50]
            h-[32px] w-[176px] translate-x-[-50%] translate-y-[-50%] opacity-0"
          id="start-button"
          onClick={() => {
            anime
              .timeline({
                easing: "easeInOutCubic",
                duration: START_BUTTON_ANIMATION_DURATION_MS,
              })
              /* Hides all the buttons */
              .add({
                targets: ["#start-button", "#settings-button"],
                opacity: 0,
                zIndex: 0,
              })
              /* Scales the animation wrapper down to match the progress bar */
              .add({
                targets: ["#animation-wrapper"],
                height: 16,
              })
              /* Reveals the progress bar */
              .add({
                targets: ["#init-progress"],
                opacity: 1,
                zIndex: 50,
                complete: () => setStageVisibility(true),
              });
          }}
          type="button"
        >
          Play
        </button>
        <progress
          className="absolute left-1/2 top-1/2 z-30 translate-x-[-50%]
            translate-y-[-50%] opacity-0"
          id="init-progress"
          value="10"
          max="100"
        />
      </div>
      <button
        className="button button-alt absolute left-1/2 top-1/2 z-[50]
          h-[32px] w-[176px] translate-x-[-50%] translate-y-[70%]  opacity-0"
        id="settings-button"
        onClick={() => setSettingsVisibility(true)}
        type="button"
      >
        Settings
      </button>
    </div>
  );
}
