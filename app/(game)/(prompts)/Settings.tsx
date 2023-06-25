import { useContext, useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es";

import { GameContext } from "../Game";

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

function SettingsField({
  buttonLabel,
  fieldLabel,
  onClickAction,
}: {
  buttonLabel: string;
  fieldLabel: string;
  onClickAction: () => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-1">
      <div
        className="button button-dark h-[32px] w-[192px]"
        onClick={onClickAction}
      >
        {buttonLabel}
      </div>
      <div
        className="inline-block h-[32px] w-[192px] rounded border-4
          border-gray-800 bg-transparent text-center align-middle text-lg
          font-medium"
      >
        {fieldLabel}
      </div>
    </div>
  );
}

export default function SettingsPrompt() {
  const { gameSettings, setGameSettings, setSettingsVisibility } =
    useContext(GameContext);

  if (!setGameSettings || !setSettingsVisibility) {
    throw new Error("Set state actions are nullish.");
  }

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
        <SettingsField
          buttonLabel={"game mode"}
          fieldLabel={gameSettings.gameMode}
          onClickAction={() =>
            setGameSettings({
              ...gameSettings,
              gameMode:
                gameSettings.gameMode === "classic" ? "nemein" : "classic",
            })
          }
        />
        <SettingsField
          buttonLabel={"antialias"}
          fieldLabel={gameSettings.antialias ? "on" : "off"}
          onClickAction={() =>
            setGameSettings({
              ...gameSettings,
              antialias: !gameSettings.antialias,
            })
          }
        />
        <SettingsField
          buttonLabel={"power preference"}
          fieldLabel={POWER_PREFERENCE_OPTIONS[gameSettings.powerPreference]}
          onClickAction={() => {
            const powerPreferenceOptions = Object.keys(
              POWER_PREFERENCE_OPTIONS
            ) as ("default" | "high-performance" | "low-power")[];

            powerPreferenceIndex.current =
              powerPreferenceIndex.current + 1 < powerPreferenceOptions.length
                ? powerPreferenceIndex.current + 1
                : 0;

            setGameSettings({
              ...gameSettings,
              powerPreference:
                powerPreferenceOptions[powerPreferenceIndex.current],
            });
          }}
        />
        <SettingsField
          buttonLabel={"performance display"}
          fieldLabel={gameSettings.performanceDisplay ? "on" : "off"}
          onClickAction={() =>
            setGameSettings({
              ...gameSettings,
              performanceDisplay: !gameSettings.performanceDisplay,
            })
          }
        />
        <SettingsField
          buttonLabel={"stage shake"}
          fieldLabel={gameSettings.stageShake ? "on" : "off"}
          onClickAction={() =>
            setGameSettings({
              ...gameSettings,
              stageShake: !gameSettings.stageShake,
            })
          }
        />
      </div>
      <button
        className="button button-dark h-[32px] w-[192px]"
        onClick={() => {
          anime({
            ...BASE_SETTINGS_ANIMATION_PARAMS,
            opacity: 0,
            complete: () => setSettingsVisibility(false),
          });
        }}
      >
        confirm
      </button>
    </dialog>
  );
}
