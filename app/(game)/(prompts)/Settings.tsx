import { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es";

import { GameOptions, PowerPreference } from "../(components)/Game";

type SettingsProps = {
  options: GameOptions;
  applyOptions: (options: GameOptions) => void;
  showSettings: (settings: boolean) => void;
};

const POWER_PREFERENCE_OPTIONS = {
  default: "default",
  "high-performance": "high performance",
  "low-power": "low power",
};

const BASE_SETTINGS_ANIMATION_PARAMS = {
  targets: "#settings-prompt",
  easing: "easeInOutCubic",
  duration: 500,
};

export default function Settings({
  options,
  applyOptions,
  showSettings,
}: SettingsProps) {
  const powerPreferenceIndex = useRef<number>(0);

  useEffect(() => {
    anime({
      ...BASE_SETTINGS_ANIMATION_PARAMS,
      opacity: 1,
    });
  }, []);

  return (
    <dialog
      className="z-[55] grid h-[360px] w-[480px] place-items-center gap-y-1
        rounded border-4 border-slate-100 bg-slate-100 text-center opacity-0"
      id="settings-prompt"
    >
      <p className="text-3xl font-bold text-slate-800">settings</p>
      <div className="grid grid-rows-5 gap-y-1">
        <div className="grid grid-cols-2 gap-x-1">
          <button
            className="button button-dark h-[32px] w-[192px]"
            onClick={() =>
              applyOptions({
                ...options,
                isClassic: !options.isClassic,
              })
            }
          >
            game mode
          </button>
          <div
            className="inline-block h-[32px] w-[192px] rounded border-4
              border-gray-800 bg-transparent text-center align-middle text-lg
              font-medium"
          >
            {options.isClassic ? "classic" : "nemein"}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-1">
          <button
            className="button button-dark h-[32px] w-[192px]"
            onClick={() =>
              applyOptions({
                ...options,
                antialias: !options.antialias,
              })
            }
          >
            antiliasing
          </button>
          <div
            className="inline-block h-[32px] w-[192px] rounded border-4
              border-gray-800 bg-transparent text-center align-middle text-lg
              font-medium"
          >
            {options.antialias ? "on" : "off"}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-1">
          <button
            className="button button-dark h-[32px] w-[192px]"
            onClick={() => {
              const powerPreferenceOptions = Object.keys(
                POWER_PREFERENCE_OPTIONS
              ) as PowerPreference[];

              powerPreferenceIndex.current =
                powerPreferenceIndex.current + 1 < powerPreferenceOptions.length
                  ? powerPreferenceIndex.current + 1
                  : 0;

              applyOptions({
                ...options,
                powerPreference:
                  powerPreferenceOptions[powerPreferenceIndex.current],
              });
            }}
          >
            power preference
          </button>
          <div
            className="inline-block h-[32px] w-[192px] rounded border-4
              border-gray-800 bg-transparent text-center align-middle text-lg
              font-medium"
          >
            {POWER_PREFERENCE_OPTIONS[options.powerPreference]}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-1">
          <button
            className="button button-dark h-[32px] w-[192px]"
            onClick={() =>
              applyOptions({
                ...options,
                performanceDisplay: !options.performanceDisplay,
              })
            }
          >
            performance display
          </button>
          <div
            className="inline-block h-[32px] w-[192px] rounded border-4
              border-gray-800 bg-transparent text-center align-middle text-lg
              font-medium"
          >
            {options.performanceDisplay ? "on" : "off"}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-1">
          <button
            className="button button-dark h-[32px] w-[192px]"
            onClick={() =>
              applyOptions({
                ...options,
                screenShake: !options.screenShake,
              })
            }
          >
            screen shake
          </button>
          <div
            className="inline-block h-[32px] w-[192px] rounded border-4
              border-gray-800 bg-transparent text-center align-middle text-lg
              font-medium"
          >
            {options.screenShake ? "on" : "off"}
          </div>
        </div>
      </div>
      <button
        className="button button-dark h-[32px] w-[192px]"
        onClick={() => {
          anime({
            ...BASE_SETTINGS_ANIMATION_PARAMS,
            opacity: 0,
            complete: () => showSettings(false),
          });
        }}
      >
        confirm
      </button>
    </dialog>
  );
}
