"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { themeVars } from "@/content";
import { legacyDay as day } from "./legacy-day";

const FOIL = [
  { left: "11%", top: "18%", delay: "0.5s", size: 5 },
  { left: "78%", top: "14%", delay: "1.2s", size: 7 },
  { left: "22%", top: "72%", delay: "1.9s", size: 4 },
  { left: "86%", top: "64%", delay: "2.6s", size: 6 },
  { left: "48%", top: "10%", delay: "1.5s", size: 5 },
  { left: "64%", top: "80%", delay: "3.1s", size: 8 },
  { left: "8%", top: "46%", delay: "2.2s", size: 4 },
  { left: "92%", top: "38%", delay: "2.9s", size: 6 },
  { left: "36%", top: "56%", delay: "3.5s", size: 5 },
  { left: "58%", top: "28%", delay: "0.9s", size: 4 },
];

const PAGES = [
  { src: day.images.walk.src, focus: "center 40%", title: "The dock", line: day.dock[0], note: day.letter[0] },
  { src: day.images.bouquet.src, focus: "center", title: "The flowers", line: day.dock[1], note: day.letter[1] },
  { src: day.images.rings.src, focus: "center", title: "The rings", line: day.dock[2], note: day.letter[2] },
  { src: day.images.kiss.src, focus: "center 40%", title: "Before the light goes", line: day.dock[3], note: day.letter[3] },
  { src: day.images.dress.src, focus: "center", title: "Supper", line: day.hours[2].detail, note: day.dress },
  { src: day.images.couple.src, focus: "center 32%", title: "Claire and Thomas", line: `${day.time}. ${day.venue}.`, note: day.address },
];

