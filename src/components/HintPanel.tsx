import type { Category, Target } from '../game/types';

interface Props {
  target: Target;
  revealed: number;
  finished: boolean;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  landmark: 'Landmark',
  city: 'City',
  nature: 'Natural wonder',
};

export default function HintPanel({ target, revealed, finished }: Props) {
  const shownCount = finished ? target.hints.length : revealed;
  return (
    <section className="hints" aria-live="polite">
      <div className="hints-head">
        <span className="eyebrow">{CATEGORY_LABEL[target.category]}</span>
        <span className="hints-count">
          Clue {shownCount} of {target.hints.length}
        </span>
      </div>
      <ol className="hint-list">
        {target.hints.map((h, i) => {
          const shown = i < shownCount;
          const latest = i === shownCount - 1 && !finished;
          return (
            <li key={i} className={`hint ${shown ? 'shown' : 'locked'} ${latest ? 'latest' : ''}`}>
              <span className="hint-n">{i + 1}</span>
              {shown ? (
                <span className="hint-text">{h}</span>
              ) : (
                <span className="hint-lock" aria-label="Locked clue">
                  <span className="redact" style={{ width: `${40 + ((h.length * 7) % 50)}%` }} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
