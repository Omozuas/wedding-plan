"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { themeVars } from "@/content";
import { basslineDay as day } from "./bassline-day";

const FLASHES = [
  { src: day.images.bouquet.src, focus: "center", delay: "0.6s" },
  { src: day.images.walk.src, focus: "center 40%", delay: "1.7s" },
  { src: day.images.rings.src, focus: "center", delay: "2.8s" },
  { src: day.images.kiss.src, focus: "center 35%", delay: "3.9s" },
  { src: day.images.dress.src, focus: "center", delay: "5s" },
];

const POSTER_WORDS = (day.extras.posterWords as string[] | undefined) ?? ["DOCK", "GOLD", "VOW", "HOLD"];
const POSTERS = [
  { src: day.images.walk.src, focus: day.images.walk.focus, word: POSTER_WORDS[0], line: day.dock[0], note: day.letter[0] },
  { src: day.images.bouquet.src, focus: day.images.bouquet.focus, word: POSTER_WORDS[1], line: day.dock[1], note: day.letter[1] },
  { src: day.images.rings.src, focus: day.images.rings.focus, word: POSTER_WORDS[2], line: day.dock[2], note: day.letter[2] },
  { src: day.images.kiss.src, focus: day.images.kiss.focus, word: POSTER_WORDS[3], line: day.dock[3], note: day.letter[3] },
];

