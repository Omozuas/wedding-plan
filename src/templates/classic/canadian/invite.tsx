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

function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrollY(window.scrollY);
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
  }, []);

  return scrollY;
}

function depthY(node: HTMLElement | null, amount: number, reduced: boolean, scrollY: number) {
  if (reduced || !node || scrollY < 0) return 0;
  const rect = node.getBoundingClientRect();
  const total = Math.max(node.offsetHeight - window.innerHeight, window.innerHeight);
  const progress = clamp(-rect.top / total);
  return (progress - 0.5) * amount;
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
  const arrivalRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLElement>(null);
  const hoursRef = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLElement>(null);
  const stayRef = useRef<HTMLElement>(null);
  const replyRef = useRef<HTMLElement>(null);
  const lastRef = useRef<HTMLElement>(null);
  const dock = usePinned(dockRef);
  const hours = usePinned(hoursRef);
  const reduced = useReducedMotion();
  const scrollY = useScrollY();
  const layer = (node: HTMLElement | null, amount: number) => `translate3d(0, ${depthY(node, amount, reduced, scrollY)}px, 0)`;
  const tilt = (node: HTMLElement | null) => {
    if (reduced || !node || scrollY < 0) return "0deg";
    const rect = node.getBoundingClientRect();
    const total = Math.max(node.offsetHeight - window.innerHeight, window.innerHeight);
    const progress = clamp(-rect.top / total);
    return `${((progress - 0.5) * -7).toFixed(2)}deg`;
  };
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
        .ca-depth-type, .ca-depth-ink {
          display: inline-block;
          transform: perspective(800px) rotateX(8deg);
          transform-origin: center bottom;
        }
        .ca-depth-type {
          text-shadow:
            0 1px 0 rgba(8, 20, 14, 0.55),
            0 2px 0 rgba(8, 20, 14, 0.38),
            0 4px 0 rgba(8, 20, 14, 0.2),
            0 14px 22px rgba(0, 0, 0, 0.32);
        }
        .ca-depth-ink {
          text-shadow:
            0 1px 0 rgba(255, 250, 242, 0.85),
            0 2px 0 rgba(120, 86, 48, 0.16),
            0 12px 18px rgba(28, 42, 34, 0.14);
        }
        .ca-plate {
          transform: perspective(1200px) rotateX(var(--tilt, 0deg));
          transform-origin: center 42%;
          transition: transform 0.55s cubic-bezier(0.16, 0.84, 0.3, 1);
        }
        .ca-plate::after {
          content: "";
          position: absolute;
          inset: auto 0 0 0;
          height: 16%;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.28), transparent);
          pointer-events: none;
        }
        @media (hover: hover) and (pointer: fine) {
          .ca-plate:hover {
            transform: perspective(1200px) rotateX(var(--tilt, 0deg)) rotateY(-4deg) translateZ(16px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ca-rise, .ca-water, .ca-leaf, .ca-lights i, .ca-reveal, .ca-reveal.is-in { animation: none; opacity: 1; transform: none; }
          .ca-depth-type, .ca-depth-ink, .ca-plate, .ca-plate:hover { transform: none; }
        }
      `}</style>
      <button className="fixed top-12 left-4 z-[5] cursor-pointer rounded-full border-0 bg-[#1c2a22] px-3.5 py-2 text-[#f7f4ee]" type="button" onClick={onClose}>
        ← Back
      </button>

      <section ref={arrivalRef} className="relative h-[150vh]" aria-label="Arrival on the lake">
        <div className="sticky top-0 h-dvh overflow-hidden bg-[#10241c]">
          <div className="absolute inset-[-8%]" style={{ transform: layer(arrivalRef.current, 42) }}>
            <div className="ca-plate absolute inset-0" style={{ ["--tilt" as string]: tilt(arrivalRef.current) }}>
              <img
                src="/photos/couple.jpg"
                alt=""
                className="ca-water absolute inset-0 h-full w-full object-cover object-[center_40%]"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#10241c] via-[#10241c]/25 to-[#10241c]/35" style={{ transform: layer(arrivalRef.current, 16) }} />
          <div className="absolute inset-0" style={{ transform: layer(arrivalRef.current, -56) }}>
            <Leaves />
          </div>
          <div className="absolute inset-x-0 bottom-20 px-6 text-center text-[#f7f4ee]" style={{ transform: layer(arrivalRef.current, -30) }}>
            <p className="ca-rise m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.38em] text-[#e6c27a] uppercase">Muskoka</p>
            <p className="ca-rise m-0 mx-auto mt-4 max-w-[16ch] font-[family-name:var(--font-serif)] text-[clamp(2rem,6vw,3.4rem)] leading-tight" style={{ animationDelay: "0.15s" }}>
              <span className="ca-depth-type">{wedding.arrival}</span>
            </p>
            <p className="ca-rise m-0 mt-5 font-[family-name:var(--font-script)] text-4xl" style={{ animationDelay: "0.35s" }}>
              <span className="ca-depth-type">Cedar Point</span>
            </p>
            <p className="ca-rise m-0 mt-3 font-[family-name:var(--font-ui)] text-xs tracking-[0.22em] text-[#e6c27a] uppercase" style={{ animationDelay: "0.5s" }}>
              {wedding.shortDate} · {wedding.time}
            </p>
          </div>
        </div>
      </section>

      <section ref={dockRef} className={reduced ? "bg-[#10241c]" : "relative h-[420vh] bg-[#10241c]"} aria-label="On the dock">
        <div className={reduced ? "relative min-h-dvh overflow-hidden" : "sticky top-0 h-dvh overflow-hidden"}>
          <div className="absolute inset-[-8%]" style={{ transform: layer(dockRef.current, 34) }}>
            <div className="ca-plate absolute inset-0" style={{ ["--tilt" as string]: tilt(dockRef.current) }}>
              <img
                src="/photos/walk.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center"
                style={reduced ? undefined : { transform: `scale(${1.08 + dock * 0.14}) translate3d(0, ${dock * -4}%, 0)` }}
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-[#10241c]/45" style={{ transform: layer(dockRef.current, 12) }} />
          <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-[#f7f4ee]" style={{ transform: layer(dockRef.current, -26) }}>
            {reduced ? (
              <div className="grid gap-8">
                {wedding.dock.map((line) => (
                  <p key={line} className="m-0 font-[family-name:var(--font-serif)] text-[clamp(1.6rem,4vw,2.5rem)] leading-snug">
                    <span className="ca-depth-type">{line}</span>
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
                  <span className="ca-depth-type">{line}</span>
                </p>
              ))
            )}
          </div>
        </div>
      </section>

      <section ref={hoursRef} className={reduced ? "bg-[#1a120c] text-[#f7f4ee]" : "relative h-[460vh] bg-[#1a120c] text-[#f7f4ee]"} aria-label="Lantern hours">
        <div className={reduced ? "relative px-6 py-24" : "sticky top-0 flex h-dvh items-center overflow-hidden px-6"}>
          <div className="absolute inset-[-10%]" style={{ transform: layer(hoursRef.current, 48) }}>
            <div className="ca-plate absolute inset-0" style={{ ["--tilt" as string]: tilt(hoursRef.current) }}>
              <img src="/photos/couple.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" style={reduced ? undefined : { transform: `translate3d(0, ${hours * -8}%, 0) scale(1.12)` }} />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a120c]/70 via-[#1a120c]/55 to-[#1a120c]" style={{ transform: layer(hoursRef.current, 14) }} />
          <div className="absolute inset-0" style={{ transform: layer(hoursRef.current, -46) }}>
            <Lights />
          </div>
          <div className="relative mx-auto w-full max-w-lg" style={{ transform: layer(hoursRef.current, -22) }}>
            <p className="m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.34em] text-[#e6c27a] uppercase">The evening</p>
            {reduced ? (
              <ol className="mt-8 list-none p-0">
                {wedding.hours.map((item) => (
                  <li key={item.title} className="border-t border-white/15 py-5">
                    <p className="m-0 font-[family-name:var(--font-ui)] text-xs tracking-[0.22em] text-[#e6c27a] uppercase">{item.time}</p>
                    <p className="m-0 mt-1 font-[family-name:var(--font-serif)] text-3xl"><span className="ca-depth-type">{item.title}</span></p>
                    <p className="m-0 mt-1 text-white/75">{item.detail}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="relative mt-6 min-h-[12rem]">
                {wedding.hours.map((item, index) => (
                  <div key={item.title} className="absolute inset-x-0 top-0" style={beatStyle(hours, index * 0.22, index === wedding.hours.length - 1 ? 1 : (index + 1) * 0.22 + 0.05)}>
                    <p className="m-0 font-[family-name:var(--font-ui)] text-xs tracking-[0.28em] text-[#e6c27a] uppercase">{item.time}</p>
                    <p className="m-0 mt-2 font-[family-name:var(--font-script)] text-[clamp(3.2rem,10vw,5rem)] leading-none"><span className="ca-depth-type">{item.title}</span></p>
                    <p className="m-0 mt-4 max-w-[28ch] font-[family-name:var(--font-serif)] text-xl leading-relaxed text-white/80">{item.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section ref={tableRef} className="relative min-h-dvh overflow-hidden" aria-label="The long table">
        <div className="absolute inset-[-8%]" style={{ transform: layer(tableRef.current, 36) }}>
          <div className="ca-plate absolute inset-0" style={{ ["--tilt" as string]: tilt(tableRef.current) }}>
            <img src="/photos/dress.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
          </div>
        </div>
        <div className="absolute inset-0 bg-[#1c2a22]/55" style={{ transform: layer(tableRef.current, 12) }} />
        <div className="relative flex min-h-dvh flex-col items-center justify-end px-6 py-24 text-center text-[#f7f4ee]" style={{ transform: layer(tableRef.current, -28) }}>
          <Rise>
            <p className="m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.34em] text-[#e6c27a] uppercase">Supper</p>
          </Rise>
          <Rise delay="0.12s">
            <h2 className="m-0 mt-4 max-w-[16ch] font-[family-name:var(--font-serif)] text-[clamp(2rem,6vw,3.4rem)] leading-tight"><span className="ca-depth-type">A long table in the boathouse</span></h2>
          </Rise>
          <Rise delay="0.24s">
            <p className="m-0 mt-5 max-w-md font-[family-name:var(--font-serif)] text-xl leading-relaxed text-white/85">{wedding.dress}</p>
          </Rise>
          <Rise delay="0.36s">
            <p className="m-0 mt-6 font-[family-name:var(--font-ui)] text-xs tracking-[0.18em] text-[#e6c27a] uppercase">{wedding.address}</p>
          </Rise>
        </div>
      </section>

      <section ref={stayRef} className="bg-[#f4efe6] px-6 py-24" aria-label="Stay the weekend">
        <div style={{ transform: layer(stayRef.current, 18) }}>
        <Rise className="text-center">
          <p className="m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.34em] text-[#8d5a2b] uppercase">If you stay</p>
          <h2 className="m-0 mt-3 font-[family-name:var(--font-script)] text-6xl text-[#1c2a22]"><span className="ca-depth-ink">Come up Friday</span></h2>
        </Rise>
        </div>
        <div className="mx-auto mt-12 grid max-w-3xl gap-8" style={{ transform: layer(stayRef.current, -20) }}>
          {wedding.stays.map((stay, index) => (
            <Rise key={stay.name} delay={`${index * 0.1}s`}>
              <article className="border-t border-[#1c2a22]/15 pt-6">
                <h3 className="m-0 font-[family-name:var(--font-serif)] text-3xl"><span className="ca-depth-ink">{stay.name}</span></h3>
                <p className="m-0 mt-2 max-w-xl font-[family-name:var(--font-serif)] text-xl leading-relaxed text-[#1c2a22]/75">{stay.detail}</p>
              </article>
            </Rise>
          ))}
        </div>
      </section>

      <section ref={replyRef} className="relative overflow-hidden bg-[#10241c] px-6 py-24 text-[#f7f4ee]" aria-label="Reply">
        <div className="absolute inset-0" style={{ transform: layer(replyRef.current, -52) }}>
          <Leaves />
        </div>
        <div className="relative mx-auto max-w-md text-center" style={{ transform: layer(replyRef.current, -16) }}>
          <Rise>
            <h2 className="m-0 font-[family-name:var(--font-script)] text-6xl"><span className="ca-depth-type">Come up the lake</span></h2>
          </Rise>
          <Rise delay="0.12s">
            <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-xl text-white/75">Tell us your name and we will keep a chair by the fire.</p>
          </Rise>
          {sent ? (
            <p className="mt-10 font-[family-name:var(--font-serif)] text-2xl"><span className="ca-depth-type">A lantern on the dock has your name.</span></p>
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

      <section ref={lastRef} className="relative min-h-dvh overflow-hidden" aria-label="Last light">
        <div className="absolute inset-[-8%]" style={{ transform: layer(lastRef.current, 32) }}>
          <div className="ca-plate absolute inset-0" style={{ ["--tilt" as string]: tilt(lastRef.current) }}>
            <img src="/photos/rings.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
          </div>
        </div>
        <div className="absolute inset-0 bg-[#10241c]/50" style={{ transform: layer(lastRef.current, 10) }} />
        <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center text-[#f7f4ee]" style={{ transform: layer(lastRef.current, -24) }}>
          <Rise>
            <p className="m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.34em] text-[#e6c27a] uppercase">{wedding.place}</p>
          </Rise>
          <Rise delay="0.12s">
            <p className="m-0 mt-4 font-[family-name:var(--font-script)] text-[clamp(3rem,10vw,5.5rem)] leading-none"><span className="ca-depth-type">{wedding.bride}</span></p>
          </Rise>
          <Rise delay="0.22s">
            <p className="m-0 font-[family-name:var(--font-serif)] text-2xl italic text-[#e6c27a]">and</p>
          </Rise>
          <Rise delay="0.32s">
            <p className="m-0 font-[family-name:var(--font-script)] text-[clamp(3rem,10vw,5.5rem)] leading-none"><span className="ca-depth-type">{wedding.groom}</span></p>
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
