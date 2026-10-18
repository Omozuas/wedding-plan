"use client";

export function CanadianIntro({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open the invitation"
      className={`canadian-intro fixed inset-0 z-50 cursor-pointer overflow-hidden border-0 bg-[#10241c] p-0 ${opening ? "is-opening" : ""}`}
    >
      <span className="canadian-shot absolute inset-[-8%]">
        <img src="/photos/couple.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[center_42%]" />
        <img src="/photos/bouquet.jpg" alt="" className="canadian-parallax absolute inset-0 h-full w-full object-cover opacity-0" />
      </span>
      <span className="canadian-veil pointer-events-none absolute inset-0" />
      <span className="canadian-flare pointer-events-none absolute inset-0" />
      <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-[#f7f4ee]">
        <span className="canadian-kicker font-[family-name:var(--font-ui)] text-[0.72rem] tracking-[0.42em] text-[#e6c27a] uppercase">Lake Rosseau</span>
        <span className="canadian-names mt-3 font-[family-name:var(--font-script)] text-[clamp(3.4rem,13vw,6.4rem)] leading-[0.88]">
          Claire
          <span className="mx-2 inline-block align-middle font-[family-name:var(--font-serif)] text-[0.42em] italic">&</span>
          Thomas
        </span>
        <span className="canadian-date mt-5 font-[family-name:var(--font-serif)] text-[clamp(1.2rem,3vw,1.7rem)] tracking-[0.18em]">3 October</span>
      </span>
      <span className="canadian-iris pointer-events-none absolute top-[78%] left-1/2" />
      <span className="canadian-enter pointer-events-none absolute inset-x-0 bottom-[14%] text-center font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.36em] text-[#e6c27a] uppercase">
        Tap to enter
      </span>
    </button>
  );
}
