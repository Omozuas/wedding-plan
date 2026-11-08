"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { themeVars } from "@/content";
import { strideDay as day } from "./stride-day";

const KEYS = Array.from({ length: 10 }, (_, index) => index);

const SPARKS = [
  { left: "12%", top: "18%", delay: "0.4s", size: 6 },
  { left: "78%", top: "22%", delay: "1.1s", size: 8 },
  { left: "24%", top: "70%", delay: "1.8s", size: 5 },
  { left: "88%", top: "64%", delay: "2.4s", size: 7 },
  { left: "48%", top: "12%", delay: "0.9s", size: 4 },
  { left: "62%", top: "78%", delay: "2.9s", size: 6 },
  { left: "6%", top: "48%", delay: "1.5s", size: 5 },
  { left: "92%", top: "40%", delay: "2.1s", size: 7 },
];

const BEATS = [
  { src: day.images.walk.src, focus: "center 40%", time: "01", line: day.dock[0], note: day.letter[0], ink: "#f6efe2", wash: "#0d0a08" },
  { src: day.images.bouquet.src, focus: "center", time: "02", line: day.dock[1], note: day.letter[1], ink: "#0d0a08", wash: "#c9a227" },
  { src: day.images.rings.src, focus: "center", time: "03", line: day.dock[2], note: day.letter[2], ink: "#f6efe2", wash: "#4a1c6b" },
  { src: day.images.kiss.src, focus: "center 40%", time: "04", line: day.dock[3], note: day.letter[3], ink: "#0d0a08", wash: "#f6efe2" },
  { src: day.images.dress.src, focus: "center", time: "05", line: day.hours[2].title, note: day.hours[2].detail, ink: "#f6efe2", wash: "#1a0f08" },
  { src: day.images.couple.src, focus: "center 30%", time: "06", line: day.arrival, note: day.address, ink: "#0d0a08", wash: "#c9a227" },
];

