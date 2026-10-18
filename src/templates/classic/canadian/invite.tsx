"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { canadianWedding as wedding } from "./wedding";

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function usePinned(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const total = root.offsetHeight - window.innerHeight;
      const next = total <= 0 ? 0 : clamp(-root.getBoundingClientRect().top / total);
      setProgress((current) => (Math.abs(current - next) < 0.004 ? current : next));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

  return progress;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return reduced;
}

function Rise({ children, className = "", delay = "0s" }: { children: ReactNode; className?: string; delay?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setShown(true);
      },
      { threshold: 0.28 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`ca-reveal ${shown ? "is-in" : ""} ${className}`} style={{ animationDelay: delay }}>
      {children}
    </div>
  );
}

function beatStyle(progress: number, start: number, end: number, centered = false) {
  const fadeIn = start <= 0 ? 1 : clamp((progress - start) / 0.08);
  const fadeOut = end >= 1 ? 1 : clamp((end - progress) / 0.08);
  const rise = (1 - fadeIn) * 28;
  return {
    opacity: Math.min(fadeIn, fadeOut),
    transform: centered ? `translateY(calc(-50% + ${rise}px))` : `translateY(${rise}px)`,
  };
}

function Leaves() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {[0, 1, 2, 3].map((leaf) => (
        <svg key={leaf} viewBox="0 0 64 72" className="ca-leaf absolute h-8 w-7 text-[#c47a3a]" style={{ left: `${12 + leaf * 22}%`, animationDelay: `${leaf * 1.7}s` }}>
          <path fill="currentColor" d="M32 2c2 8 1 12-2 16 6-2 12 0 16 4-6 2-8 6-8 12 8-4 16-2 20 4-8 0-12 6-12 12 4 0 8 4 8 8H34v14h-4V58H10c0-4 4-8 8-8 0-6-4-12-12-12 4-6 12-8 20-4 0-6-2-10-8-12 4-4 10-6 16-4-3-4-4-8-2-16z" />
        </svg>
      ))}
    </div>
  );
}

function Lights() {
  return (
    <div className="ca-lights pointer-events-none absolute inset-x-0 top-[16%]" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <i key={index} style={{ animationDelay: `${index * 0.28}s` }} />
      ))}
    </div>
  );
}

