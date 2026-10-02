import type { LonLat } from './geo';
import type { MapMode } from './types';
import type { Unit } from './units';

/**
 * Everything the browser remembers lives here, in localStorage.
 * Reads and writes are wrapped so private windows or blocked storage
 * simply behave like a fresh visitor.
 */
const PREFS = 'worldle.prefs.v1';
const RESULTS = 'worldle.results.v1';
const PROGRESS = 'worldle.progress.v1';

export interface Prefs {
  mode: MapMode;
  unit?: Unit;
}

export type Mark = 'hit' | 'miss' | 'win';

export interface DayResult {
  status: 'won' | 'lost';
  marks: Mark[];
  closestKm: number;
  mode: MapMode;
  playedAt: string; // ISO date
}

export interface Progress {
  clicks: LonLat[];
  basemapId: string;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...(JSON.parse(raw) as T) } : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export const loadPrefs = () => read<Prefs>(PREFS, { mode: 'easy' });
export const savePrefs = (p: Prefs) => write(PREFS, p);

export const loadResults = () => read<Record<number, DayResult>>(RESULTS, {});
export function saveResult(day: number, r: DayResult) {
  const all = loadResults();
  all[day] = r;
  write(RESULTS, all);
  return all;
}

export const loadProgress = (day: number): Progress | null => read<Record<number, Progress>>(PROGRESS, {})[day] ?? null;
export function saveProgress(day: number, p: Progress) {
  const all = read<Record<number, Progress>>(PROGRESS, {});
  all[day] = p;
  write(PROGRESS, all);
}

export function stats(results: Record<number, DayResult>) {
  const list = Object.entries(results)
    .map(([d, r]) => [Number(d), r] as const)
    .sort((a, b) => a[0] - b[0]);
  const played = list.length;
  const won = list.filter(([, r]) => r.status === 'won').length;
  // current streak counted backwards over consecutive day numbers
  let streak = 0;
  for (let i = list.length - 1; i >= 0; i--) {
    const [d, r] = list[i];
    if (r.status !== 'won') break;
    if (i < list.length - 1 && list[i + 1][0] !== d + 1) break;
    streak++;
  }
  return { played, won, streak };
}
