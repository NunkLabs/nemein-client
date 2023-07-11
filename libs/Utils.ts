/**
 * @brief: randomFloatInRange: Randomizes a float in range
 * @param  {number}   min   The minimum float
 * @param  {number}   max   The maximum float
 * @return {number}         The random float rounded to the nearest hundredth
 */
export function randomFloatInRange(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}
