import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ArchivePanel from './components/ArchivePanel';
import GuessList from './components/GuessList';
import HelpModal from './components/HelpModal';
import HintPanel from './components/HintPanel';
import ModeSwitch from './components/ModeSwitch';
import ResultCard from './components/ResultCard';
import Toast from './components/Toast';
import TopBar from './components/TopBar';
import { dailyTarget, dayNumber } from './game/daily';
import { applyClick, closestKm, INVALID_MESSAGES, replay } from './game/engine';
import type { LonLat } from './game/geo';
import {
  loadPrefs, loadProgress, loadResults, savePrefs, saveProgress, saveResult, stats, type DayResult,
} from './game/storage';
import targetsJson from './game/targets.json';
import type { MapMode, Target } from './game/types';
import { defaultUnit, type Unit } from './game/units';
import MapView from './map/MapView';
import { BASEMAPS, HARD_LABELS_BELOW_KM, pickBasemap } from './map/styles';

const TARGETS = targetsJson as Target[];
const PARAMS = new URLSearchParams(window.location.search);
const FORCED_BASEMAP = PARAMS.get('map');

function requestedDay(today: number): number {
  const d = Number(PARAMS.get('d'));
  return Number.isInteger(d) && d > 0 && d <= today ? d : today;
}

interface Session {
  day: number;
  clicks: LonLat[];
  basemapId: string;
}

function openDay(day: number, mode: MapMode): Session {
  const saved = loadProgress(day);
  const basemapId =
    FORCED_BASEMAP && BASEMAPS[FORCED_BASEMAP]
      ? FORCED_BASEMAP
      : mode === 'random' && saved?.basemapId && saved.basemapId in BASEMAPS
        ? saved.basemapId
        : pickBasemap(mode).id;
  return { day, clicks: saved?.clicks ?? [], basemapId };
}

