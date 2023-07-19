import { useRef } from "react";

import { useGameStore } from "libs/Store";

const POWER_PREFERENCE_OPTIONS = {
  default: "default",
  "high-performance": "high performance",
  "low-power": "low power",
};

function OptionsField({
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

export default function SettingsPrompt({
  toggleOptions,
}: {
  toggleOptions: () => void;
}) {
  const gameOptions = useGameStore((state) => state.gameOptions);
  const updateGameOptions = useGameStore((state) => state.updateGameOptions);
  const updateGameStatus = useGameStore((state) => state.updateGameStatus);

  const powerPreferenceIndex = useRef<number>(0);

  return (
    <dialog
      className="z-[55] grid h-[360px] w-[480px] place-items-center gap-y-1
        rounded border-4 border-slate-100 bg-slate-100 text-center"
      id="settings-prompt"
    >
      <p className="text-3xl font-bold text-slate-800">settings</p>
      <div className="grid grid-rows-5 gap-y-1">
        <OptionsField
          buttonLabel={"game mode"}
          fieldLabel={gameOptions.gameMode}
          onClickAction={() =>
            updateGameOptions({
              gameMode:
                gameOptions.gameMode === "classic" ? "nemein" : "classic",
            })
          }
        />
        <OptionsField
          buttonLabel={"antialias"}
          fieldLabel={gameOptions.antialias ? "on" : "off"}
          onClickAction={() =>
            updateGameOptions({
              antialias: !gameOptions.antialias,
            })
          }
        />
        <OptionsField
          buttonLabel={"power preference"}
          fieldLabel={POWER_PREFERENCE_OPTIONS[gameOptions.powerPreference]}
          onClickAction={() => {
            const powerPreferenceOptions = Object.keys(
              POWER_PREFERENCE_OPTIONS
            ) as ("default" | "high-performance" | "low-power")[];

            powerPreferenceIndex.current =
              powerPreferenceIndex.current + 1 < powerPreferenceOptions.length
                ? powerPreferenceIndex.current + 1
                : 0;

            updateGameOptions({
              powerPreference:
                powerPreferenceOptions[powerPreferenceIndex.current],
            });
          }}
        />
        <OptionsField
          buttonLabel={"performance display"}
          fieldLabel={gameOptions.performanceDisplay ? "on" : "off"}
          onClickAction={() =>
            updateGameOptions({
              performanceDisplay: !gameOptions.performanceDisplay,
            })
          }
        />
        <OptionsField
          buttonLabel={"stage shake"}
          fieldLabel={gameOptions.stageShake ? "on" : "off"}
          onClickAction={() =>
            updateGameOptions({
              stageShake: !gameOptions.stageShake,
            })
          }
        />
      </div>
      <button
        className="button button-dark h-[32px] w-[192px]"
        onClick={toggleOptions}
      >
        confirm
      </button>
    </dialog>
  );
}
