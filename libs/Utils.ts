import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @brief: cn: Merges Tailwind classes efficiently and prevents style conflicts
 * @param:  {ClassValue[]}  inputs   The class value array
 * @return: {string}                 The resulting class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * @brief: randomFloatInRange: Randomizes a float in range
 * @param  {number}   min   The minimum float
 * @param  {number}   max   The maximum float
 * @return {number}         The random float rounded to the nearest hundredth
 */
export function randomFloatInRange(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}
