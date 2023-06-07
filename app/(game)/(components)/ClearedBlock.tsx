import { Sprite, useTick } from "@pixi/react";
import { useMemo, useState, useRef } from "react";

import {
  GAME_PANEL,
  TETROMINO_STYLES,
  TetrominoType,
  randomFloatInRange,
} from "./Utils";

type ClearedBlockProps = {
  type: TetrominoType;
  initialXDisplacement: number;
  initialYDisplacement: number;
};

type SpriteProperties = {
  alpha: number;
  position: [number, number];
  scale: number;
};

const ANIMATION_SPEED_MULTIPLIER = 5;

/* Max animation duration in seconds */
const MAX_ANIMATION_DURATION_S = 3;

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
}: ClearedBlockProps) {
  const time = useRef<number>(0);
  const progress = useRef<number>(0);

  const [spriteProperties, setSpriteProperties] = useState<SpriteProperties>({
    alpha: 1,
    position: [initialXDisplacement, initialYDisplacement],
    scale: 1,
  });

  /* Randomizes max displacements relative to the block size */
  const maxXDisplacement = useMemo(
    () =>
      GAME_PANEL.CHILD *
      randomFloatInRange(
        HORIZONTAL_DISPLACEMENT_FLOOR,
        HORIZONTAL_DISPLACEMENT_CEILING
      ),
    []
  );
  const maxYDisplacement = useMemo(
    () =>
      GAME_PANEL.CHILD *
      randomFloatInRange(
        VERTICAL_DISPLACEMENT_FLOOR,
        VERTICAL_DISPLACEMENT_CEILING
      ),
    []
  );

  /**
   * From the 2nd kinematic equation s = u t - 0.5 a t ^ 2
   * and the 3rd kinematic equation, v ^ 2 = u ^ 2 + 2 a s
   * we can derive that u = 4 s for t = 1.
   */
  const velocity = 4 * maxYDisplacement;

  /**
   * Acceleration is a = (-v - v) / 2,
   * where initial velocity is v and final velocity is -v.
   * With this, a = -2 v for t = 1.
   */
  const acceleration = -2 * velocity;

  /**
   * Randomizes the size that the block scales to at the end of the animation,
   * where approximately 20% will grow and the rest will shrink to simulate
   * a 3D effect
   */
  const maxScale = useMemo(
    () =>
      Math.random() < MINORITY_RATIO
        ? randomFloatInRange(MINORITY_SCALE_FLOOR, MINORITY_SCALE_CEILING)
        : randomFloatInRange(MAJORITY_SCALE_FLOOR, MAJORITY_SCALE_CEILING),
    []
  );

  useTick((delta, ticker) => {
    if (time.current > MAX_ANIMATION_DURATION_S) return;

    /* Tracks the current animation progress */
    progress.current = parseFloat(
      (time.current / MAX_ANIMATION_DURATION_S).toFixed(2)
    );

    const verticalDisplacement =
      time.current * velocity + 0.5 * acceleration * Math.pow(time.current, 2);

    const currentXPosition =
      initialXDisplacement + maxXDisplacement * progress.current;

    const currentYPosition = initialYDisplacement - verticalDisplacement;

    setSpriteProperties({
      alpha: progress.current > 1 ? 0 : 1 - progress.current,
      position: [currentXPosition, currentYPosition],
      scale: 1 + progress.current * maxScale,
    });

    /**
     * deltaMS is the time elapsed from the last frame to the next frame
     * in milliseconds. This value is approximately 1 divided by FPS value.
     * We multiply it with 0.001 to convert it to seconds.
     */
    time.current += ticker.deltaMS * 0.001 * ANIMATION_SPEED_MULTIPLIER;
  });

  return (
    <Sprite
      alpha={spriteProperties.alpha}
      height={GAME_PANEL.CHILD * spriteProperties.scale}
      width={GAME_PANEL.CHILD * spriteProperties.scale}
      position={spriteProperties.position}
      image={"/textures/blank.svg"}
      tint={TETROMINO_STYLES[TetrominoType[type]]}
    />
  );
}
