import { useEffect } from "react";
import anime from "animejs/lib/anime.es";

const BASE_CONTROL_ANIMATION_PARAMS = {
  targets: "#control-prompt",
  easing: "easeInOutCubic",
  duration: 500,
};

export default function ControlPrompt({
  isOver,
  toggleGame,
}: {
  isOver: boolean;
  toggleGame: () => void;
}) {
  useEffect(() => {
    anime({
      ...BASE_CONTROL_ANIMATION_PARAMS,
      opacity: 1,
    });
  }, []);

  return (
    <div
      className="absolute left-1/2 top-1/2 z-50 grid w-44 translate-x-[-50%]
        translate-y-[-50%] place-items-center gap-y-2 text-center"
    >
      <p className="text-3xl font-bold text-slate-100">
        {isOver ? "Game Over" : "Settings"}
      </p>
      <button
        className="button button-light h-8 w-40"
        onClick={() => {
          anime({
            ...BASE_CONTROL_ANIMATION_PARAMS,
            opacity: 0,
            complete: toggleGame,
          });
        }}
      >
        {isOver ? "New Game" : "Restart"}
      </button>
    </div>
  );
}
