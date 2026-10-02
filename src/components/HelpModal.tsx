interface Props {
  onClose: () => void;
}

export default function HelpModal({ onClose }: Props) {
  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet help" role="dialog" aria-modal="true" aria-labelledby="help-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="help-title" className="display">How to play</h2>
        <ol className="help-list">
          <li>Read the first clue, then click the map where you think the place is. You have six clicks.</li>
          <li>Each click draws a ring. <b className="green">Green</b> means the place is inside it. <b className="red">Red</b> means it is not.</li>
          <li>Rings shrink. Keep your next click inside the newest green ring and outside the red ones.</li>
          <li>Every click unlocks another clue and tells you how far away the place is.</li>
          <li>Land close enough and you have found it. A new place arrives at midnight, and the archive holds every past day.</li>
        </ol>
        <p className="help-modes"><b>Easy</b> shows place names and a compass bearing. <b>Hard</b> hides both. <b>Random</b> deals a surprise basemap.</p>
        <div className="actions">
          <button className="btn btn-primary" onClick={onClose}>Let's go</button>
        </div>
      </div>
    </div>
  );
}
