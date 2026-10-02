import type { MapMode } from '../game/types';

interface Props {
  mode: MapMode;
  onChange: (m: MapMode) => void;
}

const MODES: { id: MapMode; label: string; title: string }[] = [
  { id: 'easy', label: 'Easy', title: 'Place names and compass' },
  { id: 'hard', label: 'Hard', title: 'No labels, no compass' },
  { id: 'random', label: 'Random', title: 'Surprise basemap' },
];

export default function ModeSwitch({ mode, onChange }: Props) {
  return (
    <div className="seg" role="radiogroup" aria-label="Map mode">
      {MODES.map((m) => (
        <button
          key={m.id}
          role="radio"
          aria-checked={mode === m.id}
          className={`seg-btn ${mode === m.id ? 'on' : ''}`}
          title={m.title}
          onClick={() => onChange(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
