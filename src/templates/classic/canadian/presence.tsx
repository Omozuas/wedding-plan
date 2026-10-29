"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { quebecEvening as evening } from "./quebec";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setShown(true);
      },
      { threshold: 0.22 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, shown };
}

function Rise({ children, className = "", delay = "0s" }: { children: ReactNode; className?: string; delay?: string }) {
  const { ref, shown } = useReveal();
  return (
    <div ref={ref} className={`qx-rise ${shown ? "is-in" : ""} ${className}`} style={{ animationDelay: delay }}>
      {children}
    </div>
  );
}

export function QuebecPresence() {
  const heroRef = useRef<HTMLElement>(null);
  const [slide, setSlide] = useState(0);
  const [hero, setHero] = useState(0);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlide((current) => (current + 1) % evening.scenes.length);
    }, 4800);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    const update = () => {
      const rect = root.getBoundingClientRect();
      const traveled = Math.min(Math.max(-rect.top, 0), rect.height);
      const next = rect.height ? traveled / rect.height : 0;
      setHero((current) => (Math.abs(current - next) < 0.01 ? current : next));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div className="bg-[#f4efe4] text-[#1a1410]">
      <style>{`
        .qx-rise { opacity: 0; transform: translateY(22px); }
        .qx-rise.is-in { animation: qx-rise 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .qx-ken { animation: qx-ken 16s ease-in-out infinite alternate; }
        .qx-cue { animation: qx-cue 1.6s ease-in-out infinite; }
        @keyframes qx-rise { to { opacity: 1; transform: translateY(0); } }
        @keyframes qx-ken { from { transform: scale(1.08) translate3d(0, 0, 0); } to { transform: scale(1.16) translate3d(0, -2%, 0); } }
        @keyframes qx-cue { 0%, 100% { transform: translateY(0); opacity: 0.45; } 50% { transform: translateY(6px); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .qx-rise, .qx-rise.is-in, .qx-ken, .qx-cue { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      <section ref={heroRef} className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-24 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ transform: `translate3d(0, ${hero * 12}%, 0)` }}
        >
          {evening.scenes.map((scene, index) => (
            <img
              key={scene.src}
              src={scene.src}
              alt=""
              className={`qx-ken absolute inset-0 h-full w-full object-cover object-[center_30%] transition-opacity duration-[1400ms] ${index === slide ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(244,239,228,0.92),rgba(244,239,228,0.2)_42%,rgba(244,239,228,0.35))]" />
        <div className="relative z-[1] w-full max-w-xl" style={{ opacity: 1 - Math.min(hero / 0.55, 1), transform: `translate3d(0, ${Math.min(hero / 0.55, 1) * -36}px, 0)` }}>
          <p className="qx-rise is-in m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.34em] text-[#1a1410] uppercase" style={{ animationDelay: "0.05s" }}>
            {evening.place}
          </p>
          <h1 className="hero-names qx-rise is-in m-0 mt-4 font-[family-name:var(--font-script)] text-[clamp(3.4rem,12vw,6.5rem)] leading-none font-normal" style={{ animationDelay: "0.18s" }}>
            {evening.couple}
          </h1>
          <div className="qx-rise is-in mx-auto mt-6 flex w-28 flex-col items-center gap-[3px]" style={{ animationDelay: "0.32s" }} aria-hidden="true">
            <span className="block h-px w-full bg-[#c9a96e]" />
            <span className="block h-px w-3/5 bg-[#c9a96e]" />
          </div>
          <p className="qx-rise is-in m-0 mt-6 font-[family-name:var(--font-ui)] text-[0.72rem] tracking-[0.18em] uppercase" style={{ animationDelay: "0.42s" }}>
            {evening.dateLabel}
          </p>
          <p className="qx-rise is-in m-0 mt-2 font-[family-name:var(--font-serif)] text-xl" style={{ animationDelay: "0.52s" }}>
            {evening.time} · {evening.venue}
          </p>
        </div>
        <span className="qx-cue absolute bottom-8 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[8px] border-x-transparent border-t-[#c9a96e]" aria-hidden="true" />
      </section>

      {evening.scenes.map((scene, index) => (
        <section key={scene.kicker} className={`px-5 py-16 sm:px-8 sm:py-20 ${index % 2 ? "bg-[#f8e9d8]" : "bg-[#f6f4ec]"}`}>
          <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-2 md:gap-12">
            <Rise className={index % 2 ? "md:order-2" : ""}>
              <img src={scene.src} alt="" className="aspect-[4/5] w-full object-cover shadow-[0_16px_40px_rgba(26,20,16,0.12)]" />
            </Rise>
            <Rise delay="0.12s" className={index % 2 ? "md:order-1" : ""}>
              <p className="m-0 font-[family-name:var(--font-ui)] text-[0.66rem] tracking-[0.32em] text-[#1c3f86] uppercase">{scene.kicker}</p>
              <div className="mt-4 mb-5 flex w-16 flex-col gap-[3px]" aria-hidden="true">
                <span className="block h-px bg-[#c9a96e]" />
                <span className="block h-px w-3/5 bg-[#c9a96e]" />
              </div>
              <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(1.6rem,4vw,2.3rem)] leading-snug">{scene.line}</p>
            </Rise>
          </div>
        </section>
      ))}

      <section className="bg-[#16356e] px-5 py-16 text-center text-[#f6f1e6] sm:px-8 sm:py-20">
        <Rise>
          <p className="m-0 font-[family-name:var(--font-ui)] text-[0.66rem] tracking-[0.32em] text-[#e7d7a8] uppercase">{evening.address}</p>
          <h2 className="m-0 mt-3 font-[family-name:var(--font-script)] text-[clamp(2.6rem,8vw,4rem)] leading-none font-normal">{evening.venue}</h2>
          <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-xl">{evening.bride} and {evening.groom}</p>
        </Rise>
        <Rise delay="0.15s" className="mx-auto mt-10 max-w-md">
          {sent ? (
            <p className="m-0 font-[family-name:var(--font-serif)] text-2xl">Your name is with the doorkeeper.</p>
          ) : (
            <form className="flex flex-col gap-3 sm:flex-row" onSubmit={submit}>
              <input className="min-h-12 w-full rounded-full border border-white/30 bg-white/10 px-4 text-base text-[#f6f1e6] placeholder:text-white/60" name="name" required placeholder="Your name" aria-label="Full name" />
              <button className="min-h-12 shrink-0 cursor-pointer rounded-full border-0 bg-[#c9a96e] px-6 text-base text-[#1a1410]" type="submit">
                I am here
              </button>
            </form>
          )}
        </Rise>
      </section>
    </div>
  );
}
