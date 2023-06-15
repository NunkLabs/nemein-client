import { Graphics, PixiRef } from "@pixi/react";

import {
  STAGE_SIZE,
  STAGE_SPACER,
  HOLD_PANEL,
  GAME_PANEL,
  QUEUE_PANEL,
  BORDER_STYLE,
} from "./Utils";

export default function BorderGraphics() {
  return (
    <Graphics
      draw={(panelGraphics: PixiRef<typeof Graphics>) => {
        panelGraphics.clear();

        panelGraphics.lineStyle({
          width: BORDER_STYLE.WIDTH,
          color: BORDER_STYLE.COLOR,
          alignment: BORDER_STYLE.ALIGNMENT,
        });

        panelGraphics.drawRect(
          HOLD_PANEL.X,
          HOLD_PANEL.Y,
          HOLD_PANEL.WIDTH,
          HOLD_PANEL.HEIGHT
        );

        panelGraphics.drawRect(
          GAME_PANEL.X,
          GAME_PANEL.Y,
          GAME_PANEL.WIDTH,
          GAME_PANEL.HEIGHT
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
            QUEUE_PANEL.HEIGHT
          );
        }
      }}
    />
  );
}
