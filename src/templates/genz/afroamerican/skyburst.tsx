"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { themeVars } from "@/content";
import { skyburstDay as day } from "./skyburst-day";

const ORBIT = [
  { src: day.images.bouquet.src, focus: "center", delay: "0.4s", angle: 0 },
  { src: day.images.walk.src, focus: "center 40%", delay: "0.7s", angle: 72 },
  { src: day.images.rings.src, focus: "center", delay: "1s", angle: 144 },
  { src: day.images.kiss.src, focus: "center 36%", delay: "1.3s", angle: 216 },
  { src: day.images.dress.src, focus: "center", delay: "1.6s", angle: 288 },
];

const SPARKS = Array.from({ length: 28 }, (_, index) => ({
  left: `${6 + ((index * 17) % 88)}%`,
  top: `${10 + ((index * 23) % 70)}%`,
  delay: `${0.3 + (index % 10) * 0.35}s`,
  color: ["#ffd24a", "#ff5a5a", "#5dff9a", "#ff9a3c", "#fff1a8"][index % 5],
  size: 3 + (index % 5),
}));

const PRINTS = [
  { src: day.images.walk.src, focus: "center 40%", kicker: "01", line: day.dock[0], note: day.letter[0] },
  { src: day.images.bouquet.src, focus: "center", kicker: "02", line: day.dock[1], note: day.letter[1] },
  { src: day.images.rings.src, focus: "center", kicker: "03", line: day.dock[2], note: day.letter[2] },
  { src: day.images.kiss.src, focus: "center 36%", kicker: "04", line: day.dock[3], note: day.letter[3] },
  { src: day.images.dress.src, focus: "center", kicker: "05", line: day.hours[2].title, note: day.dress },
  { src: day.images.couple.src, focus: "center 30%", kicker: "06", line: `${day.time}. ${day.venue}.`, note: day.address },
];

export function Skyburst() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-clip bg-[#100808] text-[#f8f0e6]" style={themeVars(day.colors)}>
      <style>{`
        .sb-sky { opacity: 1; transition: opacity 1s ease; }
        .sb-sky.is-leaving { opacity: 0; }
        .sb-stage { position: absolute; inset: 0; perspective: 1100px; }
        .sb-ring { position: absolute; top: 50%; left: 50%; width: min(58vw, 22rem); height: min(58vw, 22rem); margin: calc(min(58vw, 22rem) / -2) 0 0 calc(min(58vw, 22rem) / -2); transform-style: preserve-3d; animation: sb-spin 11s linear 1.8s both; }
        .sb-slot { position: absolute; inset: 0; transform-style: preserve-3d; }
        .sb-card { position: absolute; inset: 0; border: 4px solid #ffd24a; box-shadow: 0 18px 50px rgba(0,0,0,0.45); opacity: 0; backface-visibility: hidden; animation: sb-in 1.1s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .sb-card img { width: 100%; height: 100%; object-fit: cover; }
        .sb-core { position: absolute; top: 50%; left: 50%; width: min(42vw, 16rem); height: min(42vw, 16rem); margin: calc(min(42vw, 16rem) / -2) 0 0 calc(min(42vw, 16rem) / -2); border-radius: 999px; overflow: hidden; border: 5px solid #ff5a5a; opacity: 0; transform: scale(0.4); animation: sb-core 2.4s cubic-bezier(0.16, 0.84, 0.3, 1) 11.8s forwards; box-shadow: 0 0 60px rgba(255, 90, 90, 0.45); }
        .sb-flare { position: absolute; inset: 0; background: radial-gradient(circle at 50% 48%, rgba(255, 210, 74, 0.55), transparent 48%); opacity: 0; animation: sb-flare 1.2s ease 13.8s both; }
        .sb-name { opacity: 0; animation: sb-name 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .sb-said { opacity: 0; animation: sb-said 3.4s ease 0.5s both; }
        .sb-rise { opacity: 0; transform: translateY(24px) scale(0.98); }
        .sb-rise.is-in { animation: sb-name 0.85s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .sb-ticker { animation: sb-ticker 16s linear infinite; }
        .sb-pop { animation: sb-pop 3.5s ease-in-out infinite; }
        .sb-photo { transition: transform 0.8s cubic-bezier(0.16, 0.84, 0.3, 1), filter 0.8s ease; filter: saturate(1.05) contrast(1.05); }
        .sb-photo:hover { transform: scale(1.03); filter: saturate(1.15) contrast(1.08); }
        @keyframes sb-spin { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        @keyframes sb-in { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }
        @keyframes sb-core { 0% { opacity: 0; transform: scale(0.4); } 55% { opacity: 1; transform: scale(1); } 100% { opacity: 1; transform: scale(2.55); border-radius: 0; border-width: 0; width: 100vmax; height: 100vmax; margin: -50vmax 0 0 -50vmax; } }
        @keyframes sb-flare { 0% { opacity: 0; } 35% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes sb-said { 0% { opacity: 0; transform: translateY(12px); } 18% { opacity: 1; transform: none; } 68% { opacity: 1; } 100% { opacity: 0; transform: translateY(-10px); } }
        @keyframes sb-name { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes sb-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes sb-pop { 0%, 100% { transform: scale(1); opacity: 0.55; } 50% { transform: scale(1.25); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .sb-ring, .sb-card, .sb-said, .sb-flare { display: none; }
          .sb-core, .sb-name, .sb-rise, .sb-ticker, .sb-pop { animation: none; opacity: 1; transform: none; border-radius: 0; }
          .sb-core { inset: 0; width: 100%; height: 100%; margin: 0; }
        }
      `}</style>
      {!open && <Orbit onDone={() => setOpen(true)} />}
      <Party live={open} />
    </div>
  );
}

