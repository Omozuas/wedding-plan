export function SoundButton({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      className={playing ? "sound-btn is-playing" : "sound-btn is-paused"}
      type="button"
      onClick={onToggle}
      aria-label={playing ? "Turn music off" : "Turn music on"}
      aria-pressed={playing}
    >
      <svg className="sound-speaker" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 9.2h3.4L11.2 5v14l-4.3-4.2H3.5z" fill="currentColor" />
        <path
          d="M14.6 8.2a5 5 0 0 1 0 7.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="sound-eq" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
