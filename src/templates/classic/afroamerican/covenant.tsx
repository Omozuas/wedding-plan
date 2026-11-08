"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { themeVars } from "@/content";
import { covenantDay as day } from "./covenant-day";

const DUST = [
  { left: "10%", top: "16%", delay: "0.6s", size: 10 },
  { left: "82%", top: "20%", delay: "1.4s", size: 8 },
  { left: "18%", top: "74%", delay: "2.2s", size: 12 },
  { left: "86%", top: "66%", delay: "2.8s", size: 9 },
  { left: "44%", top: "12%", delay: "1.8s", size: 7 },
  { left: "68%", top: "82%", delay: "3.4s", size: 11 },
  { left: "30%", top: "48%", delay: "2.5s", size: 6 },
  { left: "72%", top: "38%", delay: "3.1s", size: 8 },
];

const FRAMES = [
  { src: day.images.walk.src, focus: "center 40%", title: "The dock", line: day.dock[0], note: day.letter[0] },
  { src: day.images.bouquet.src, focus: "center", title: "The flowers", line: day.dock[1], note: day.letter[1] },
  { src: day.images.rings.src, focus: "center", title: "The rings", line: day.dock[2], note: day.letter[2] },
  { src: day.images.kiss.src, focus: "center 40%", title: "Before the light goes", line: day.dock[3], note: day.letter[3] },
  { src: day.images.dress.src, focus: "center", title: "Supper", line: day.hours[2].detail, note: day.dress },
  { src: day.images.couple.src, focus: "center 32%", title: "Claire and Thomas", line: `${day.time}. ${day.venue}.`, note: day.address },
];

export function Covenant() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-clip bg-[#f7f0e4] text-[#2a1a12]" style={themeVars(day.colors)}>
      <style>{`
        .cv-sky { opacity: 1; transition: opacity 1s ease; }
        .cv-sky.is-leaving { opacity: 0; }
        .cv-shot { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .cv-focus { animation: cv-focus 7.2s cubic-bezier(0.45, 0, 0.2, 1) forwards, cv-out 1.6s ease 7.4s forwards; }
        .cv-final { opacity: 0; animation: cv-stay 1.8s ease 13.8s forwards; }
        .cv-dust { position: absolute; border-radius: 999px; background: radial-gradient(circle at 40% 40%, #fff4d0, #d4a84b 50%, #8b5a18); opacity: 0; transform: scale(0); animation: cv-dust 3s ease both; }
        .cv-said { opacity: 0; animation: cv-said 3.4s ease 1s both; }
        .cv-name { opacity: 0; animation: cv-track 1.5s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .cv-line { opacity: 0; clip-path: inset(0 100% 0 0); animation: cv-reveal 1.5s ease both; }
        .cv-rise { opacity: 0; transform: translateY(22px); }
        .cv-rise.is-in { animation: cv-up 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .cv-drift { animation: cv-drift 28s ease-in-out infinite alternate; }
        .cv-pane { animation: cv-pane 6s ease-in-out infinite alternate; }
        .cv-ribbon { animation: cv-ribbon 14s linear infinite; }
        @keyframes cv-focus { from { filter: blur(18px) saturate(0.7); transform: scale(1.18); } to { filter: blur(0) saturate(1); transform: scale(1); } }
        @keyframes cv-out { to { opacity: 0; } }
        @keyframes cv-mid { 0% { opacity: 0; transform: scale(1.06); } 16% { opacity: 1; transform: scale(1); } 74% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes cv-stay { from { opacity: 0; transform: scale(1.05); } to { opacity: 1; transform: none; } }
        @keyframes cv-dust { 0% { opacity: 0; transform: scale(0); } 35% { opacity: 0.95; transform: scale(1); } 70% { opacity: 0.7; } 100% { opacity: 0; transform: scale(1.35) translateY(-20px); } }
        @keyframes cv-said { 0% { opacity: 0; } 20% { opacity: 1; } 70% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes cv-track { from { opacity: 0; letter-spacing: 0.3em; transform: translateY(12px); } to { opacity: 1; letter-spacing: 0; transform: none; } }
        @keyframes cv-reveal { to { opacity: 1; clip-path: inset(0 0 0 0); } }
        @keyframes cv-up { to { opacity: 1; transform: none; } }
        @keyframes cv-drift { from { transform: scale(1.04); } to { transform: scale(1.1) translate3d(-1.5%, -1%, 0); } }
        @keyframes cv-pane { from { opacity: 0.35; } to { opacity: 0.7; } }
        @keyframes cv-ribbon { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .cv-dust, .cv-said, .cv-focus { display: none; }
          .cv-final, .cv-name, .cv-line, .cv-rise, .cv-drift, .cv-pane, .cv-ribbon { animation: none; opacity: 1; transform: none; clip-path: none; letter-spacing: 0; filter: none; }
        }
      `}</style>
      {!open && <Blessing onDone={() => setOpen(true)} />}
      <Letter live={open} />
    </div>
  );
}