export default function App() {
  const today = useMemo(() => dayNumber(), []);
  const [mode, setMode] = useState<MapMode>(() => loadPrefs().mode);
  const [unit, setUnit] = useState<Unit>(() => loadPrefs().unit ?? defaultUnit());
  const [results, setResults] = useState<Record<number, DayResult>>(loadResults);
  const [session, setSession] = useState<Session>(() => openDay(requestedDay(today), loadPrefs().mode));
  const [toast, setToast] = useState<string | null>(null);
  const [overlay, setOverlay] = useState<'none' | 'result' | 'archive' | 'help'>(() =>
    Object.keys(loadResults()).length || loadProgress(requestedDay(today)) ? 'none' : 'help',
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);

  const target = useMemo(() => dailyTarget(TARGETS, session.day), [session.day]);
  const state = useMemo(() => replay(target, session.clicks), [target, session.clicks]);
  const finished = state.status !== 'playing';
  const basemap = BASEMAPS[session.basemapId];

  // Persist clicks and, when a game ends, the result.
  useEffect(() => {
    if (session.clicks.length) saveProgress(session.day, { clicks: session.clicks, basemapId: session.basemapId });
  }, [session]);
  useEffect(() => {
    if (!finished || results[session.day]) return;
    const r: DayResult = {
      status: state.status as 'won' | 'lost',
      marks: state.guesses.map((g) => (g.win ? 'win' : g.hit ? 'hit' : 'miss')),
      closestKm: closestKm(state) ?? 0,
      mode,
      playedAt: new Date().toISOString().slice(0, 10),
    };
    setResults(saveResult(session.day, r));
  }, [finished, state, session.day, mode, results]);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  }, []);

  const handleClick = useCallback(
    (point: LonLat) => {
      setSession((s) => {
        const current = replay(dailyTarget(TARGETS, s.day), s.clicks);
        const r = applyClick(current, point);
        if (!r.ok) {
          if (r.reason !== 'finished') flash(INVALID_MESSAGES[r.reason]);
          return s;
        }
        if (r.state.status !== 'playing') {
          // Let the fly-to animation land before the card appears.
          window.setTimeout(() => setOverlay('result'), 2600);
        }
        return { ...s, clicks: [...s.clicks, point] };
      });
      setSheetOpen(false);
    },
    [flash],
  );

  function changeMode(m: MapMode) {
    setMode(m);
    savePrefs({ ...loadPrefs(), mode: m });
    setSession((s) => {
      const id = FORCED_BASEMAP && BASEMAPS[FORCED_BASEMAP] ? FORCED_BASEMAP : pickBasemap(m, s.basemapId).id;
      return { ...s, basemapId: id };
    });
  }

  function changeUnit(u: Unit) {
    setUnit(u);
    savePrefs({ ...loadPrefs(), unit: u });
  }

  function goHome() {
    if (session.day !== today) playDay(today);
    else setOverlay('help');
  }

  function playDay(day: number) {
    setSession(openDay(day, mode));
    setOverlay('none');
    setSheetOpen(false);
    const url = new URL(window.location.href);
    if (day === today) url.searchParams.delete('d');
    else url.searchParams.set('d', String(day));
    window.history.replaceState(null, '', url);
  }

  const focus = useMemo(() => {
    if (!state.greenCenter || state.greenRadiusKm === null) return null;
    return { center: state.greenCenter, radiusKm: state.greenRadiusKm };
  }, [state.greenCenter, state.greenRadiusKm]);

  const labelsVisible =
    mode !== 'hard' || finished || (state.greenRadiusKm !== null && state.greenRadiusKm < HARD_LABELS_BELOW_KM);

  const { streak } = stats(results);

  return (
    <div className={`app ${basemap.dark ? 'on-dark-map' : ''}`}>
      <MapView
        key={session.day}
        basemap={basemap}
        guesses={state.guesses}
        focus={focus}
        reveal={finished ? target : null}
        labelsVisible={labelsVisible}
        onClick={handleClick}
      />

      <TopBar day={session.day} today={today} onArchive={() => setOverlay('archive')} onHelp={() => setOverlay('help')} onHome={goHome} />
      <Toast message={toast} />

      {finished && overlay === 'none' && (
        <button className="btn btn-primary map-cta" onClick={() => setOverlay('result')}>
          Show result
        </button>
      )}

      <aside className={`panel ${sheetOpen ? 'open' : ''}`}>
        <button className="panel-handle" onClick={() => setSheetOpen((o) => !o)} aria-expanded={sheetOpen} aria-label={sheetOpen ? 'Collapse' : 'Expand'}>
          <span />
        </button>
        <div className="panel-head">
          <ul className="marks" aria-label="Guesses so far">
            {Array.from({ length: 6 }, (_, i) => {
              const g = state.guesses[i];
              return <li key={i} className={`mark ${g ? (g.win ? 'win' : g.hit ? 'hit' : 'miss') : i === state.guesses.length && !finished ? 'next' : 'empty'}`} />;
            })}
          </ul>
          <div className="panel-mode"><ModeSwitch mode={mode} onChange={changeMode} /></div>
        </div>
        <button className="panel-peek" onClick={() => setSheetOpen(true)} aria-label="Show clues and guesses">
          <span className="eyebrow">{finished ? state.target.title : `Clue ${state.hintsRevealed}`}</span>
          <span className="peek-text">{finished ? 'Tap for your result and all clues' : state.target.hints[state.hintsRevealed - 1]}</span>
        </button>
        <div className="panel-body">
          <div className="panel-mode-mobile"><ModeSwitch mode={mode} onChange={changeMode} /></div>
          <HintPanel target={target} revealed={state.hintsRevealed} finished={finished} />
          <GuessList guesses={state.guesses} showDirection={mode !== 'hard'} unit={unit} onUnit={changeUnit} />
        </div>
      </aside>

      {overlay === 'result' && (
        <ResultCard
          state={state}
          mode={mode}
          day={session.day}
          today={today}
          streak={streak}
          unit={unit}
          onArchive={() => setOverlay('archive')}
          onPlayDay={playDay}
          onDismiss={() => setOverlay('none')}
        />
      )}
      {overlay === 'archive' && (
        <ArchivePanel today={today} current={session.day} results={results} onPlay={playDay} onClose={() => setOverlay('none')} />
      )}
      {overlay === 'help' && <HelpModal onClose={() => setOverlay('none')} />}
    </div>
  );
}
