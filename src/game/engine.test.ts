import { describe, expect, it } from 'vitest';
import { applyClick, MAX_GUESSES, MAX_RADIUS_KM, MIN_RADIUS_KM, newGame, replay } from './engine';
import { bearingDeg, circlePolygon, compassLabel, distanceKm } from './geo';
import { dailyTarget, dateForDay, dayNumber, EPOCH } from './daily';
import { shareText } from './share';
import type { Target } from './types';

const eiffel: Target = {
  id: 'eiffel',
  title: 'Eiffel Tower',
  category: 'landmark',
  lon: 2.2945,
  lat: 48.8582,
  winRadiusKm: 2,
  hints: ['a', 'b', 'c', 'd', 'e', 'f'],
  fact: 'f',
};

describe('geo', () => {
  it('measures Paris to London at about 344 km', () => {
    expect(distanceKm([2.3522, 48.8566], [-0.1276, 51.5072])).toBeCloseTo(343.5, 0);
  });
  it('bearing from equator north is 0, east is 90', () => {
    expect(bearingDeg([0, 0], [0, 10])).toBeCloseTo(0, 5);
    expect(bearingDeg([0, 0], [10, 0])).toBeCloseTo(90, 5);
    expect(compassLabel(350)).toBe('N');
    expect(compassLabel(130)).toBe('SE');
  });
  it('circle polygon closes and stays unwrapped across the antimeridian', () => {
    const ring = circlePolygon([179.5, 0], 500);
    expect(ring[0]).toEqual(ring[ring.length - 1]);
    const lons = ring.map((p) => p[0]);
    expect(Math.max(...lons) - Math.min(...lons)).toBeLessThan(20);
  });
});

describe('engine', () => {
  it('first guess far away draws a capped green circle and reveals a hint', () => {
    const r = applyClick(newGame(eiffel), [-74, 40.7]); // NYC
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.guess.radiusKm).toBe(MAX_RADIUS_KM);
    expect(r.guess.hit).toBe(false); // 5,800 km away, outside the 5,000 km cap
    expect(r.state.hintsRevealed).toBe(2);
    expect(r.state.greenRadiusKm).toBeNull();
  });
  it('a nearer guess is green and shrinks the cap', () => {
    const r = applyClick(newGame(eiffel), [4.9, 52.37]); // Amsterdam ~430 km
    expect(r.ok && r.guess.hit).toBe(true);
    if (!r.ok) return;
    expect(r.state.greenRadiusKm).toBeCloseTo(r.guess.distanceKm * 3, 5);
    const r2 = applyClick(r.state, [2.35, 48.86]); // central Paris, 4 km
    expect(r2.ok && r2.guess.radiusKm).toBe(MIN_RADIUS_KM);
  });
  it('rejects clicks outside the green circle and inside red circles', () => {
    const g = applyClick(newGame(eiffel), [4.9, 52.37]); // Amsterdam: green, r ~1290 km, cap ~645
    if (!g.ok) throw new Error();
    expect(applyClick(g.state, [-74, 40.7])).toEqual({ ok: false, reason: 'outside-green' });
    const red = applyClick(g.state, [13.4, 52.5]); // Berlin: 878 km from target > cap -> red
    if (!red.ok) throw new Error();
    expect(red.guess.hit).toBe(false);
    expect(red.state.greenRadiusKm).toBe(g.state.greenRadiusKm);
    expect(applyClick(red.state, [13.0, 52.0])).toEqual({ ok: false, reason: 'inside-red' });
    expect(red.state.hintsRevealed).toBe(3);
  });
  it('wins inside the win radius and reveals all hints', () => {
    const r = applyClick(newGame(eiffel), [2.2945, 48.8582]);
    expect(r.ok && r.state.status).toBe('won');
    expect(r.ok && r.state.hintsRevealed).toBe(6);
    expect(r.ok && r.guess.win).toBe(true);
  });
  it('loses after six non-winning guesses', () => {
    let s = newGame(eiffel);
    // walk around inside valid territory far from the target
    const pts: [number, number][] = [
      [-30, 48], [-10, 48], [-5, 48], [-3, 48], [-2, 48], [-1.5, 48],
    ];
    let count = 0;
    for (const p of pts) {
      const r = applyClick(s, p);
      if (r.ok) {
        s = r.state;
        count++;
      }
    }
    expect(count).toBeLessThanOrEqual(MAX_GUESSES);
    if (count === MAX_GUESSES) expect(s.status).toBe('lost');
    expect(applyClick(s, [2.3, 48.8]).ok).toBe(s.status === 'playing');
  });
});

describe('replay', () => {
  it('rebuilds state and skips invalid clicks', () => {
    const s = replay(eiffel, [[4.9, 52.37], [-74, 40.7], [2.2945, 48.8582]]);
    expect(s.guesses.length).toBe(2);
    expect(s.status).toBe('won');
  });
});

describe('daily', () => {
  it('day 1 is the epoch date and increments daily', () => {
    expect(dayNumber(EPOCH)).toBe(1);
    expect(dayNumber(new Date(2026, 8, 2, 23, 59))).toBe(2);
    expect(dateForDay(31).getDate()).toBe(1); // 1 Oct
  });
  it('is deterministic and cycles', () => {
    const list = Array.from({ length: 10 }, (_, i) => ({ ...eiffel, id: `t${i}` }));
    expect(dailyTarget(list, 3)).toBe(dailyTarget(list, 3));
    expect(dailyTarget(list, 1).id).toBe(dailyTarget(list, 11).id);
    const ids = new Set(Array.from({ length: 10 }, (_, i) => dailyTarget(list, i + 1).id));
    expect(ids.size).toBe(10);
  });
});

describe('share', () => {
  it('formats a win and a loss', () => {
    let s = newGame(eiffel);
    for (const p of [[4.9, 52.37], [2.2945, 48.8582]] as [number, number][]) {
      const r = applyClick(s, p);
      if (r.ok) s = r.state;
    }
    expect(shareText(s, 'hard', 12)).toBe('WORLDle #12 2/6 🌍 Hard\n🟢⭐\nhttps://worldle.world');
    const lost = { ...s, status: 'lost' as const, guesses: s.guesses.map((g) => ({ ...g, win: false, hit: false })) };
    expect(shareText(lost, 'easy', 3).split('\n')[0]).toBe('WORLDle #3 X/6 🌍 Easy');
    expect(shareText(lost, 'easy', 3)).toContain('Closest: ');
  });
});
