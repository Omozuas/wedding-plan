export function HarbourIntro({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open the invitation"
      className="fixed inset-0 z-50 cursor-pointer overflow-hidden border-0 bg-[#06101f] p-0"
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(230,211,164,0.22),transparent_36%)]" />
      <span className="pointer-events-none absolute inset-x-[-30%] top-[18%] h-24 bg-[linear-gradient(90deg,transparent,rgba(230,211,164,0.55),transparent)] opacity-80 motion-safe:animate-[harbour-sweep_2.6s_ease-in-out_infinite] motion-reduce:animate-none" />
      <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <span className="font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.42em] text-[#e6d3a4] uppercase">The tide is in</span>
        <span className="mt-4 font-[family-name:var(--font-serif)] text-[clamp(3.2rem,12vw,6.4rem)] leading-[0.9] font-medium tracking-[-0.04em] text-[#f7f3ea]">
          Adaeze
          <span className="mt-1 block text-[0.42em] text-[#e6d3a4]">&amp;</span>
          Emeka
        </span>
        <span className="mt-5 max-w-xs font-[family-name:var(--font-ui)] text-sm tracking-[0.08em] text-white/75">
          Saturday 17 October 2026 · Eko Hotels
        </span>
      </span>
      <span
        className="absolute inset-y-0 left-0 z-10 w-1/2 bg-[#0c2348] shadow-[8px_0_30px_rgba(0,0,0,0.35)] transition-transform duration-[1100ms] ease-[cubic-bezier(0.7,0,0.2,1)] motion-reduce:transition-none"
        style={{ transform: opening ? "translateX(-100%)" : undefined }}
      />
      <span
        className="absolute inset-y-0 right-0 z-10 w-1/2 bg-[#12305f] shadow-[-8px_0_30px_rgba(0,0,0,0.35)] transition-transform duration-[1100ms] ease-[cubic-bezier(0.7,0,0.2,1)] motion-reduce:transition-none"
        style={{ transform: opening ? "translateX(100%)" : undefined }}
      />
      <span
        className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-700 motion-reduce:transition-none ${opening ? "scale-125 opacity-0" : ""}`}
      >
        <span className="flex w-[min(300px,76vw)] flex-col items-center bg-[#071428] px-8 py-9 ring-1 ring-[#e6d3a4]/80 motion-safe:animate-[harbour-drift_4.6s_ease-in-out_infinite] motion-reduce:animate-none">
          <span className="font-[family-name:var(--font-ui)] text-[0.62rem] tracking-[0.38em] text-[#e6d3a4] uppercase">For you</span>
          <span className="mt-3 text-center font-[family-name:var(--font-serif)] text-[clamp(2.2rem,7vw,3rem)] leading-[0.95] font-medium text-[#f7f3ea]">
            A letter
            <span className="mt-1 block text-[0.72em]">from the harbour</span>
          </span>
          <span className="mt-6 grid size-16 place-items-center rounded-full bg-[radial-gradient(circle_at_34%_30%,#f4e4bf,#c6a15a_46%,#8d6430_78%)] shadow-[0_12px_30px_rgba(0,0,0,0.45)] motion-safe:animate-pulse">
            <span className="font-[family-name:var(--font-serif)] text-lg text-[#3d2912]">A+E</span>
          </span>
          <span className="mt-5 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.28em] text-white/70 uppercase">Open it</span>
        </span>
      </span>
    </button>
  );
}
