import { closestKm, MAX_GUESSES } from './engine';
import { formatDistance, type Unit } from './units';
import type { GameState, MapMode } from './types';

export const SITE_URL = 'https://worldle.world';

const MODE_LABEL: Record<MapMode, string> = { easy: 'Easy', hard: 'Hard', random: 'Random' };

export function shareText(state: GameState, mode: MapMode, day: number, unit: Unit = 'km'): string {
  const head = `WORLDle #${day}`;
  const score = state.status === 'won' ? `${state.guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  const row = state.guesses.map((g) => (g.win ? '⭐' : g.hit ? '🟢' : '🔴')).join('');
  const closest = closestKm(state);
  const lines = [`${head} ${score} 🌍 ${MODE_LABEL[mode]}`, row];
  if (closest !== null && state.status !== 'won') lines.push(`Closest: ${formatDistance(closest, unit)}`);
  lines.push(SITE_URL);
  return lines.join('\n');
}

export type ShareOutcome = 'shared' | 'copied' | 'failed';

export async function shareOrCopy(text: string): Promise<ShareOutcome> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ text });
      return 'shared';
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return 'failed';
      // fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}
