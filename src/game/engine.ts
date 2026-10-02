import { bearingDeg, distanceKm, type LonLat } from './geo';
import type { GameState, Guess, Target } from './types';

export const MAX_GUESSES = 6;
/** Circle radius is this multiple of the distance to the target... */
export const RADIUS_FACTOR = 3;
/** ...never smaller than this... */
export const MIN_RADIUS_KM = 25;
/** ...and never larger than this on the first guess. */
export const MAX_RADIUS_KM = 5000;
/** Each later circle is at most this fraction of the current green circle. */
export const SHRINK = 0.5;

export function newGame(target: Target): GameState {
  return {
    target,
    guesses: [],
    greenRadiusKm: null,
    greenCenter: null,
    status: 'playing',
    hintsRevealed: 1,
  };
}

export type ClickResult =
  | { ok: true; state: GameState; guess: Guess }
  | { ok: false; reason: 'outside-green' | 'inside-red' | 'finished' };

export const INVALID_MESSAGES: Record<Exclude<ClickResult, { ok: true }>['reason'], string> = {
  'outside-green': 'Stay inside the green circle',
  'inside-red': 'That area is already ruled out',
  finished: 'Game over',
};

export function radiusCap(state: GameState): number {
  return state.greenRadiusKm === null ? MAX_RADIUS_KM : state.greenRadiusKm * SHRINK;
}

export function applyClick(state: GameState, point: LonLat): ClickResult {
  if (state.status !== 'playing') return { ok: false, reason: 'finished' };

  const targetPt: LonLat = [state.target.lon, state.target.lat];

  if (state.greenCenter && state.greenRadiusKm !== null) {
    if (distanceKm(state.greenCenter, point) > state.greenRadiusKm) {
      return { ok: false, reason: 'outside-green' };
    }
  }
  for (const g of state.guesses) {
    if (!g.hit && distanceKm([g.lon, g.lat], point) <= g.radiusKm) {
      return { ok: false, reason: 'inside-red' };
    }
  }

  const d = distanceKm(point, targetPt);
  const win = d <= state.target.winRadiusKm;
  const cap = radiusCap(state);
  const radius = win ? 0 : Math.min(cap, Math.max(MIN_RADIUS_KM, d * RADIUS_FACTOR));
  const hit = win || d <= radius;

  const guess: Guess = {
    lon: point[0],
    lat: point[1],
    distanceKm: d,
    bearingDeg: bearingDeg(point, targetPt),
    radiusKm: radius,
    hit,
    win,
  };

  const guesses = [...state.guesses, guess];
  const lost = !win && guesses.length >= MAX_GUESSES;
  const status = win ? 'won' : lost ? 'lost' : 'playing';

  return {
    ok: true,
    guess,
    state: {
      ...state,
      guesses,
      greenRadiusKm: hit && !win ? radius : state.greenRadiusKm,
      greenCenter: hit && !win ? point : state.greenCenter,
      status,
      hintsRevealed:
        status === 'playing'
          ? Math.min(state.target.hints.length, state.hintsRevealed + 1)
          : state.target.hints.length,
    },
  };
}

/** Rebuild a game from a list of stored clicks (invalid ones are skipped). */
export function replay(target: Target, clicks: LonLat[]): GameState {
  let state = newGame(target);
  for (const c of clicks) {
    const r = applyClick(state, c);
    if (r.ok) state = r.state;
  }
  return state;
}

export function closestKm(state: GameState): number | null {
  if (!state.guesses.length) return null;
  return Math.min(...state.guesses.map((g) => g.distanceKm));
}
