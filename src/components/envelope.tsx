function Sprig({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 140 200" fill="none" aria-hidden="true">
      <path d="M28 188c22-36 28-74 18-122" stroke="currentColor" strokeWidth="0.8" />
      <path d="M46 150c18-8 34-6 46 8-18 2-30 10-36 22" stroke="currentColor" strokeWidth="0.7" />
      <path d="M44 118c20-4 32 2 40 16-16-2-28 4-34 16" stroke="currentColor" strokeWidth="0.7" />
      <path d="M42 86c16-10 30-8 42 2-14 4-26 10-32 20" stroke="currentColor" strokeWidth="0.7" />
      <path d="M40 58c12-12 26-14 40-6-12 6-22 12-28 22" stroke="currentColor" strokeWidth="0.7" />
      <path d="M46 148c-16-2-28 4-34 16 10-8 22-12 34-10" stroke="currentColor" strokeWidth="0.7" />
      <path d="M44 112c-14 2-26 10-30 22 8-10 20-16 32-14" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  );
}

function FlapEdges() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full text-[#e6d3a4]" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1="0" x2="50" y2="52" stroke="currentColor" strokeWidth="0.35" vectorEffect="nonScalingStroke" />
      <line x1="100" y1="0" x2="50" y2="52" stroke="currentColor" strokeWidth="0.35" vectorEffect="nonScalingStroke" />
      <line x1="0" y1="100" x2="50" y2="52" stroke="currentColor" strokeWidth="0.35" vectorEffect="nonScalingStroke" />
      <line x1="100" y1="100" x2="50" y2="52" stroke="currentColor" strokeWidth="0.35" vectorEffect="nonScalingStroke" />
    </svg>
  );
}

export function Envelope({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  return (
    <button
      className={`envelope fixed inset-0 z-50 cursor-pointer border-0 bg-transparent p-0 ${opening ? "is-opening" : ""}`}
      type="button"
      onClick={onOpen}
      aria-label="Open the invitation"
    >
      <span className="envelope-back absolute inset-0 bg-[#0b1a3a]" />
      <span className="envelope-scene absolute inset-0">
        <span className="flap flap-bottom">
          <FlapEdges />
        </span>
        <span className="flap flap-left" />
        <span className="flap flap-right" />
        <span className="flap flap-top">
          <FlapEdges />
        </span>
      </span>
      <Sprig className="envelope-sprig pointer-events-none absolute top-[4%] left-[6%] z-10 w-[clamp(72px,16vw,120px)] opacity-80" />
      <Sprig className="envelope-sprig pointer-events-none absolute right-[5%] bottom-[8%] z-10 w-[clamp(88px,20vw,150px)] rotate-180 opacity-80" />
      <span className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
        <span className="wax-seal grid aspect-square w-[min(210px,46vw)] place-items-center rounded-full bg-[radial-gradient(circle_at_34%_30%,#f4e4bf,#c6a15a_40%,#8d6430_74%,#5c3d1c)] shadow-[0_22px_46px_rgba(0,0,0,0.55),inset_0_0_0_9px_rgba(92,60,24,0.28),inset_0_0_20px_rgba(255,236,196,0.4)]">
          <svg viewBox="0 0 120 120" className="h-[74%] w-[74%]" aria-hidden="true">
            <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(74,46,16,0.35)" strokeWidth="1.2" />
            <g fill="none" stroke="#5c3d1c" strokeWidth="1.15" strokeLinecap="round">
              <path d="M60 92c0-18 2-32 0-50" />
              <path d="M60 78c10-2 18 2 24 10-8-2-16 0-22 6" />
              <path d="M60 66c12-6 20-2 26 8-10-4-18 0-24 8" />
              <path d="M60 54c10-8 18-6 24 4-8-2-16 2-22 10" />
              <path d="M60 78c-10-2-18 2-24 10 8-2 16 0 22 6" />
              <path d="M60 64c-12-4-20 0-26 10 10-6 18-2 24 8" />
              <path d="M58 42c4-10 12-14 20-12-8 2-12 8-12 16" />
            </g>
          </svg>
        </span>
      </span>
      <span className="envelope-copy absolute inset-0 z-10 flex flex-col items-center justify-end gap-4 pb-16">
        <p className="m-0 px-6 text-center font-[family-name:var(--font-ui)] text-sm font-light tracking-[0.4em] text-white uppercase">
          You are invited
        </p>
        <p className="m-0 font-[family-name:var(--font-ui)] text-xs tracking-[0.3em] text-white/70 uppercase motion-safe:animate-pulse">
          Tap to open
        </p>
      </span>
    </button>
  );
}
