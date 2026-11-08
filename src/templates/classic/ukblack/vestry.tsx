"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { themeVars } from "@/content";
import { vestryDay as day } from "./vestry-day";

const CANDLES = Array.from({ length: 8 }, (_, index) => ({
  left: `${10 + index * 10.5}%`,
  delay: `${0.8 + index * 0.55}s`,
  height: 28 + (index % 3) * 8,
}));

const MEDALLIONS = [
  { src: day.images.bouquet.src, delay: "2.4s", left: "12%", bottom: "28%" },
  { src: day.images.rings.src, delay: "4s", left: "38%", bottom: "34%" },
  { src: day.images.walk.src, delay: "5.6s", left: "64%", bottom: "26%" },
];

const CHAPTERS = [
  { src: day.images.walk.src, focus: "center 40%", title: "The dock", line: day.dock[0], note: day.letter[0] },
  { src: day.images.bouquet.src, focus: "center", title: "The flowers", line: day.dock[1], note: day.letter[1] },
  { src: day.images.rings.src, focus: "center", title: "The rings", line: day.dock[2], note: day.letter[2] },
  { src: day.images.kiss.src, focus: "center 40%", title: "Before the light goes", line: day.dock[3], note: day.letter[3] },
  { src: day.images.dress.src, focus: "center", title: "Supper", line: day.hours[2].detail, note: day.dress },
  { src: day.images.couple.src, focus: "center 32%", title: "Claire and Thomas", line: `${day.time}. ${day.venue}.`, note: day.address },
];

