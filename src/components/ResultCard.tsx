import { useState } from 'react';
import { closestKm, MAX_GUESSES } from '../game/engine';
import { formatDistance, type Unit } from '../game/units';
import { shareOrCopy, shareText } from '../game/share';
import type { GameState, MapMode } from '../game/types';
import { CATEGORY_LABEL } from './HintPanel';

interface Props {
  state: GameState;
  mode: MapMode;
  day: number;
  today: number;
  streak: number;
  unit: Unit;
  onArchive: () => void;
  onPlayDay: (day: number) => void;
  onDismiss: () => void;
}

export default function ResultCard({ state, mode, day, today, streak, unit, onArchive, onPlayDay, onDismiss }: Props) {
  const [note, setNote] = useState<string | null>(null);
  const won = state.status === 'won';
  const t = state.target;
  const closest = closestKm(state);

  async function share() {
    const result = await shareOrCopy(shareText(state, mode, day, unit));
    setNote(result === 'copied' ? 'Copied to clipboard' : result === 'shared' ? 'Shared' : 'Could not share');
    setTimeout(() => setNote(null), 2000);
  }

  const prev = day > 1 ? day - 1 : null;

  return (
    <div className="scrim" onClick={onDismiss}>
      <div className="sheet result" role="dialog" aria-modal="true" aria-labelledby="result-title" onClick={(e) => e.stopPropagation()}>
        <p className="eyebrow">{won ? `Found in ${state.guesses.length} of ${MAX_GUESSES}` : 'Out of guesses'}</p>
        <h2 id="result-title" className="display">{t.title}</h2>
        <p className="result-cat">{CATEGORY_LABEL[t.category]}</p>
        <ul className="marks" aria-label="Your guesses">
          {state.guesses.map((g, i) => (
            <li key={i} className={`mark ${g.win ? 'win' : g.hit ? 'hit' : 'miss'}`} />
          ))}
          {Array.from({ length: MAX_GUESSES - state.guesses.length }, (_, i) => (
            <li key={`e${i}`} className="mark empty" />
          ))}
        </ul>
        <p className="result-fact">{t.fact}</p>
        <dl className="stat-row">
          {!won && closest !== null && (
            <div><dt>Closest</dt><dd>{formatDistance(closest, unit)}</dd></div>
          )}
          <div><dt>Puzzle</dt><dd>#{day}{day === today ? ' · today' : ''}</dd></div>
          <div><dt>Streak</dt><dd>{streak}</dd></div>
        </dl>
        <div className="actions">
          <button className="btn btn-primary" onClick={share}>Share result</button>
          {prev && (
            <button className="btn" onClick={() => onPlayDay(prev)}>Play #{prev}</button>
          )}
          <button className="btn btn-ghost" onClick={onArchive}>Archive</button>
        </div>
        <button className="btn-link" onClick={onDismiss}>Back to the map</button>
        <div className="note" aria-live="polite">{note}</div>
      </div>
    </div>
  );
}