export function Legacy() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-clip bg-[#f4ead8] text-[#1a120e]" style={themeVars(day.colors)}>
      <style>{`
        .lg-sky { opacity: 1; transition: opacity 1s ease; }
        .lg-sky.is-leaving { opacity: 0; }
        .lg-locket { position: absolute; top: 50%; left: 50%; width: min(72vw, 26rem); height: min(72vw, 26rem); margin: calc(min(72vw, 26rem) / -2) 0 0 calc(min(72vw, 26rem) / -2); border-radius: 999px; overflow: hidden; border: 10px solid #c9a45c; box-shadow: 0 0 0 3px #8a6a28, 0 28px 70px rgba(0,0,0,0.5); transform: scale(0.55); opacity: 0; animation: lg-locket 2.4s cubic-bezier(0.16, 0.84, 0.3, 1) 0.6s forwards, lg-open 3.2s cubic-bezier(0.45, 0, 0.2, 1) 12.4s forwards; }
        .lg-face { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; }
        .lg-face-a { animation: lg-hold 4s ease 1.4s both; object-position: center; }
        .lg-face-b { animation: lg-hold 4s ease 5s both; object-position: center 40%; }
        .lg-face-c { animation: lg-stay 1.6s ease 8.6s forwards; object-position: center 30%; }
        .lg-hinge { position: absolute; top: 8%; left: 50%; width: 18px; height: 28px; margin-left: -9px; border-radius: 6px; background: linear-gradient(180deg, #fff0c0, #c9a45c 40%, #8a6a28); opacity: 0; animation: lg-hinge 1s ease 1.2s both; z-index: 3; }
        .lg-chain { position: absolute; top: 0; left: 50%; width: 2px; height: 18%; background: linear-gradient(#c9a45c, transparent); opacity: 0; animation: lg-hinge 1.2s ease 0.8s both; transform-origin: top center; }
        .lg-foil { position: absolute; border-radius: 999px; background: linear-gradient(145deg, #fff4c8, #c9a45c 45%, #8a6a28); opacity: 0; animation: lg-foil 3.4s ease-in-out infinite; }
        .lg-said { opacity: 0; animation: lg-said 3.6s ease 2s both; }
        .lg-name { opacity: 0; animation: lg-track 1.5s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .lg-line { opacity: 0; clip-path: inset(0 100% 0 0); animation: lg-reveal 1.4s ease both; }
        .lg-rise { opacity: 0; transform: translateY(24px); }
        .lg-rise.is-in { animation: lg-up 0.95s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .lg-drift { animation: lg-drift 30s ease-in-out infinite alternate; }
        .lg-frame { position: relative; }
        .lg-frame::before { content: ""; position: absolute; inset: 10px; border: 1px solid rgba(201, 164, 92, 0.55); pointer-events: none; z-index: 1; }
        .lg-frame::after { content: ""; position: absolute; inset: 0; border: 10px solid #f4ead8; box-shadow: inset 0 0 0 1px rgba(26, 18, 14, 0.15); pointer-events: none; }
        .lg-wipe { clip-path: inset(0 100% 0 0); transition: clip-path 1.1s cubic-bezier(0.45, 0, 0.2, 1); }
        .lg-rise.is-in .lg-wipe { clip-path: inset(0 0 0 0); }
        .lg-warm { filter: sepia(0.28) saturate(0.9) contrast(1.05); transition: filter 1.2s ease; }
        .lg-rise.is-in .lg-warm { filter: sepia(0.05) saturate(1.05) contrast(1.02); }
        .lg-ribbon { animation: lg-ribbon 18s linear infinite; }
        .lg-glow { animation: lg-glow 5s ease-in-out infinite alternate; }
        @keyframes lg-locket { to { opacity: 1; transform: scale(1); } }
        @keyframes lg-open { to { width: 100vmax; height: 100vmax; margin: -50vmax 0 0 -50vmax; border-radius: 0; border-width: 0; box-shadow: none; } }
        @keyframes lg-hold { 0% { opacity: 0; transform: scale(1.08); } 14% { opacity: 1; transform: scale(1); } 78% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes lg-stay { from { opacity: 0; transform: scale(1.06); } to { opacity: 1; transform: none; } }
        @keyframes lg-hinge { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @keyframes lg-foil { 0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); } 35% { opacity: 1; transform: translateY(-16px) scale(1); } 70% { opacity: 0.55; } }
        @keyframes lg-said { 0% { opacity: 0; } 20% { opacity: 1; } 70% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes lg-track { from { opacity: 0; letter-spacing: 0.32em; transform: translateY(14px); } to { opacity: 1; letter-spacing: 0.02em; transform: none; } }
        @keyframes lg-reveal { to { opacity: 1; clip-path: inset(0 0 0 0); } }
        @keyframes lg-up { to { opacity: 1; transform: none; } }
        @keyframes lg-drift { from { transform: scale(1.04); } to { transform: scale(1.1) translate3d(-1.2%, -0.8%, 0); } }
        @keyframes lg-ribbon { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes lg-glow { from { text-shadow: 0 0 0 rgba(201, 164, 92, 0); } to { text-shadow: 0 0 24px rgba(201, 164, 92, 0.35); } }
        @media (prefers-reduced-motion: reduce) {
          .lg-foil, .lg-said, .lg-face-a, .lg-face-b, .lg-hinge, .lg-chain { display: none; }
          .lg-locket, .lg-face-c, .lg-name, .lg-line, .lg-rise, .lg-drift, .lg-ribbon, .lg-glow { animation: none; opacity: 1; transform: none; clip-path: none; letter-spacing: 0; }
          .lg-locket { inset: 0; width: 100%; height: 100%; margin: 0; border: 0; border-radius: 0; }
          .lg-wipe, .lg-warm { transition: none; clip-path: none; filter: none; }
        }
      `}</style>
      {!open && <Locket onDone={() => setOpen(true)} />}
      <Heritage live={open} />
    </div>
  );
}

