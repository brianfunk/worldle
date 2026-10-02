import { dateForDay } from '../game/daily';
import { stats, type DayResult } from '../game/storage';

interface Props {
  today: number;
  current: number;
  results: Record<number, DayResult>;
  onPlay: (day: number) => void;
  onClose: () => void;
}

const fmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

export default function ArchivePanel({ today, current, results, onPlay, onClose }: Props) {
  const { played, won, streak } = stats(results);
  const days = Array.from({ length: today }, (_, i) => today - i);
  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet archive" role="dialog" aria-modal="true" aria-labelledby="archive-title" onClick={(e) => e.stopPropagation()}>
        <div className="archive-head">
          <h2 id="archive-title" className="display">Archive</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        <dl className="stat-row">
          <div><dt>Played</dt><dd>{played}</dd></div>
          <div><dt>Won</dt><dd>{played ? Math.round((won / played) * 100) : 0}%</dd></div>
          <div><dt>Streak</dt><dd>{streak}</dd></div>
        </dl>
        <ul className="archive-list">
          {days.map((d) => {
            const r = results[d];
            return (
              <li key={d}>
                <button className={`archive-row ${d === current ? 'current' : ''} ${r ? r.status : ''}`} onClick={() => onPlay(d)}>
                  <span className="archive-num">#{d}</span>
                  <span className="archive-date">{d === today ? 'Today' : fmt.format(dateForDay(d))}</span>
                  {r ? (
                    <span className="marks small" aria-label={r.status === 'won' ? `Won in ${r.marks.length}` : 'Lost'}>
                      {r.marks.map((m, i) => <span key={i} className={`mark ${m}`} />)}
                    </span>
                  ) : (
                    <span className="archive-status">{d === current ? 'In play' : 'Not played'}</span>
                  )}
                  <span className="archive-score">{r ? (r.status === 'won' ? `${r.marks.length}/6` : 'X/6') : ''}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