export function Vestry() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-clip bg-[var(--w-bg)] text-[var(--w-ink)]" style={themeVars(day.colors)}>
      <style>{`
        .vs-sky { opacity: 1; transition: opacity 1s ease; }
        .vs-sky.is-leaving { opacity: 0; }
        .vs-candle { position: absolute; bottom: 18%; width: 6px; border-radius: 3px 3px 0 0; background: linear-gradient(#f7f0e0, #d4b07a); transform-origin: bottom; transform: scaleY(0); animation: vs-candle 1.1s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .vs-flame { position: absolute; left: 50%; bottom: 100%; width: 10px; height: 16px; margin-left: -5px; border-radius: 50% 50% 40% 40%; background: radial-gradient(circle at 50% 70%, #fff4c0, #e8a020 55%, transparent 70%); opacity: 0; animation: vs-flame 0.8s ease both, vs-flicker 1.6s ease-in-out infinite; }
        .vs-med { position: absolute; width: min(22vw, 8.5rem); aspect-ratio: 1; border-radius: 999px; overflow: hidden; border: 4px solid var(--w-accent); opacity: 0; transform: translateY(24px) scale(0.85); animation: vs-med 1.4s cubic-bezier(0.16, 0.84, 0.3, 1) both; box-shadow: 0 16px 40px rgba(0,0,0,0.35); }
        .vs-aisle { position: absolute; inset-x: 18%; bottom: 0; height: 42%; background: linear-gradient(to top, color-mix(in srgb, var(--w-accent) 20%, transparent), transparent); opacity: 0; animation: vs-aisle 2s ease 1s forwards; }
        .vs-name { opacity: 0; animation: vs-name 1.2s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .vs-rise { opacity: 0; transform: translateY(22px); }
        .vs-rise.is-in { animation: vs-name 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .vs-drift { animation: vs-drift 28s ease-in-out infinite alternate; }
        @keyframes vs-candle { to { transform: scaleY(1); } }
        @keyframes vs-flame { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
        @keyframes vs-flicker { 0%, 100% { transform: scale(1) translateY(0); } 50% { transform: scale(1.08) translateY(-2px); } }
        @keyframes vs-med { to { opacity: 1; transform: none; } }
        @keyframes vs-aisle { to { opacity: 1; } }
        @keyframes vs-name { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes vs-drift { from { transform: scale(1.04); } to { transform: scale(1.1) translate3d(-1%, -1%, 0); } }
        @media (prefers-reduced-motion: reduce) {
          .vs-candle, .vs-flame, .vs-med, .vs-aisle { animation: none; opacity: 1; transform: none; }
          .vs-name, .vs-rise, .vs-drift { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
      {!open && <Aisle onDone={() => setOpen(true)} />}
      <Service live={open} />
    </div>
  );
}

function Aisle({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 19800);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 21000);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`vs-sky fixed inset-0 z-50 overflow-hidden bg-[#120e0c] text-[#f3ebe0] ${leaving ? "is-leaving" : ""}`} aria-label="Candles light the aisle, then the couple waits at the end">
      <img src={day.images.couple.src} alt="" className="absolute inset-0 size-full object-cover object-[center_30%] opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#120e0c] via-[#120e0c]/55 to-[#120e0c]/70" />
      <div className="vs-aisle" />
      {CANDLES.map((candle) => (
        <div key={candle.left} className="vs-candle z-[2]" style={{ left: candle.left, height: candle.height, animationDelay: candle.delay }}>
          <span className="vs-flame" style={{ animationDelay: `calc(${candle.delay} + 0.5s), calc(${candle.delay} + 0.5s)` }} />
        </div>
      ))}
      {MEDALLIONS.map((med) => (
        <div key={med.src} className="vs-med z-[3]" style={{ left: med.left, bottom: med.bottom, animationDelay: med.delay }}>
          <img src={med.src} alt="" className="size-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-[7vh] z-[4] px-6 text-center">
        <p className="vs-name m-0 text-[0.68rem] tracking-[0.28em] text-[var(--w-accent)] uppercase" style={{ animationDelay: "12.4s" }}>Down the aisle</p>
        <p className="vs-name m-0 mt-2 font-[family-name:var(--font-serif)] text-[clamp(2.8rem,8vw,5.4rem)] leading-none" style={{ animationDelay: "13.4s" }}>{day.first}</p>
        <p className="vs-name m-0 font-[family-name:var(--font-script)] text-[clamp(2rem,5vw,3.2rem)] text-[var(--w-accent)]" style={{ animationDelay: "14.6s" }}>and {day.second}</p>
        <p className="vs-name m-0 mt-3 text-sm tracking-[0.18em] uppercase" style={{ animationDelay: "16s" }}>{day.dateLabel}</p>
        <p className="vs-name m-0 mt-1 font-[family-name:var(--font-serif)] text-xl italic" style={{ animationDelay: "17.2s" }}>{day.time} · {day.venue}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[5] cursor-pointer border border-[#c9a45c]/50 bg-black/40 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Service({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="relative min-h-dvh">
        <img src={day.images.couple.src} alt="Claire and Thomas" className="vs-drift absolute inset-0 size-full object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120e0c] via-[#120e0c]/35 to-[#120e0c]/45" />
        <div className="relative flex min-h-dvh flex-col items-center justify-end px-6 pb-16 text-center text-[#f3ebe0]">
          <p className="m-0 text-[0.68rem] tracking-[0.34em] text-[var(--w-accent)] uppercase">{day.place}</p>
          <h1 className="m-0 mt-4 font-[family-name:var(--font-serif)] text-[clamp(3.2rem,8vw,6rem)] leading-[0.9]">
            {day.first}
            <span className="mt-1 block font-[family-name:var(--font-script)] text-[clamp(2.2rem,5vw,3.6rem)] text-[var(--w-accent)]">and</span>
            {day.second}
          </h1>
          <p className="m-0 mt-4 text-sm tracking-[0.18em] uppercase">{day.dateLabel}</p>
          <p className="m-0 mt-2 font-[family-name:var(--font-serif)] text-2xl italic">{day.time}</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Rise live={live}><p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(2rem,4vw,3.2rem)] leading-snug italic">{day.arrival}</p></Rise>
        <div className="mt-10 grid gap-6">
          {day.letter.map((paragraph) => (
            <Rise key={paragraph} live={live}><p className="m-0 text-lg leading-relaxed">{paragraph}</p></Rise>
          ))}
        </div>
      </section>
      {CHAPTERS.map((chapter, index) => (
        <section key={chapter.title} className={`mx-auto grid max-w-6xl items-center gap-8 px-6 py-12 md:grid-cols-2 md:py-16 ${index % 2 ? "bg-[#e8dcc8]" : ""}`}>
          <Rise live={live}>
            <img src={chapter.src} alt="" className={`aspect-[4/5] w-full object-cover ${index % 2 ? "md:order-2" : ""}`} style={{ objectPosition: chapter.focus }} />
          </Rise>
          <Rise live={live}>
            <div className={index % 2 ? "md:order-1" : ""}>
              <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#8a5a18] uppercase">{chapter.title}</p>
              <p className="m-0 mt-3 font-[family-name:var(--font-serif)] text-[clamp(1.8rem,3vw,2.8rem)] leading-snug">{chapter.line}</p>
              <p className="m-0 mt-4 text-lg leading-relaxed">{chapter.note}</p>
            </div>
          </Rise>
        </section>
      ))}
      <section className="bg-[#2a1810] px-6 py-20 text-[#f3ebe0]">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          <Rise live={live}>
            <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[var(--w-accent)] uppercase">The hours</p>
            <ol className="m-0 mt-8 list-none p-0">
              {day.hours.map((hour) => (
                <li key={hour.time} className="border-t border-[#c9a45c]/25 py-5">
                  <p className="m-0 font-[family-name:var(--font-serif)] text-4xl text-[var(--w-accent)]">{hour.time}</p>
                  <h2 className="m-0 mt-1 font-[family-name:var(--font-serif)] text-3xl">{hour.title}</h2>
                  <p className="m-0 mt-2 text-[#f3ebe0]/80">{hour.detail}</p>
                </li>
              ))}
            </ol>
          </Rise>
          <Rise live={live}>
            <img src={day.images.walk.src} alt="" className="aspect-[3/4] w-full object-cover object-[center_40%]" />
            <p className="m-0 mt-6 font-[family-name:var(--font-serif)] text-2xl leading-snug">{day.dress}</p>
          </Rise>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-script)] text-5xl text-[#8a5a18]">Save me a candle</p>
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setOn(true); return; }
    const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) setOn(true); }, { threshold: 0.18 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [live]);
  return <div ref={ref} className={`vs-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-serif)] text-3xl italic">A candle is lit for you, {sent}.</p>;
  return (
    <form className="mx-auto mt-8 grid max-w-md gap-3 text-left" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#1a1410]/20 bg-white/80 px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#1a1410]/20 bg-[#f3ebe0] px-3 text-base">
          <option>Friday</option><option>Saturday</option><option>Already by the water</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#1a1410]/20 bg-white/80 px-3 py-2 text-base" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[#2a1810] px-5 text-base text-[#f3ebe0]">Keep my place</button>
    </form>
  );
}