function Blessing({ onDone }: { onDone: () => void }) {
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
    <section className={`cv-sky fixed inset-0 z-50 overflow-hidden bg-[#1a100c] text-[#f7f0e4] ${leaving ? "is-leaving" : ""}`} aria-label="Stained light gathers, then the covenant comes into focus">
      <img src={day.images.couple.src} alt="" className="cv-shot cv-focus object-[center_32%]" />
      <img src={day.images.walk.src} alt="" className="cv-shot object-[center_40%]" style={{ animation: "cv-mid 3.8s ease 7.2s both" }} />
      <img src={day.images.bouquet.src} alt="" className="cv-shot object-center" style={{ animation: "cv-mid 3.6s ease 10.6s both" }} />
      <img src={day.images.couple.src} alt="" className="cv-shot cv-final object-[center_32%]" />
      <div className="cv-pane absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(180,40,40,0.35),transparent_45%),radial-gradient(ellipse_at_70%_30%,rgba(212,168,75,0.3),transparent_40%),radial-gradient(ellipse_at_50%_80%,rgba(40,80,50,0.25),transparent_50%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
      {DUST.map((dust) => (
        <span key={dust.left + dust.top} className="cv-dust" style={{ left: dust.left, top: dust.top, width: dust.size, height: dust.size, animationDelay: dust.delay }} />
      ))}
      <p className="cv-said absolute inset-x-0 top-[12vh] m-0 text-center font-[family-name:var(--font-serif)] text-[clamp(1.8rem,4vw,3rem)] italic">Beloved, come closer.</p>
      <div className="absolute inset-x-0 bottom-[8vh] px-6 text-center">
        <p className="cv-name m-0 font-[family-name:var(--font-serif)] text-[clamp(2.8rem,8vw,5.6rem)] leading-none" style={{ animationDelay: "15s" }}>{day.first}</p>
        <p className="cv-name m-0 font-[family-name:var(--font-script)] text-[clamp(2rem,5vw,3.4rem)] text-[#d4a84b]" style={{ animationDelay: "16.2s" }}>and {day.second}</p>
        <p className="cv-line m-0 mt-4 text-sm tracking-[0.22em] uppercase" style={{ animationDelay: "17.6s" }}>{day.dateLabel}</p>
        <p className="cv-line m-0 mt-2 font-[family-name:var(--font-serif)] text-2xl italic" style={{ animationDelay: "18.8s" }}>{day.time} · {day.venue}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[3] cursor-pointer border border-white/40 bg-black/35 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Letter({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="relative min-h-dvh">
        <img src={day.images.couple.src} alt="Claire and Thomas at the lake" className="cv-drift absolute inset-0 size-full object-cover object-[center_32%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a100c]/85 via-[#1a100c]/25 to-[#5a1a1a]/35" />
        <div className="relative flex min-h-dvh flex-col items-center justify-end px-6 pb-16 text-center text-[#f7f0e4]">
          <p className="m-0 text-[0.68rem] tracking-[0.34em] text-[#d4a84b] uppercase">{day.place}</p>
          <h1 className="m-0 mt-4 font-[family-name:var(--font-serif)] text-[clamp(3.2rem,8vw,6rem)] leading-[0.9] font-medium">
            {day.first}
            <span className="mt-1 block font-[family-name:var(--font-script)] text-[clamp(2.2rem,5vw,3.6rem)] text-[#d4a84b]">and</span>
            {day.second}
          </h1>
          <p className="m-0 mt-4 text-sm tracking-[0.18em] uppercase">{day.dateLabel}</p>
          <p className="m-0 mt-2 font-[family-name:var(--font-serif)] text-2xl italic">{day.time}</p>
        </div>
      </section>
      <div className="overflow-hidden bg-[#6b1e1e] py-2">
        <p className="cv-ribbon m-0 w-max text-sm tracking-[0.2em] text-[#d4a84b] uppercase">{`With joy · With family · With faith · ${day.couple} · `.repeat(8)}</p>
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
          <p className="m-0 mt-8 text-sm tracking-[0.16em] text-[#8b5a18] uppercase">{day.bride} and {day.groom}</p>
          <p className="m-0 mt-2">{day.address}</p>
        </Rise>
      </section>
      {FRAMES.map((frame, index) => (
        <section key={frame.title} className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-12 md:grid-cols-2 md:py-16">
          <Rise live={live}>
            <div className={`relative ${index % 2 ? "md:order-2" : ""}`}>
              <img src={frame.src} alt="" className="aspect-[4/5] w-full object-cover" style={{ objectPosition: frame.focus }} />
              <span className="pointer-events-none absolute inset-3 border border-[#d4a84b]/50" />
            </div>
          </Rise>
          <Rise live={live}>
            <div className={index % 2 ? "md:order-1" : ""}>
              <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#8b5a18] uppercase">{frame.title}</p>
              <p className="m-0 mt-3 font-[family-name:var(--font-serif)] text-[clamp(1.8rem,3vw,2.8rem)] leading-snug">{frame.line}</p>
              <p className="m-0 mt-4 text-lg leading-relaxed">{frame.note}</p>
            </div>
          </Rise>
        </section>
      ))}
      <section className="bg-[#2a3a28] px-6 py-20 text-[#f7f0e4]">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          <Rise live={live}>
            <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#d4a84b] uppercase">The hours</p>
            <ol className="m-0 mt-8 list-none p-0">
              {day.hours.map((hour) => (
                <li key={hour.time} className="border-t border-[#f7f0e4]/20 py-5">
                  <p className="m-0 font-[family-name:var(--font-serif)] text-4xl text-[#d4a84b]">{hour.time}</p>
                  <h2 className="m-0 mt-1 font-[family-name:var(--font-serif)] text-3xl font-medium">{hour.title}</h2>
                  <p className="m-0 mt-2 text-[#f7f0e4]/80">{hour.detail}</p>
                </li>
              ))}
            </ol>
          </Rise>
          <Rise live={live}>
            <img src={day.images.walk.src} alt="Claire and Thomas by the water" className="aspect-[3/4] w-full object-cover object-[center_40%]" />
            <p className="m-0 mt-6 font-[family-name:var(--font-serif)] text-2xl leading-snug">{day.dress}</p>
          </Rise>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr]">
        <Rise live={live}>
          <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#8b5a18] uppercase">Where to stay</p>
          <ul className="m-0 mt-6 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-t border-[#2a1a12]/15 py-4">
                <p className="m-0 font-[family-name:var(--font-serif)] text-2xl">{stay.name}</p>
                <p className="m-0 mt-1 leading-relaxed">{stay.detail}</p>
              </li>
            ))}
          </ul>
        </Rise>
        <Rise live={live}>
          <img src={day.images.kiss.src} alt="" className="aspect-[4/5] w-full object-cover object-[center_40%]" />
        </Rise>
      </section>
      <section className="bg-[#efe0c8] px-6 py-20 text-center">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-script)] text-5xl text-[#6b1e1e]">A place at the table</p>
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
  return <div ref={ref} className={`cv-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-serif)] text-3xl italic">Your place is kept, {sent}.</p>;
  return (
    <form className="mx-auto mt-8 grid max-w-md gap-3 text-left" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#2a1a12]/20 bg-white/80 px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#2a1a12]/20 bg-[#f7f0e4] px-3 text-base">
          <option>Friday</option><option>Saturday</option><option>Already by the water</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#2a1a12]/20 bg-white/80 px-3 py-2 text-base" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[#6b1e1e] px-5 text-base text-[#f7f0e4]">Keep my place</button>
    </form>
  );
}
