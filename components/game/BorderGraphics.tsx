import { Graphics, PixiRef } from "@pixi/react";

import { useGameStore } from "libs/Store";
import {
  STAGE_SIZE,
  STAGE_SPACER,
  HOLD_PANEL,
  GAME_PANEL,
  QUEUE_PANEL,
  BASE_STYLE,
  BORDER_STYLE,
} from "./Misc";

export default function BorderGraphics() {
  const gameTheme = useGameStore((state) => state.gameTheme);
  return (
    <Graphics
      draw={(panelGraphics: PixiRef<typeof Graphics>) => {
        panelGraphics.clear();

        panelGraphics.lineStyle({
          alignment: BORDER_STYLE.ALIGNMENT,
          color:
            gameTheme === "light"
              ? BASE_STYLE.LIGHT.PRIMARY
              : BASE_STYLE.DARK.PRIMARY,
          width: BORDER_STYLE.WIDTH,
        });

        panelGraphics.drawRect(
          HOLD_PANEL.X,
          HOLD_PANEL.Y,
          HOLD_PANEL.WIDTH,
          HOLD_PANEL.HEIGHT,
        );

        panelGraphics.drawRect(
          GAME_PANEL.X,
          GAME_PANEL.Y,
          GAME_PANEL.WIDTH,
          GAME_PANEL.HEIGHT,
        );

        for (
          let queuePanelYCoord = QUEUE_PANEL.Y;
          queuePanelYCoord + QUEUE_PANEL.HEIGHT + STAGE_SPACER < STAGE_SIZE;
          queuePanelYCoord += QUEUE_PANEL.HEIGHT + STAGE_SPACER
        ) {
          panelGraphics.drawRect(
            QUEUE_PANEL.X,
            queuePanelYCoord,
            QUEUE_PANEL.WIDTH,
            QUEUE_PANEL.HEIGHT,
          );
        }
      }}
    />
  );
}
