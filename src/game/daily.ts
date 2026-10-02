import type { Target } from './types';

/** Day 1. Local-midnight based so everyone in a timezone flips at midnight. */
export const EPOCH = new Date(2026, 8, 1); // 1 Sep 2026

export function dayNumber(now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today.getTime() - EPOCH.getTime()) / 86_400_000) + 1;
}

/** Small, fast, deterministic PRNG. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A fixed shuffle of the target list so consecutive days are not adjacent in
 * the file; day N maps to position (N-1) mod length in that order.
 * Adding targets to the end of the list changes future days only if length
 * changes the modulus; acceptable for a no-storage game.
 */
export function dailyOrder<T>(items: readonly T[], seed = 20261001): T[] {
  const rnd = mulberry32(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function dailyTarget(targets: readonly Target[], day: number): Target {
  const order = dailyOrder(targets);
  const idx = (((day - 1) % order.length) + order.length) % order.length;
  return order[idx];
}

export function dateForDay(day: number): Date {
  return new Date(EPOCH.getFullYear(), EPOCH.getMonth(), EPOCH.getDate() + day - 1);
}