function Orbit({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 20800);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 22000);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`sb-sky fixed inset-0 z-50 overflow-hidden bg-[#080406] text-[#f8f0e6] ${leaving ? "is-leaving" : ""}`} aria-label="Photos orbit the room, then the couple fills the sky">
      <div className="sb-stage z-[1]">
        <div className="sb-ring">
          {ORBIT.map((card) => (
            <div
              key={card.src}
              className="sb-slot"
              style={{ transform: `rotateY(${card.angle}deg) translateZ(min(34vw, 13rem))` }}
            >
              <div className="sb-card" style={{ animationDelay: card.delay }}>
                <img src={card.src} alt="" style={{ objectPosition: card.focus }} />
              </div>
            </div>
          ))}
        </div>
        <div className="sb-core">
          <img src={day.images.couple.src} alt="" className="size-full object-cover object-[center_30%]" />
        </div>
      </div>
      <div className="sb-flare z-[2]" />
      <p className="sb-said absolute inset-x-0 top-[10vh] z-[3] m-0 text-center font-[family-name:var(--font-display)] text-[clamp(1.4rem,4vw,2.4rem)] font-extrabold tracking-[-0.04em] text-[#ffd24a]">Hold still. The day is spinning.</p>
      <div className="absolute inset-x-0 bottom-[8vh] z-[4] px-6 text-center">
        <p className="sb-name m-0 text-[0.68rem] tracking-[0.28em] text-[#ffd24a] uppercase" style={{ animationDelay: "15s" }}>The center holds</p>
        <p className="sb-name m-0 mt-2 font-[family-name:var(--font-display)] text-[clamp(2.8rem,10vw,6.2rem)] leading-none font-extrabold tracking-[-0.06em]" style={{ animationDelay: "15.8s" }}>{day.first}</p>
        <p className="sb-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.8rem,10vw,6.2rem)] leading-none font-extrabold tracking-[-0.06em] text-[#ff5a5a]" style={{ animationDelay: "16.8s" }}>{day.second}</p>
        <p className="sb-name m-0 mt-4 font-[family-name:var(--font-serif)] text-2xl italic" style={{ animationDelay: "18s" }}>{day.time} · {day.shortDate}</p>
        <p className="sb-name m-0 mt-1 text-sm tracking-[0.14em] text-[#5dff9a] uppercase" style={{ animationDelay: "19s" }}>{day.venue}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[5] cursor-pointer border border-[#ffd24a]/50 bg-black/45 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Party({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="relative overflow-hidden bg-[#8b1520] px-6 py-16 text-[#f8f0e6]">
        {SPARKS.slice(0, 12).map((spark, index) => (
          <span key={`live-${index}`} className="sb-pop absolute rounded-full" style={{ left: spark.left, top: spark.top, width: spark.size + 2, height: spark.size + 2, background: spark.color, animationDelay: spark.delay }} />
        ))}
        <p className="relative m-0 text-[0.68rem] tracking-[0.28em] text-[#ffd24a] uppercase">{day.place}</p>
        <h1 className="relative m-0 mt-3 font-[family-name:var(--font-display)] text-[clamp(3.2rem,11vw,6.8rem)] leading-[0.84] font-extrabold tracking-[-0.06em]">
          {day.first}
          <span className="block text-[#ffd24a]">{day.second}</span>
        </h1>
        <p className="relative m-0 mt-4 font-[family-name:var(--font-serif)] text-2xl italic">{day.dateLabel} · {day.time}</p>
        <p className="relative m-0 mt-1">{day.venue}</p>
      </section>
      <div className="overflow-hidden bg-[#0d1f12] py-3">
        <p className="sb-ticker m-0 w-max font-[family-name:var(--font-display)] text-sm font-extrabold tracking-[0.2em] text-[#5dff9a] uppercase">{`Boom · Love · Family · Fire · ${day.couple} · `.repeat(8)}</p>
      </div>
      <section className="mx-auto max-w-3xl px-6 py-14">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] leading-snug font-extrabold tracking-[-0.04em]">{day.arrival}</p>
        </Rise>
        <div className="mt-8 grid gap-5">
          {day.letter.map((paragraph) => (
            <Rise key={paragraph} live={live}>
              <p className="m-0 text-lg leading-relaxed text-[#f8f0e6]/85">{paragraph}</p>
            </Rise>
          ))}
        </div>
      </section>
      {PRINTS.map((print, index) => (
        <section key={print.kicker} className={index % 2 ? "flex min-h-[78vh] items-center bg-[#1a0c0c]" : "flex min-h-[78vh] items-center bg-[#100808]"}>
          <div className="mx-auto grid max-w-6xl items-center gap-6 px-6 py-12 md:grid-cols-2">
            <Rise live={live}>
              <img src={print.src} alt="" className="sb-photo aspect-[5/4] w-full object-cover shadow-[12px_12px_0_#ff5a5a]" style={{ objectPosition: print.focus }} />
            </Rise>
            <Rise live={live}>
              <p className="m-0 font-[family-name:var(--font-display)] text-6xl leading-none font-extrabold text-[#ffd24a]">{print.kicker}</p>
              <p className="m-0 mt-3 font-[family-name:var(--font-display)] text-[clamp(1.6rem,3vw,2.4rem)] leading-snug font-extrabold tracking-[-0.04em]">{print.line}</p>
              <p className="m-0 mt-3 text-lg leading-relaxed opacity-80">{print.note}</p>
            </Rise>
          </div>
        </section>
      ))}
      <section className="bg-[#ff5a5a] px-6 py-16 text-[#100808]">
        <p className="m-0 text-xs font-extrabold tracking-[0.24em] uppercase">The sparks of the day</p>
        <ol className="m-0 mt-8 grid list-none gap-6 p-0 md:grid-cols-2">
          {day.hours.map((hour) => (
            <li key={hour.time} className="bg-[#100808] p-5 text-[#f8f0e6]">
              <Rise live={live}>
                <p className="m-0 font-[family-name:var(--font-display)] text-5xl font-extrabold text-[#ffd24a]">{hour.time}</p>
                <h2 className="m-0 mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold">{hour.title}</h2>
                <p className="m-0 mt-2 text-[#f8f0e6]/80">{hour.detail}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Rise live={live}>
          <p className="m-0 text-xs font-extrabold tracking-[0.22em] text-[#ffd24a] uppercase">Where to stay</p>
          <ul className="m-0 mt-4 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-t border-[#f8f0e6]/15 py-4">
                <p className="m-0 font-[family-name:var(--font-display)] text-2xl font-extrabold">{stay.name}</p>
                <p className="m-0 mt-1 text-[#f8f0e6]/80">{stay.detail}</p>
              </li>
            ))}
          </ul>
          <p className="m-0 mt-10 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-[-0.04em]">Save me a spark</p>
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
    const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) setOn(true); }, { threshold: 0.16 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [live]);
  return <div ref={ref} className={`sb-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-display)] text-3xl font-extrabold">We saved you a spark, {sent}.</p>;
  return (
    <form className="mt-6 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#f8f0e6]/25 bg-transparent px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#f8f0e6]/25 bg-[#1a0c0c] px-3 text-base text-[#f8f0e6]">
          <option>Friday</option><option>Saturday</option><option>For the fireworks</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#f8f0e6]/25 bg-transparent px-3 py-2 text-base" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[#ffd24a] px-5 text-base text-[#100808]">I am coming</button>
    </form>
  );
}
