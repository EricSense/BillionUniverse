import { SCALE_STEPS } from "./catalog";
import { BILLION } from "./format";

/** Position on a log10 path from 1 person to 1 billion. */
export function scalePosition(people: number): number {
  const value = Math.max(1, people);
  const min = Math.log10(1);
  const max = Math.log10(BILLION);
  return Math.min(1, Math.max(0, (Math.log10(value) - min) / (max - min)));
}

export function nextScaleStep(people: number): number {
  return SCALE_STEPS.find((step) => people < step) ?? BILLION;
}

export function previousScaleStep(people: number): number {
  const done = SCALE_STEPS.filter((step) => people >= step);
  return done[done.length - 1] ?? 0;
}
