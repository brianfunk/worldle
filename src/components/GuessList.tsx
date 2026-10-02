import { MAX_GUESSES } from '../game/engine';
import { compassLabel } from '../game/geo';
import { formatDistance, type Unit } from '../game/units';
import type { Guess } from '../game/types';

interface Props {
  guesses: Guess[];
  showDirection: boolean;
  unit: Unit;
  onUnit: (u: Unit) => void;
}

export default function GuessList({ guesses, showDirection, unit, onUnit }: Props) {
  return (
    <section>
      <div className="hints-head">
        <span className="eyebrow">Guesses</span>
        <div className="seg seg-mini" role="radiogroup" aria-label="Distance unit">
          {(['mi', 'km'] as Unit[]).map((u) => (
            <button key={u} role="radio" aria-checked={unit === u} className={`seg-btn ${unit === u ? 'on' : ''}`} onClick={() => onUnit(u)}>
              {u}
            </button>
          ))}
        </div>
      </div>
    <ol className="guesses" aria-label="Guesses">
      {Array.from({ length: MAX_GUESSES }, (_, i) => {
        const g = guesses[i];
        if (!g) {
          return (
            <li key={i} className={`guess empty ${i === guesses.length ? 'next' : ''}`}>
              <span className="guess-n">{i + 1}</span>
              <span className="guess-hint">{i === guesses.length ? 'Click the map' : ''}</span>
            </li>
          );
        }
        const cls = g.win ? 'win' : g.hit ? 'hit' : 'miss';
        return (
          <li key={i} className={`guess ${cls}`}>
            <span className="guess-n">{i + 1}</span>
            <span className="guess-dist">{g.win ? 'Found it' : formatDistance(g.distanceKm, unit)}</span>
            {!g.win && showDirection && (
              <span className="guess-dir" title={`${Math.round(g.bearingDeg)}°`}>
                <svg viewBox="0 0 24 24" width="16" height="16" style={{ transform: `rotate(${g.bearingDeg}deg)` }} aria-hidden>
                  <path d="M12 3l6 12-6-3-6 3z" fill="currentColor" />
                </svg>
                {compassLabel(g.bearingDeg)}
              </span>
            )}
            <span className="guess-radius">{g.win ? '' : `${formatDistance(g.radiusKm, unit)} ring`}</span>
          </li>
        );
      })}
    </ol>
    </section>
  );
}