export function Bassline() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-clip bg-[var(--w-bg)] text-[var(--w-ink)]" style={themeVars(day.colors)}>
      <style>{`
        .bs-sky { opacity: 1; transition: opacity 0.9s ease; }
        .bs-sky.is-leaving { opacity: 0; }
        .bs-flash { position: absolute; inset: 0; opacity: 0; animation: bs-flash 1s ease both; }
        .bs-flash img { width: 100%; height: 100%; object-fit: cover; }
        .bs-white { position: absolute; inset: 0; background: #fff; opacity: 0; animation: bs-white 0.35s ease both; }
        .bs-wave { position: absolute; left: 5%; right: 5%; top: 42%; height: 2px; background: var(--w-accent); transform: scaleX(0); transform-origin: left; animation: bs-wave 2.4s cubic-bezier(0.16, 0.84, 0.3, 1) 6.4s forwards; box-shadow: 0 0 18px var(--w-accent); }
        .bs-wave::before, .bs-wave::after { content: ""; position: absolute; left: 0; right: 0; height: 2px; background: var(--w-accent-alt); opacity: 0.7; }
        .bs-wave::before { top: -14px; transform: scaleX(0.7); }
        .bs-wave::after { top: 14px; transform: scaleX(0.55); }
        .bs-hold { position: absolute; inset: 0; opacity: 0; animation: bs-hold 2.2s ease 8.2s forwards; }
        .bs-name { opacity: 0; animation: bs-name 0.85s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .bs-rise { opacity: 0; transform: translateY(22px); }
        .bs-rise.is-in { animation: bs-name 0.85s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        @keyframes bs-flash { 0% { opacity: 0; transform: scale(1.08); } 12% { opacity: 1; transform: scale(1); } 70% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes bs-white { 0% { opacity: 0; } 30% { opacity: 0.9; } 100% { opacity: 0; } }
        @keyframes bs-wave { to { transform: scaleX(1); } }
        @keyframes bs-hold { from { opacity: 0; transform: scale(1.05); } to { opacity: 1; transform: none; } }
        @keyframes bs-name { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .bs-flash, .bs-white, .bs-wave { display: none; }
          .bs-hold, .bs-name, .bs-rise { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
      {!open && <Strobe onDone={() => setOpen(true)} />}
      <Poster live={open} />
    </div>
  );
}

function Strobe({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 17200);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 18400);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`bs-sky fixed inset-0 z-50 overflow-hidden bg-[var(--w-bg)] text-[var(--w-ink)] ${leaving ? "is-leaving" : ""}`} aria-label="Strobe flashes cut the day, a neon wave holds on the couple">
      {FLASHES.map((flash) => (
        <div key={flash.src + flash.delay}>
          <div className="bs-white z-[2]" style={{ animationDelay: flash.delay }} />
          <div className="bs-flash z-[1]" style={{ animationDelay: `calc(${flash.delay} + 0.08s)` }}>
            <img src={flash.src} alt="" style={{ objectPosition: flash.focus }} />
          </div>
        </div>
      ))}
      <div className="bs-wave z-[3]" />
      <img src={day.images.couple.src} alt="" className="bs-hold z-[4] size-full object-cover object-[center_30%]" />
      <div className="absolute inset-0 z-[5] bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/40" />
      <div className="absolute inset-x-0 bottom-[8vh] z-[6] px-6 text-center">
        <p className="bs-name m-0 text-[0.68rem] tracking-[0.28em] text-[var(--w-accent)] uppercase" style={{ animationDelay: "10.4s" }}>Cut to us</p>
        <p className="bs-name m-0 mt-2 font-[family-name:var(--font-display)] text-[clamp(2.8rem,10vw,6.2rem)] leading-none font-extrabold tracking-[-0.06em]" style={{ animationDelay: "11.2s" }}>{day.first}</p>
        <p className="bs-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.8rem,10vw,6.2rem)] leading-none font-extrabold tracking-[-0.06em] text-[var(--w-accent-alt)]" style={{ animationDelay: "12.2s" }}>{day.second}</p>
        <p className="bs-name m-0 mt-3 font-[family-name:var(--font-serif)] text-2xl italic" style={{ animationDelay: "13.4s" }}>{day.time} · {day.shortDate}</p>
        <p className="bs-name m-0 mt-1 text-sm tracking-[0.14em] uppercase" style={{ animationDelay: "14.4s" }}>{day.venue}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[7] cursor-pointer border border-[var(--w-accent)]/50 bg-black/45 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Poster({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="relative min-h-dvh overflow-hidden">
        <img src={day.images.couple.src} alt="" className="absolute inset-0 size-full object-cover object-[center_30%] brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/30 to-transparent" />
        <div className="relative flex min-h-dvh flex-col justify-end px-5 pb-14">
          <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[var(--w-accent-alt)] uppercase">{day.place}</p>
          <h1 className="m-0 mt-2 font-[family-name:var(--font-display)] text-[clamp(3.6rem,14vw,8rem)] leading-[0.78] font-extrabold tracking-[-0.07em]">
            <span className="text-[var(--w-accent)]">{day.first}</span>
            <span className="block">{day.second}</span>
          </h1>
          <p className="m-0 mt-4 max-w-sm text-sm tracking-[0.12em] uppercase">{day.dateLabel} · {day.time}</p>
          <p className="m-0 mt-1 text-[var(--w-accent-alt)]">{day.venue}</p>
        </div>
      </section>

      <section className="border-y border-[var(--w-accent)]/40 bg-[var(--w-surface)] px-5 py-12">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-display)] text-[clamp(1.8rem,5vw,3rem)] leading-snug font-extrabold tracking-[-0.04em]">{day.arrival}</p>
          <div className="mt-8 grid gap-4">
            {day.letter.map((paragraph) => (
              <p key={paragraph} className="m-0 border-l-2 border-[#4df0ff] pl-4 text-lg leading-relaxed text-[#f4f1ea]/85">{paragraph}</p>
            ))}
          </div>
        </Rise>
      </section>

      {POSTERS.map((poster) => (
        <section key={poster.word} className="relative min-h-[85vh] overflow-hidden">
          <img src={poster.src} alt="" className="absolute inset-0 size-full object-cover brightness-60" style={{ objectPosition: poster.focus }} />
          <div className="absolute inset-0 bg-[#050507]/35" />
          <div className="relative flex min-h-[85vh] flex-col justify-between px-5 py-10">
            <Rise live={live}>
              <p className="m-0 font-[family-name:var(--font-display)] text-[clamp(4.5rem,18vw,10rem)] leading-none font-extrabold tracking-[-0.08em] text-[var(--w-accent)] mix-blend-screen">{poster.word}</p>
            </Rise>
            <Rise live={live}>
              <p className="m-0 max-w-md font-[family-name:var(--font-display)] text-[clamp(1.6rem,4vw,2.4rem)] leading-snug font-extrabold tracking-[-0.04em]">{poster.line}</p>
              <p className="m-0 mt-3 max-w-md text-lg text-[#f4f1ea]/85">{poster.note}</p>
            </Rise>
          </div>
        </section>
      ))}

      <section className="bg-[var(--w-accent-alt)] px-5 py-14 text-[var(--w-bg)]">
        <p className="m-0 text-xs font-extrabold tracking-[0.24em] uppercase">Cue sheet</p>
        <ol className="m-0 mt-8 grid list-none gap-4 p-0">
          {day.hours.map((hour) => (
            <li key={hour.time}>
              <Rise live={live}>
                <article className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-[#050507]/20 pb-4">
                  <p className="m-0 font-[family-name:var(--font-display)] text-5xl font-extrabold tracking-[-0.06em]">{hour.time}</p>
                  <h2 className="m-0 font-[family-name:var(--font-display)] text-2xl font-extrabold">{hour.title}</h2>
                  <p className="m-0 w-full text-base opacity-80 md:w-auto md:flex-1">{hour.detail}</p>
                </article>
              </Rise>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-5 py-16">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.4rem,8vw,4rem)] font-extrabold tracking-[-0.05em] text-[var(--w-accent)]">Put me on the list</p>
          <p className="m-0 mt-3 max-w-lg text-lg text-[#f4f1ea]/80">{day.dress}</p>
          <Reply />
        </Rise>
      </section>
    </div>
  );
}

function Rise({ live, children }: { live: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!live) return;
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setOn(true);
    }, { threshold: 0.16 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [live]);
  return <div ref={ref} className={`bs-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-display)] text-3xl font-extrabold">You are on the list, {sent}.</p>;
  return (
    <form className="mt-6 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#f4f1ea]/25 bg-transparent px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#f4f1ea]/25 bg-[var(--w-surface)] px-3 text-base text-[#f4f1ea]">
          <option>Friday</option><option>Saturday</option><option>For the drop</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#f4f1ea]/25 bg-transparent px-3 py-2 text-base" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[var(--w-accent)] px-5 text-base text-[var(--w-bg)]">I am coming</button>
    </form>
  );
}
