interface Props {
  day: number;
  today: number;
  onArchive: () => void;
  onHelp: () => void;
  onHome: () => void;
}

export default function TopBar({ day, today, onArchive, onHelp, onHome }: Props) {
  return (
    <div className="topbar">
      <button className="brand" onClick={onHome} title={day === today ? 'About WORLDle' : "Back to today's puzzle"}>
        <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden>
          <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M16 3v26M3 16h26M7 8.5c5 3 13 3 18 0M7 23.5c5-3 13-3 18 0" fill="none" stroke="currentColor" strokeWidth="1.6" opacity=".55" />
          <circle cx="21" cy="11" r="3" fill="var(--accent)" />
        </svg>
        <span className="brand-name">WORLDle</span>
        <span className="brand-day">
          #{day}
          {day !== today && <span className="brand-archive">archive</span>}
        </span>
      </button>
      <div className="topbar-actions">
        <button className="icon-btn" onClick={onArchive} aria-label="Archive and stats" title="Archive">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
            <rect x="3" y="5" width="18" height="16" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <button className="icon-btn" onClick={onHelp} aria-label="How to play" title="How to play">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M9.6 9.5a2.4 2.4 0 1 1 3.4 2.2c-.7.4-1 .9-1 1.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="16.8" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}