export function Stride() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-clip bg-[#0d0a08] text-[#f6efe2]" style={themeVars(day.colors)}>
      <style>{`
        .st-sky { opacity: 1; transition: opacity 0.9s ease; }
        .st-sky.is-leaving { opacity: 0; }
        .st-key { transform: scaleY(0); transform-origin: bottom; animation: st-key 1.1s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .st-key-up { animation: st-up 1.35s cubic-bezier(0.7, 0, 0.2, 1) forwards; }
        .st-key-down { animation: st-down 1.35s cubic-bezier(0.7, 0, 0.2, 1) forwards; }
        .st-arrive { opacity: 0; animation: st-arrive 2.4s ease 8.2s forwards; }
        .st-name { opacity: 0; animation: st-name 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .st-pulse { opacity: 0; animation: st-pulse 1.6s ease 14.8s both; }
        .st-rise { opacity: 0; transform: translateY(22px); }
        .st-rise.is-in { animation: st-name 0.85s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .st-marquee { animation: st-marquee 20s linear infinite; }
        .st-spark { position: absolute; border-radius: 999px; background: radial-gradient(circle, #ffe9a0, #c9a227 55%, transparent); opacity: 0; animation: st-spark 3.2s ease-in-out infinite; }
        .st-frame { animation: st-glow 4.5s ease-in-out infinite alternate; }
        @keyframes st-key { to { transform: scaleY(1); } }
        @keyframes st-up { to { transform: translateY(-110%); } }
        @keyframes st-down { to { transform: translateY(110%); } }
        @keyframes st-arrive { from { opacity: 0; transform: scale(1.08); } to { opacity: 1; transform: none; } }
        @keyframes st-name { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @keyframes st-pulse { 0% { opacity: 0; transform: scale(0.9); } 25% { opacity: 1; transform: scale(1.05); } 50% { transform: scale(1); } 75% { transform: scale(1.03); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes st-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes st-spark { 0%, 100% { opacity: 0; transform: scale(0.4) translateY(0); } 40% { opacity: 1; transform: scale(1) translateY(-12px); } 70% { opacity: 0.6; } }
        @keyframes st-glow { from { box-shadow: 0 0 0 0 rgba(201, 162, 39, 0.2); } to { box-shadow: 0 0 40px 4px rgba(201, 162, 39, 0.35); } }
        @media (prefers-reduced-motion: reduce) {
          .st-key, .st-key-up, .st-key-down, .st-spark { display: none; }
          .st-arrive, .st-name, .st-pulse, .st-rise, .st-marquee, .st-frame { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
      {!open && <Keys onDone={() => setOpen(true)} />}
      <Club live={open} />
    </div>
  );
}

function Keys({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 18400);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 19600);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`st-sky fixed inset-0 z-50 overflow-hidden bg-[#0d0a08] text-[#f6efe2] ${leaving ? "is-leaving" : ""}`} aria-label="Piano keys open on the beat, then the couple arrives">
      <img src={day.images.walk.src} alt="" className="absolute inset-0 size-full object-cover object-[center_40%] opacity-40" />
      <img src={day.images.couple.src} alt="" className="st-arrive absolute inset-0 size-full object-cover object-[center_30%]" />
      <div className="absolute inset-0 z-[1] flex">
        {KEYS.map((index) => (
          <div key={index} className={`h-full flex-1 overflow-hidden ${index % 2 ? "st-key-down" : "st-key-up"}`} style={{ animationDelay: `${6.2 + index * 0.07}s` }}>
            <div
              className={`st-key h-full w-full ${index % 3 === 1 ? "bg-[#4a1c6b]" : index % 2 ? "bg-[#c9a227]" : "bg-[#f6efe2]"}`}
              style={{ animationDelay: `${0.2 + index * 0.14}s` }}
            />
          </div>
        ))}
      </div>
      {SPARKS.map((spark) => (
        <span key={spark.left + spark.top} className="st-spark z-[2]" style={{ left: spark.left, top: spark.top, width: spark.size, height: spark.size, animationDelay: spark.delay }} />
      ))}
      <div className="absolute inset-x-0 bottom-[8vh] z-[3] px-6 text-center">
        <p className="st-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.8rem,10vw,6rem)] leading-none font-extrabold tracking-[-0.06em]" style={{ animationDelay: "11s" }}>{day.first}</p>
        <p className="st-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.8rem,10vw,6rem)] leading-none font-extrabold tracking-[-0.06em] text-[#c9a227]" style={{ animationDelay: "12.4s" }}>{day.second}</p>
        <p className="st-pulse m-0 mt-4 font-[family-name:var(--font-display)] text-[clamp(1.2rem,3vw,2rem)] font-extrabold tracking-[-0.04em]">{day.time}</p>
        <p className="st-name m-0 mt-2 text-sm tracking-[0.16em] uppercase" style={{ animationDelay: "16s" }}>{day.dateLabel} · {day.place}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[4] cursor-pointer border border-[#c9a227]/50 bg-black/45 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Club({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="relative min-h-dvh">
        <img src={day.images.couple.src} alt="Claire and Thomas at the lake" className="absolute inset-0 size-full object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a08] via-[#0d0a08]/35 to-[#4a1c6b]/25" />
        {SPARKS.map((spark) => (
          <span key={`live-${spark.left}`} className="st-spark z-[1]" style={{ left: spark.left, top: spark.top, width: spark.size, height: spark.size, animationDelay: spark.delay }} />
        ))}
        <div className="relative flex min-h-dvh flex-col justify-end px-6 pt-16 pb-20">
          <p className="m-0 text-[0.68rem] font-semibold tracking-[0.28em] text-[#c9a227] uppercase">{day.place}</p>
          <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(3rem,9vw,6rem)] leading-[0.84] font-extrabold tracking-[-0.06em]">{day.first}</h1>
          <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(3rem,9vw,6rem)] leading-[0.84] font-extrabold tracking-[-0.06em] text-[#c9a227]">{day.second}</h1>
          <p className="m-0 mt-3 text-sm font-semibold tracking-[0.14em] uppercase">{day.dateLabel} · {day.time}</p>
        </div>
      </section>
      <div className="overflow-hidden bg-[#4a1c6b] py-3">
        <p className="st-marquee m-0 w-max font-[family-name:var(--font-display)] text-sm font-extrabold tracking-[0.18em] uppercase text-[#c9a227]">{`${day.venue} · ${day.time} · ${day.place} · `.repeat(6)}</p>
      </div>
      {BEATS.map((beat) => (
        <section key={beat.time} className="grid min-h-[82vh] md:grid-cols-2" style={{ background: beat.wash, color: beat.ink }}>
          <img src={beat.src} alt="" className="st-frame h-80 w-full object-cover md:h-auto" style={{ objectPosition: beat.focus }} />
          <div className="flex flex-col justify-end px-6 py-12 md:px-12">
            <Rise live={live}>
              <p className="m-0 font-[family-name:var(--font-display)] text-7xl leading-none font-extrabold tracking-[-0.06em]">{beat.time}</p>
              <p className="m-0 mt-4 max-w-md font-[family-name:var(--font-display)] text-[clamp(1.7rem,3vw,2.6rem)] leading-snug font-extrabold tracking-[-0.04em]">{beat.line}</p>
              <p className="m-0 mt-3 max-w-md text-lg leading-relaxed">{beat.note}</p>
            </Rise>
          </div>
        </section>
      ))}
      <section className="bg-[#c9a227] px-6 py-16 text-[#0d0a08] md:px-12">
        <p className="m-0 text-xs font-extrabold tracking-[0.24em] uppercase">The downbeats</p>
        <ol className="m-0 mt-8 grid list-none gap-6 p-0 md:grid-cols-2">
          {day.hours.map((hour) => (
            <li key={hour.time} className="border-t-4 border-[#0d0a08] pt-4">
              <Rise live={live}>
                <p className="m-0 font-[family-name:var(--font-display)] text-5xl font-extrabold tracking-[-0.05em]">{hour.time}</p>
                <h2 className="m-0 mt-1 font-[family-name:var(--font-display)] text-3xl font-extrabold">{hour.title}</h2>
                <p className="m-0 mt-2 max-w-md">{hour.detail}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>
      <section className="grid gap-8 bg-[#f6efe2] px-6 py-16 text-[#0d0a08] md:grid-cols-2 md:px-12">
        <Rise live={live}>
          <p className="m-0 text-xs font-extrabold tracking-[0.22em] text-[#4a1c6b] uppercase">What to wear</p>
          <p className="m-0 mt-3 font-[family-name:var(--font-display)] text-3xl leading-snug font-extrabold tracking-[-0.04em]">{day.dress}</p>
          <ul className="m-0 mt-6 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-t border-[#0d0a08]/15 py-3">
                <p className="m-0 font-[family-name:var(--font-display)] text-xl font-extrabold">{stay.name}</p>
                <p className="m-0 mt-1">{stay.detail}</p>
              </li>
            ))}
          </ul>
        </Rise>
        <Rise live={live}>
          <img src={day.images.rings.src} alt="The rings" className="st-frame aspect-square w-full object-cover" />
        </Rise>
      </section>
      <section className="bg-[#4a1c6b] px-6 py-16">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-display)] text-5xl leading-none font-extrabold tracking-[-0.05em] text-[#c9a227]">Count me on the beat</p>
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
  return <div ref={ref} className={`st-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-[-0.04em] text-[#f6efe2]">You are on the beat, {sent}.</p>;
  return (
    <form className="mt-8 grid max-w-md gap-3 text-[#f6efe2]" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border-0 bg-white px-3 text-base text-[#0d0a08]" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border-0 bg-[#c9a227] px-3 text-base text-[#0d0a08]">
          <option>Friday</option><option>Saturday</option><option>For the lights</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border-0 bg-white px-3 py-2 text-base text-[#0d0a08]" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[#0d0a08] px-5 text-base text-[#c9a227]">I am coming</button>
    </form>
  );
}