function Locket({ onDone }: { onDone: () => void }) {
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
    <section className={`lg-sky fixed inset-0 z-50 overflow-hidden bg-[#0c0a09] text-[#f4ead8] ${leaving ? "is-leaving" : ""}`} aria-label="A gold locket opens through the day, then the couple fills the room">
      <div className="lg-chain left-1/2" />
      <div className="lg-locket z-[2]">
        <img src={day.images.rings.src} alt="" className="lg-face lg-face-a" />
        <img src={day.images.bouquet.src} alt="" className="lg-face lg-face-b" />
        <img src={day.images.couple.src} alt="" className="lg-face lg-face-c" />
      </div>
      <div className="lg-hinge z-[3]" />
      {FOIL.map((fleck) => (
        <span key={fleck.left + fleck.top} className="lg-foil z-[1]" style={{ left: fleck.left, top: fleck.top, width: fleck.size, height: fleck.size, animationDelay: fleck.delay }} />
      ))}
      <p className="lg-said absolute inset-x-0 top-[12vh] z-[4] m-0 text-center font-[family-name:var(--font-serif)] text-[clamp(1.5rem,3.5vw,2.4rem)] italic text-[#c9a45c]">Kept close to the heart.</p>
      <div className="absolute inset-x-0 bottom-[8vh] z-[4] px-6 text-center">
        <p className="lg-name lg-glow m-0 font-[family-name:var(--font-serif)] text-[clamp(2.8rem,8vw,5.4rem)] leading-none" style={{ animationDelay: "15.2s" }}>{day.first}</p>
        <p className="lg-name m-0 font-[family-name:var(--font-script)] text-[clamp(2rem,5vw,3.4rem)] text-[#c9a45c]" style={{ animationDelay: "16.4s" }}>and {day.second}</p>
        <p className="lg-line m-0 mt-4 text-sm tracking-[0.22em] uppercase" style={{ animationDelay: "17.6s" }}>{day.dateLabel}</p>
        <p className="lg-line m-0 mt-2 font-[family-name:var(--font-serif)] text-2xl italic" style={{ animationDelay: "18.6s" }}>{day.time} · {day.venue}</p>
        <p className="lg-line m-0 mt-2 text-sm tracking-[0.16em] text-[#c9a45c] uppercase" style={{ animationDelay: "19.4s" }}>{day.place}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[5] cursor-pointer border border-[#c9a45c]/50 bg-black/40 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Heritage({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="relative min-h-dvh overflow-hidden bg-[#0c0a09]">
        <img src={day.images.couple.src} alt="Claire and Thomas at the lake" className="lg-drift absolute inset-0 size-full object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/35 to-[#4a1832]/40" />
        {FOIL.map((fleck) => (
          <span key={`live-${fleck.left}`} className="lg-foil z-[1]" style={{ left: fleck.left, top: fleck.top, width: fleck.size, height: fleck.size, animationDelay: fleck.delay }} />
        ))}
        <div className="relative flex min-h-dvh flex-col items-center justify-end px-6 pb-16 text-center text-[#f4ead8]">
          <p className="m-0 text-[0.68rem] tracking-[0.34em] text-[#c9a45c] uppercase">{day.place}</p>
          <h1 className="lg-glow m-0 mt-4 font-[family-name:var(--font-serif)] text-[clamp(3.2rem,8vw,6rem)] leading-[0.9] font-medium">
            {day.first}
            <span className="mt-1 block font-[family-name:var(--font-script)] text-[clamp(2.2rem,5vw,3.6rem)] text-[#c9a45c]">and</span>
            {day.second}
          </h1>
          <p className="m-0 mt-4 text-sm tracking-[0.18em] uppercase">{day.dateLabel}</p>
          <p className="m-0 mt-2 font-[family-name:var(--font-serif)] text-2xl italic">{day.time}</p>
        </div>
      </section>
      <div className="overflow-hidden bg-[#4a1832] py-2.5">
        <p className="lg-ribbon m-0 w-max text-sm tracking-[0.22em] text-[#c9a45c] uppercase">{`Heritage · Joy · Family · Promise · ${day.couple} · `.repeat(8)}</p>
      </div>
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(2rem,4vw,3.2rem)] leading-snug italic">{day.arrival}</p>
        </Rise>
        <div className="mt-10 grid gap-6">
          {day.letter.map((paragraph) => (
            <Rise key={paragraph} live={live}>
              <p className="m-0 text-lg leading-relaxed">{paragraph}</p>
            </Rise>
          ))}
        </div>
        <Rise live={live}>
          <p className="m-0 mt-8 text-sm tracking-[0.16em] text-[#8a6a28] uppercase">{day.bride} and {day.groom}</p>
          <p className="m-0 mt-2">{day.address}</p>
        </Rise>
      </section>
      {PAGES.map((page, index) => (
        <section key={page.title} className={`mx-auto grid max-w-6xl items-center gap-8 px-6 py-12 md:grid-cols-2 md:py-16 ${index % 2 ? "bg-[#efe3cf]" : ""}`}>
          <Rise live={live}>
            <div className={`lg-frame ${index % 2 ? "md:order-2" : ""}`}>
              <img
                src={page.src}
                alt=""
                className="lg-wipe lg-warm aspect-[4/5] w-full object-cover"
                style={{ objectPosition: page.focus }}
              />
            </div>
          </Rise>
          <Rise live={live}>
            <div className={index % 2 ? "md:order-1" : ""}>
              <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#8a6a28] uppercase">{page.title}</p>
              <p className="m-0 mt-3 font-[family-name:var(--font-serif)] text-[clamp(1.8rem,3vw,2.8rem)] leading-snug">{page.line}</p>
              <p className="m-0 mt-4 text-lg leading-relaxed">{page.note}</p>
            </div>
          </Rise>
        </section>
      ))}
      <section className="bg-[#1a120e] px-6 py-20 text-[#f4ead8]">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          <Rise live={live}>
            <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#c9a45c] uppercase">The hours</p>
            <ol className="m-0 mt-8 list-none p-0">
              {day.hours.map((hour) => (
                <li key={hour.time} className="border-t border-[#c9a45c]/25 py-5">
                  <p className="m-0 font-[family-name:var(--font-serif)] text-4xl text-[#c9a45c]">{hour.time}</p>
                  <h2 className="m-0 mt-1 font-[family-name:var(--font-serif)] text-3xl font-medium">{hour.title}</h2>
                  <p className="m-0 mt-2 text-[#f4ead8]/80">{hour.detail}</p>
                </li>
              ))}
            </ol>
          </Rise>
          <Rise live={live}>
            <div className="lg-frame">
              <img src={day.images.walk.src} alt="Claire and Thomas by the water" className="lg-warm aspect-[3/4] w-full object-cover object-[center_40%]" />
            </div>
            <p className="m-0 mt-6 font-[family-name:var(--font-serif)] text-2xl leading-snug">{day.dress}</p>
          </Rise>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr]">
        <Rise live={live}>
          <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#8a6a28] uppercase">Where to stay</p>
          <ul className="m-0 mt-6 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-t border-[#1a120e]/15 py-4">
                <p className="m-0 font-[family-name:var(--font-serif)] text-2xl">{stay.name}</p>
                <p className="m-0 mt-1 leading-relaxed">{stay.detail}</p>
              </li>
            ))}
          </ul>
        </Rise>
        <Rise live={live}>
          <div className="lg-frame">
            <img src={day.images.kiss.src} alt="" className="lg-warm aspect-[4/5] w-full object-cover object-[center_40%]" />
          </div>
        </Rise>
      </section>
      <section className="relative overflow-hidden bg-[#4a1832] px-6 py-20 text-center text-[#f4ead8]">
        {FOIL.slice(0, 6).map((fleck) => (
          <span key={`rsvp-${fleck.left}`} className="lg-foil" style={{ left: fleck.left, top: fleck.top, width: fleck.size + 2, height: fleck.size + 2, animationDelay: fleck.delay }} />
        ))}
        <Rise live={live}>
          <p className="lg-glow m-0 font-[family-name:var(--font-script)] text-5xl text-[#c9a45c]">Write your name in</p>
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
    const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) setOn(true); }, { threshold: 0.18 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [live]);
  return <div ref={ref} className={`lg-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-serif)] text-3xl italic">Your name is in the book, {sent}.</p>;
  return (
    <form className="relative mx-auto mt-8 grid max-w-md gap-3 text-left" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#c9a45c]/40 bg-[#f4ead8] px-3 text-base text-[#1a120e]" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#c9a45c]/40 bg-[#1a120e] px-3 text-base text-[#f4ead8]">
          <option>Friday</option><option>Saturday</option><option>Already by the water</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#c9a45c]/40 bg-[#f4ead8] px-3 py-2 text-base text-[#1a120e]" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[#c9a45c] px-5 text-base text-[#1a120e]">Keep my place</button>
    </form>
  );
}