export function CanadianInvite({ onClose }: { onClose: () => void }) {
  const dockRef = useRef<HTMLElement>(null);
  const hoursRef = useRef<HTMLElement>(null);
  const dock = usePinned(dockRef);
  const hours = usePinned(hoursRef);
  const reduced = useReducedMotion();
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div className="bg-[#f4efe6] text-[#1c2a22]">
      <style>{`
        .ca-rise { animation: ca-rise 1.15s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .ca-reveal { opacity: 0; transform: translateY(28px); }
        .ca-reveal.is-in { animation: ca-rise 0.95s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .ca-water { animation: ca-water 22s ease-in-out infinite alternate; }
        .ca-leaf { top: -8%; opacity: 0; animation: ca-leaf 14s linear infinite; }
        .ca-lights { display: flex; justify-content: space-between; padding: 0 8%; }
        .ca-lights i { width: 0.5rem; height: 0.5rem; border-radius: 999px; background: #e6c27a; box-shadow: 0 0 14px #e6c27a; animation: ca-bulb 2.6s ease-in-out infinite; }
        @keyframes ca-rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ca-water { from { transform: scale(1.06); } to { transform: scale(1.14) translate3d(0, -2%, 0); } }
        @keyframes ca-leaf { 0% { opacity: 0; transform: translate3d(0, 0, 0) rotate(0deg); } 12% { opacity: 0.8; } 100% { opacity: 0; transform: translate3d(8vw, 105vh, 0) rotate(48deg); } }
        @keyframes ca-bulb { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .ca-rise, .ca-water, .ca-leaf, .ca-lights i, .ca-reveal, .ca-reveal.is-in { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
      <button className="fixed top-12 left-4 z-[5] cursor-pointer rounded-full border-0 bg-[#1c2a22] px-3.5 py-2 text-[#f7f4ee]" type="button" onClick={onClose}>
        ← Back
      </button>

      <section className="relative h-[150vh]" aria-label="Arrival on the lake">
        <div className="sticky top-0 h-dvh overflow-hidden bg-[#10241c]">
          <img
            src="/photos/couple.jpg"
            alt=""
            className="ca-water absolute inset-0 h-full w-full object-cover object-[center_40%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10241c] via-[#10241c]/25 to-[#10241c]/35" />
          <Leaves />
          <div className="absolute inset-x-0 bottom-20 px-6 text-center text-[#f7f4ee]">
            <p className="ca-rise m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.38em] text-[#e6c27a] uppercase">Muskoka</p>
            <p className="ca-rise m-0 mx-auto mt-4 max-w-[16ch] font-[family-name:var(--font-serif)] text-[clamp(2rem,6vw,3.4rem)] leading-tight" style={{ animationDelay: "0.15s" }}>
              {wedding.arrival}
            </p>
            <p className="ca-rise m-0 mt-5 font-[family-name:var(--font-script)] text-4xl" style={{ animationDelay: "0.35s" }}>
              Cedar Point
            </p>
            <p className="ca-rise m-0 mt-3 font-[family-name:var(--font-ui)] text-xs tracking-[0.22em] text-[#e6c27a] uppercase" style={{ animationDelay: "0.5s" }}>
              {wedding.shortDate} · {wedding.time}
            </p>
          </div>
        </div>
      </section>

      <section ref={dockRef} className={reduced ? "bg-[#10241c]" : "relative h-[420vh] bg-[#10241c]"} aria-label="On the dock">
        <div className={reduced ? "relative min-h-dvh overflow-hidden" : "sticky top-0 h-dvh overflow-hidden"}>
          <img
            src="/photos/walk.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            style={reduced ? undefined : { transform: `scale(${1.08 + dock * 0.14}) translate3d(0, ${dock * -4}%, 0)` }}
          />
          <div className="absolute inset-0 bg-[#10241c]/45" />
          <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-[#f7f4ee]">
            {reduced ? (
              <div className="grid gap-8">
                {wedding.dock.map((line) => (
                  <p key={line} className="m-0 font-[family-name:var(--font-serif)] text-[clamp(1.6rem,4vw,2.5rem)] leading-snug">
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              wedding.dock.map((line, index) => (
                <p
                  key={line}
                  className="absolute inset-x-8 top-1/2 m-0 font-[family-name:var(--font-serif)] text-[clamp(1.7rem,4.5vw,2.8rem)] leading-snug"
                  style={beatStyle(dock, index * 0.22, index === wedding.dock.length - 1 ? 1 : (index + 1) * 0.22 + 0.06, true)}
                >
                  {line}
                </p>
              ))
            )}
          </div>
        </div>
      </section>

      <section ref={hoursRef} className={reduced ? "bg-[#1a120c] text-[#f7f4ee]" : "relative h-[460vh] bg-[#1a120c] text-[#f7f4ee]"} aria-label="Lantern hours">
        <div className={reduced ? "relative px-6 py-24" : "sticky top-0 flex h-dvh items-center overflow-hidden px-6"}>
          <img src="/photos/couple.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" style={reduced ? undefined : { transform: `translate3d(0, ${hours * -8}%, 0) scale(1.12)` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a120c]/70 via-[#1a120c]/55 to-[#1a120c]" />
          <Lights />
          <div className="relative mx-auto w-full max-w-lg">
            <p className="m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.34em] text-[#e6c27a] uppercase">The evening</p>
            {reduced ? (
              <ol className="mt-8 list-none p-0">
                {wedding.hours.map((item) => (
                  <li key={item.title} className="border-t border-white/15 py-5">
                    <p className="m-0 font-[family-name:var(--font-ui)] text-xs tracking-[0.22em] text-[#e6c27a] uppercase">{item.time}</p>
                    <p className="m-0 mt-1 font-[family-name:var(--font-serif)] text-3xl">{item.title}</p>
                    <p className="m-0 mt-1 text-white/75">{item.detail}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="relative mt-6 min-h-[12rem]">
                {wedding.hours.map((item, index) => (
                  <div key={item.title} className="absolute inset-x-0 top-0" style={beatStyle(hours, index * 0.22, index === wedding.hours.length - 1 ? 1 : (index + 1) * 0.22 + 0.05)}>
                    <p className="m-0 font-[family-name:var(--font-ui)] text-xs tracking-[0.28em] text-[#e6c27a] uppercase">{item.time}</p>
                    <p className="m-0 mt-2 font-[family-name:var(--font-script)] text-[clamp(3.2rem,10vw,5rem)] leading-none">{item.title}</p>
                    <p className="m-0 mt-4 max-w-[28ch] font-[family-name:var(--font-serif)] text-xl leading-relaxed text-white/80">{item.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative min-h-dvh overflow-hidden" aria-label="The long table">
        <img src="/photos/dress.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[#1c2a22]/55" />
        <div className="relative flex min-h-dvh flex-col items-center justify-end px-6 py-24 text-center text-[#f7f4ee]">
          <Rise>
            <p className="m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.34em] text-[#e6c27a] uppercase">Supper</p>
          </Rise>
          <Rise delay="0.12s">
            <h2 className="m-0 mt-4 max-w-[16ch] font-[family-name:var(--font-serif)] text-[clamp(2rem,6vw,3.4rem)] leading-tight">A long table in the boathouse</h2>
          </Rise>
          <Rise delay="0.24s">
            <p className="m-0 mt-5 max-w-md font-[family-name:var(--font-serif)] text-xl leading-relaxed text-white/85">{wedding.dress}</p>
          </Rise>
          <Rise delay="0.36s">
            <p className="m-0 mt-6 font-[family-name:var(--font-ui)] text-xs tracking-[0.18em] text-[#e6c27a] uppercase">{wedding.address}</p>
          </Rise>
        </div>
      </section>

      <section className="bg-[#f4efe6] px-6 py-24" aria-label="Stay the weekend">
        <Rise className="text-center">
          <p className="m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.34em] text-[#8d5a2b] uppercase">If you stay</p>
          <h2 className="m-0 mt-3 font-[family-name:var(--font-script)] text-6xl text-[#1c2a22]">Come up Friday</h2>
        </Rise>
        <div className="mx-auto mt-12 grid max-w-3xl gap-8">
          {wedding.stays.map((stay, index) => (
            <Rise key={stay.name} delay={`${index * 0.1}s`}>
              <article className="border-t border-[#1c2a22]/15 pt-6">
                <h3 className="m-0 font-[family-name:var(--font-serif)] text-3xl">{stay.name}</h3>
                <p className="m-0 mt-2 max-w-xl font-[family-name:var(--font-serif)] text-xl leading-relaxed text-[#1c2a22]/75">{stay.detail}</p>
              </article>
            </Rise>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#10241c] px-6 py-24 text-[#f7f4ee]" aria-label="Reply">
        <Leaves />
        <div className="relative mx-auto max-w-md text-center">
          <Rise>
            <h2 className="m-0 font-[family-name:var(--font-script)] text-6xl">Come up the lake</h2>
          </Rise>
          <Rise delay="0.12s">
            <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-xl text-white/75">Tell us your name and we will keep a chair by the fire.</p>
          </Rise>
          {sent ? (
            <p className="mt-10 font-[family-name:var(--font-serif)] text-2xl">A lantern on the dock has your name.</p>
          ) : (
            <form className="mt-10 grid gap-3 text-left" onSubmit={submit}>
              <input className="rounded-full border border-white/20 bg-white/10 px-4 py-3 text-[#f7f4ee] placeholder:text-white/50" name="name" required placeholder="Your name" aria-label="Full name" />
              <input className="rounded-full border border-white/20 bg-white/10 px-4 py-3 text-[#f7f4ee] placeholder:text-white/50" name="phone" required placeholder="A number we can reach" aria-label="Phone number" />
              <button className="cursor-pointer rounded-full border-0 bg-[#e6c27a] px-4 py-3 text-[#1c2a22]" type="submit">
                Save my place
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="relative min-h-dvh overflow-hidden" aria-label="Last light">
        <img src="/photos/rings.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[#10241c]/50" />
        <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center text-[#f7f4ee]">
          <Rise>
            <p className="m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.34em] text-[#e6c27a] uppercase">{wedding.place}</p>
          </Rise>
          <Rise delay="0.12s">
            <p className="m-0 mt-4 font-[family-name:var(--font-script)] text-[clamp(3rem,10vw,5.5rem)] leading-none">{wedding.bride}</p>
          </Rise>
          <Rise delay="0.22s">
            <p className="m-0 font-[family-name:var(--font-serif)] text-2xl italic text-[#e6c27a]">and</p>
          </Rise>
          <Rise delay="0.32s">
            <p className="m-0 font-[family-name:var(--font-script)] text-[clamp(3rem,10vw,5.5rem)] leading-none">{wedding.groom}</p>
          </Rise>
          <Rise delay="0.46s">
            <p className="m-0 mt-6 font-[family-name:var(--font-serif)] text-xl">{wedding.dateLabel}</p>
            <p className="m-0 mt-2 font-[family-name:var(--font-ui)] text-xs tracking-[0.22em] text-[#e6c27a] uppercase">Until the last lantern</p>
          </Rise>
        </div>
      </section>
    </div>
  );
}
