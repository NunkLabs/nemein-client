import { Text, useTick } from "@pixi/react";
import { TextStyle } from "pixi.js";
import { useMemo, useState, useRef } from "react";

import { DAMAGE_TYPE_STYLES, DmgType, ClearRecord } from "./Misc";

type TextProperties = {
  alpha: number;
  scale: number;
};

/* Timer multiplier to control the speed of the animation */
const ANIMATION_TIMER_MULTIPLIER = 3;

/* Max animation duration in seconds */
const ANIMATION_DURATION_S = 3;

/* Anchor value to set the origin point of the sprite */
const SPRITE_ANCHOR = 0.5;

/* Offsets values for the damage number position */
const DAMAGE_NUMBER_X_OFFSET = -50;
const DAMAGE_NUMBER_Y_OFFSET = 0;

/* Float values for max scale */
const DAMAGE_NUMBER_MAX_SCALE = 0.1;
const DAMAGE_NUMBER_CRIT_SCALE = 0.15;

/* Sprite render delay in milliseconds */
const BASE_RENDER_DELAY_MS = 100;

export default function DamageNumbers({
  clearRecord,
  delayMultiplier,
  initialXDisplacement,
  initialYDisplacement,
}: {
  clearRecord: ClearRecord;
  delayMultiplier: number;
  initialXDisplacement: number;
  initialYDisplacement: number;
}) {
  const time = useRef<number>(0);
  const progress = useRef<number>(0);

  /* Memoizes the base properties */
  const baseProperties = useMemo(
    () => ({
      x: DAMAGE_NUMBER_X_OFFSET + initialXDisplacement,
      y: DAMAGE_NUMBER_Y_OFFSET + initialYDisplacement,
      scale: clearRecord.wasCrit
        ? DAMAGE_NUMBER_MAX_SCALE + DAMAGE_NUMBER_CRIT_SCALE
        : DAMAGE_NUMBER_MAX_SCALE,
      renderDelay: BASE_RENDER_DELAY_MS * delayMultiplier,
    }),
    [clearRecord, delayMultiplier, initialXDisplacement, initialYDisplacement]
  );

  const [textProperties, setTextProperties] = useState<TextProperties>({
    alpha: 1,
    scale: 1,
  });

  /**
   * The animation progressing logic is the same as ClearedBlock
   * {@see ClearedBlock}
   */
  useTick((delta, ticker) => {
    const renderTimeout = setTimeout(() => {
      if (time.current > ANIMATION_DURATION_S) {
        setTextProperties({
          alpha: 0,
          scale: 1,
        });

        clearTimeout(renderTimeout);

        return;
      }

      progress.current = time.current / ANIMATION_DURATION_S;

      setTextProperties({
        alpha: 1 - progress.current,
        scale: 1 + progress.current * baseProperties.scale,
      });

      time.current += ticker.deltaMS * 0.001 * ANIMATION_TIMER_MULTIPLIER;
    }, baseProperties.renderDelay);
  });

  return (
    <Text
      alpha={textProperties.alpha}
      anchor={SPRITE_ANCHOR}
      position={[baseProperties.x, baseProperties.y]}
      scale={textProperties.scale}
      style={
        new TextStyle({
          align: "center",
          fill: DAMAGE_TYPE_STYLES[
            DmgType[clearRecord.dmgDealt.dominantDmgType]
          ],
          fontWeight: "bold",
          fontSize: 35,
        })
      }
      text={clearRecord.dmgDealt.value.toString()}
    />
  );
}
