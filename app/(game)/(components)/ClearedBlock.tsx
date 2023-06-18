import { Sprite, useTick } from "@pixi/react";
import { useMemo, useState, useRef } from "react";

import {
  GAME_PANEL,
  TETROMINO_STYLES,
  TetrominoType,
  randomFloatInRange,
} from "./Utils";

type SpriteProperties = {
  alpha: number;
  position: [number, number];
  rotation: number;
  scale: number;
};

/* Timer multiplier to control the speed of the animation */
const ANIMATION_TIMER_MULTIPLIER = 5;

/* Max animation duration in seconds */
const ANIMATION_DURATION_S = 3;

/* Anchor value to set the origin point of the sprite */
const SPRITE_ANCHOR = 0;

/* Float ranges for radian rotation values */
const RADIAN_ROTATION_FLOOR = -3.5;
const RADIAN_ROTATION_CEIL = 3.5;

/* Float ranges for displacement values */
const HORIZONTAL_DISPLACEMENT_FLOOR = -2.5;
const HORIZONTAL_DISPLACEMENT_CEILING = 2.5;
const VERTICAL_DISPLACEMENT_FLOOR = 0.5;
const VERTICAL_DISPLACEMENT_CEILING = 1.5;

/* Float ranges for scale values */
const MINORITY_RATIO = 0.2;
const MINORITY_SCALE_FLOOR = 0;
const MINORITY_SCALE_CEILING = 0.15;
const MAJORITY_SCALE_FLOOR = -0.25;
const MAJORITY_SCALE_CEILING = 0;

export default function ClearedBlock({
  type,
  initialXDisplacement,
  initialYDisplacement,
}: {
  type: TetrominoType;
  initialXDisplacement: number;
  initialYDisplacement: number;
}) {
  const time = useRef<number>(0);
  const progress = useRef<number>(0);

  const baseProperties = useMemo(
    () => ({
      /**
       * Randomizes final displacement values relative to the block's size, and
       * the final radian rotation value
       */
      xDisplacement:
        GAME_PANEL.CHILD *
        randomFloatInRange(
          HORIZONTAL_DISPLACEMENT_FLOOR,
          HORIZONTAL_DISPLACEMENT_CEILING
        ),
      yDisplacement:
        GAME_PANEL.CHILD *
        randomFloatInRange(
          VERTICAL_DISPLACEMENT_FLOOR,
          VERTICAL_DISPLACEMENT_CEILING
        ),
      rotation: randomFloatInRange(RADIAN_ROTATION_FLOOR, RADIAN_ROTATION_CEIL),
      /**
       * Randomizes the block scaling, where approximately 20% will grow and
       * the rest will shrink to simulate a 3D effect
       */
      scale:
        Math.random() < MINORITY_RATIO
          ? randomFloatInRange(MINORITY_SCALE_FLOOR, MINORITY_SCALE_CEILING)
          : randomFloatInRange(MAJORITY_SCALE_FLOOR, MAJORITY_SCALE_CEILING),
    }),
    []
  );

  const [spriteProperties, setSpriteProperties] = useState<SpriteProperties>({
    alpha: 1,
    position: [initialXDisplacement, initialYDisplacement],
    rotation: 0,
    scale: 1,
  });

  /**
   * From the 2nd kinematic equation s = u t - 0.5 a t ^ 2
   * and the 3rd kinematic equation, v ^ 2 = u ^ 2 + 2 a s
   * we can derive that u = 4 s for t = 1.
   */
  const velocity = 4 * baseProperties.yDisplacement;

  /**
   * Acceleration is a = (-v - v) / 2,
   * where initial velocity is v and final velocity is -v.
   * With this, a = -2 v for t = 1.
   */
  const acceleration = -2 * velocity;

  useTick((delta, ticker) => {
    if (time.current > ANIMATION_DURATION_S) {
      /* Resets and ensures the sprite is hidden until it's detached */
      setSpriteProperties({
        alpha: 0,
        position: [initialXDisplacement, initialYDisplacement],
        rotation: 0,
        scale: 1,
      });

      return;
    }

    /* Tracks the current animation progress */
    progress.current = time.current / ANIMATION_DURATION_S;

    /**
     * Calculates the current X position
     * We use the original X position plus the current displacement based on the
     * animation progress
     */
    const currentXPosition =
      initialXDisplacement + baseProperties.xDisplacement * progress.current;

    /**
     * Calculates the current Y position
     * We get the current Y displacement with the 2nd kinematic equation,
     * then we use the original Y position minus the current displacement
     */
    const currentYDisplacement =
      time.current * velocity + 0.5 * acceleration * Math.pow(time.current, 2);
    const currentYPosition = initialYDisplacement - currentYDisplacement;

    setSpriteProperties({
      alpha: 1 - progress.current,
      position: [currentXPosition, currentYPosition],
      rotation: progress.current * baseProperties.rotation,
      scale: 1 + progress.current * baseProperties.scale,
    });

    /**
     * deltaMS is the time elapsed from the last frame to the next frame
     * in milliseconds. This value is approximately 1 divided by FPS value.
     * We multiply it with 0.001 to convert it to seconds.
     */
    time.current += ticker.deltaMS * 0.001 * ANIMATION_TIMER_MULTIPLIER;
  });

  return (
    <Sprite
      alpha={spriteProperties.alpha}
      anchor={SPRITE_ANCHOR}
      height={GAME_PANEL.CHILD * spriteProperties.scale}
      width={GAME_PANEL.CHILD * spriteProperties.scale}
      position={spriteProperties.position}
      image={"/textures/blank.svg"}
      rotation={spriteProperties.rotation}
      tint={TETROMINO_STYLES[TetrominoType[type]]}
    />
  );
}
