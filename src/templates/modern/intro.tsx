export function ModernIntro({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open the invitation"
      className={`fixed inset-0 z-50 cursor-pointer overflow-hidden border-0 bg-[#0c0c0b] p-0 text-left transition-opacity duration-[1100ms] ease-out motion-reduce:transition-none ${opening ? "opacity-0 delay-[1500ms]" : ""}`}
    >
      <span className={`pointer-events-none absolute top-[11%] left-[4.5%] size-5 border-t border-l border-[#e6d3a4]/80 motion-reduce:animate-none ${opening ? "motion-safe:animate-[modern-corner-tl_1.15s_ease_both]" : "motion-safe:animate-[modern-rise_0.6s_ease_0.15s_both]"}`} />
      <span className={`pointer-events-none absolute top-[11%] right-[4.5%] size-5 border-t border-r border-[#e6d3a4]/80 motion-reduce:animate-none ${opening ? "motion-safe:animate-[modern-corner-tr_1.15s_ease_0.16s_both]" : "motion-safe:animate-[modern-rise_0.6s_ease_0.25s_both]"}`} />
      <span className={`pointer-events-none absolute bottom-[9%] left-[4.5%] size-5 border-b border-l border-[#e6d3a4]/80 motion-reduce:animate-none ${opening ? "motion-safe:animate-[modern-corner-bl_1.15s_ease_0.32s_both]" : "motion-safe:animate-[modern-rise_0.6s_ease_0.35s_both]"}`} />
      <span className={`pointer-events-none absolute right-[4.5%] bottom-[9%] size-5 border-r border-b border-[#e6d3a4]/80 motion-reduce:animate-none ${opening ? "motion-safe:animate-[modern-corner-br_1.15s_ease_0.48s_both]" : "motion-safe:animate-[modern-rise_0.6s_ease_0.45s_both]"}`} />

      <span className="absolute inset-[14%_5%_13%_5%] overflow-hidden motion-safe:animate-[modern-frame_1.15s_ease-out_both] motion-reduce:animate-none sm:inset-[13%_8%_12%_8%]">
        <img
          src="/photos/story-4.jpg"
          alt=""
          style={opening ? { animationPlayState: "paused", scale: 1.16, transition: "scale 1.6s cubic-bezier(0.22, 1, 0.36, 1)" } : undefined}
          className="absolute inset-0 size-full object-cover object-[center_18%] motion-safe:animate-[modern-ken_1.8s_ease_both] motion-reduce:animate-none"
        />
        <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.08)_48%,rgba(0,0,0,0.28)_100%)]" />
        <span className="pointer-events-none absolute inset-y-[-10%] left-0 w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent motion-safe:animate-[modern-sheen_1.3s_ease_1.05s_both] motion-reduce:animate-none" />
        <span className={`absolute inset-x-0 top-0 h-px origin-left bg-[#e6d3a4] motion-reduce:animate-none ${opening ? "motion-safe:animate-[modern-line-out_0.95s_ease_0.2s_both]" : "motion-safe:animate-[modern-draw_0.8s_ease_0.85s_both]"}`} />

        <span className="relative flex h-full flex-col justify-end px-5 pt-16 pb-5 sm:px-8 sm:pb-7">
          <span className="overflow-hidden">
            <span className={`block font-[family-name:var(--font-ui)] text-[0.62rem] tracking-[0.38em] text-[#e6d3a4] uppercase motion-reduce:animate-none ${opening ? "motion-safe:animate-[modern-out_0.9s_ease_0.25s_both]" : "motion-safe:animate-[modern-wipe_0.7s_ease_0.55s_both]"}`}>
              Saturday 17 October
            </span>
          </span>
          <span className="mt-2 overflow-hidden">
            <span className={`block font-[family-name:var(--font-serif)] text-[clamp(3.1rem,8vw,5.8rem)] leading-[0.86] font-medium tracking-[-0.045em] text-white motion-reduce:animate-none ${opening ? "motion-safe:animate-[modern-out_1s_ease_0.45s_both]" : "motion-safe:animate-[modern-wipe_0.85s_ease_0.68s_both]"}`}>
              Adaeze
            </span>
          </span>
          <span className="overflow-hidden">
            <span className={`block font-[family-name:var(--font-serif)] text-[clamp(3.1rem,8vw,5.8rem)] leading-[0.86] font-medium tracking-[-0.045em] text-white motion-reduce:animate-none ${opening ? "motion-safe:animate-[modern-out_1s_ease_0.62s_both]" : "motion-safe:animate-[modern-wipe_0.85s_ease_0.82s_both]"}`}>
              &amp; Emeka
            </span>
          </span>
          <span className="mt-4 flex items-end justify-between gap-4">
            <span className={`font-[family-name:var(--font-ui)] text-[0.78rem] tracking-[0.04em] text-white/80 motion-reduce:animate-none ${opening ? "motion-safe:animate-[modern-out_0.9s_ease_0.78s_both]" : "motion-safe:animate-[modern-rise_0.7s_ease_1.05s_both]"}`}>
              Eko Hotels
              <span className="mt-1 block text-white/60">Victoria Island</span>
            </span>
            <span className={`shrink-0 rounded-full border border-white/80 px-4 py-2 font-[family-name:var(--font-ui)] text-[0.64rem] tracking-[0.26em] text-white uppercase motion-reduce:animate-none ${opening ? "motion-safe:animate-[modern-pill-out_1.05s_ease_0.5s_both]" : "motion-safe:animate-[modern-rise_0.7s_ease_1.15s_both]"}`}>
              Open
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
