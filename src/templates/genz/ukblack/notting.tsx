"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { themeVars } from "@/content";
import { nottingDay as day } from "./notting-day";

const SILKS = [
  { color: "#e23b6a", delay: "0.5s", photo: "/photos/bouquet.jpg", focus: "center", angle: "-18deg" },
  { color: "#f0c14b", delay: "3.2s", photo: "/photos/walk.jpg", focus: "center 40%", angle: "14deg" },
  { color: "#2ecc71", delay: "5.9s", photo: "/photos/rings.jpg", focus: "center", angle: "-10deg" },
  { color: "#5b2cff", delay: "8.6s", photo: "/photos/kiss.jpg", focus: "center 36%", angle: "16deg" },
];

const PRINTS = [
  { src: day.images.walk.src, focus: "center 40%", kicker: "01", line: day.dock[0], note: day.letter[0], wash: "#e23b6a" },
  { src: day.images.bouquet.src, focus: "center", kicker: "02", line: day.dock[1], note: day.letter[1], wash: "#f0c14b" },
  { src: day.images.rings.src, focus: "center", kicker: "03", line: day.dock[2], note: day.letter[2], wash: "#2ecc71" },
  { src: day.images.kiss.src, focus: "center 36%", kicker: "04", line: day.dock[3], note: day.letter[3], wash: "#5b2cff" },
  { src: day.images.dress.src, focus: "center", kicker: "05", line: day.hours[2].title, note: day.dress, wash: "#e23b6a" },
  { src: day.images.couple.src, focus: "center 30%", kicker: "06", line: `${day.time}. ${day.venue}.`, note: day.address, wash: "#f0c14b" },
];

export function Notting() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-clip bg-[var(--w-bg)] text-[var(--w-ink)]" style={themeVars(day.colors)}>
      <style>{`
        .nt-sky { opacity: 1; transition: opacity 1s ease; }
        .nt-sky.is-leaving { opacity: 0; }
        .nt-silk { position: absolute; inset: -20%; opacity: 0; mix-blend-mode: screen; animation: nt-silk 2.8s cubic-bezier(0.45, 0, 0.2, 1) both; }
        .nt-shot { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; animation: nt-shot 2.8s ease both; }
        .nt-final { opacity: 0; animation: nt-final 2s ease 11.2s forwards; }
        .nt-name { opacity: 0; animation: nt-name 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .nt-rise { opacity: 0; transform: translateY(22px); }
        .nt-rise.is-in { animation: nt-name 0.85s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .nt-ribbon { animation: nt-ribbon 18s linear infinite; }
        @keyframes nt-silk { 0% { opacity: 0; transform: translateX(-30%) rotate(var(--angle)) skewX(-8deg); } 25% { opacity: 0.85; } 70% { opacity: 0.7; } 100% { opacity: 0; transform: translateX(35%) rotate(var(--angle)) skewX(-8deg); } }
        @keyframes nt-shot { 0% { opacity: 0; transform: scale(1.08); } 18% { opacity: 1; transform: scale(1); } 72% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes nt-final { from { opacity: 0; transform: scale(1.06); } to { opacity: 1; transform: none; } }
        @keyframes nt-name { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes nt-ribbon { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .nt-silk, .nt-shot { display: none; }
          .nt-final, .nt-name, .nt-rise, .nt-ribbon { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
      {!open && <Carnival onDone={() => setOpen(true)} />}
      <Street live={open} />
    </div>
  );
}

function Carnival({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 19600);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 20800);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`nt-sky fixed inset-0 z-50 overflow-hidden bg-[var(--w-bg)] text-[var(--w-ink)] ${leaving ? "is-leaving" : ""}`} aria-label="Colour silks sweep across the day, then the couple stays">
      {SILKS.map((silk) => (
        <div key={silk.color + silk.delay}>
          <img src={silk.photo} alt="" className="nt-shot" style={{ objectPosition: silk.focus, animationDelay: silk.delay }} />
          <div className="nt-silk z-[2]" style={{ background: silk.color, animationDelay: silk.delay, ["--angle" as string]: silk.angle }} />
        </div>
      ))}
      <img src={day.images.couple.src} alt="" className="nt-final absolute inset-0 z-[3] size-full object-cover object-[center_30%]" />
      <div className="absolute inset-0 z-[4] bg-gradient-to-t from-[#0d0a10] via-transparent to-[#0d0a10]/35" />
      <div className="absolute inset-x-0 bottom-[8vh] z-[5] px-6 text-center">
        <p className="nt-name m-0 text-[0.68rem] tracking-[0.28em] text-[var(--w-accent-alt)] uppercase" style={{ animationDelay: "13s" }}>Colour, then love</p>
        <p className="nt-name m-0 mt-2 font-[family-name:var(--font-display)] text-[clamp(2.8rem,10vw,6.2rem)] leading-none font-extrabold tracking-[-0.06em]" style={{ animationDelay: "13.8s" }}>{day.first}</p>
        <p className="nt-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.8rem,10vw,6.2rem)] leading-none font-extrabold tracking-[-0.06em] text-[var(--w-accent)]" style={{ animationDelay: "14.8s" }}>{day.second}</p>
        <p className="nt-name m-0 mt-3 font-[family-name:var(--font-serif)] text-2xl italic" style={{ animationDelay: "16s" }}>{day.time} · {day.shortDate}</p>
        <p className="nt-name m-0 mt-1 text-sm tracking-[0.14em] text-[#2ecc71] uppercase" style={{ animationDelay: "17s" }}>{day.venue}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[6] cursor-pointer border border-[var(--w-accent-alt)]/50 bg-black/45 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Street({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="bg-[var(--w-accent)] px-6 py-16 text-[#fff6ec]">
        <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[var(--w-accent-alt)] uppercase">{day.place}</p>
        <h1 className="m-0 mt-3 font-[family-name:var(--font-display)] text-[clamp(3.2rem,11vw,6.8rem)] leading-[0.84] font-extrabold tracking-[-0.06em]">
          {day.first}
          <span className="block text-[var(--w-accent-alt)]">{day.second}</span>
        </h1>
        <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-2xl italic">{day.dateLabel} · {day.time}</p>
        <p className="m-0 mt-1">{day.venue}</p>
      </section>
      <div className="overflow-hidden bg-[var(--w-surface)] py-3">
        <p className="nt-ribbon m-0 w-max font-[family-name:var(--font-display)] text-sm font-extrabold tracking-[0.18em] uppercase">{`Colour · Love · Family · Joy · ${day.couple} · `.repeat(8)}</p>
      </div>
      <section className="mx-auto max-w-3xl px-6 py-14">
        <Rise live={live}><p className="m-0 font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] leading-snug font-extrabold tracking-[-0.04em]">{day.arrival}</p></Rise>
        <div className="mt-8 grid gap-5">
          {day.letter.map((paragraph) => (
            <Rise key={paragraph} live={live}><p className="m-0 text-lg leading-relaxed text-[#fff6ec]/85">{paragraph}</p></Rise>
          ))}
        </div>
      </section>
      {PRINTS.map((print) => (
        <section key={print.kicker} className="flex min-h-[78vh] items-center" style={{ background: print.wash === "#f0c14b" || print.wash === "#2ecc71" ? print.wash : undefined, color: print.wash === "#f0c14b" || print.wash === "#2ecc71" ? "#0d0a10" : "#fff6ec" }}>
          <div className="mx-auto grid max-w-6xl items-center gap-6 px-6 py-12 md:grid-cols-2" style={print.wash === "#f0c14b" || print.wash === "#2ecc71" ? undefined : { background: print.wash }}>
            <Rise live={live}>
              <img src={print.src} alt="" className="aspect-[5/4] w-full object-cover shadow-[12px_12px_0_#0d0a10]" style={{ objectPosition: print.focus }} />
            </Rise>
            <Rise live={live}>
              <p className="m-0 font-[family-name:var(--font-display)] text-6xl leading-none font-extrabold">{print.kicker}</p>
              <p className="m-0 mt-3 font-[family-name:var(--font-display)] text-[clamp(1.6rem,3vw,2.4rem)] leading-snug font-extrabold tracking-[-0.04em]">{print.line}</p>
              <p className="m-0 mt-3 text-lg leading-relaxed opacity-85">{print.note}</p>
            </Rise>
          </div>
        </section>
      ))}
      <section className="bg-[#0d0a10] px-6 py-16">
        <p className="m-0 text-xs font-extrabold tracking-[0.24em] text-[var(--w-accent-alt)] uppercase">The colours of the day</p>
        <ol className="m-0 mt-8 grid list-none gap-6 p-0 md:grid-cols-2">
          {day.hours.map((hour, index) => (
            <li key={hour.time} className="p-5" style={{ background: ["#e23b6a", "#f0c14b", "#2ecc71", "#5b2cff"][index], color: index === 1 || index === 2 ? "#0d0a10" : "#fff6ec" }}>
              <Rise live={live}>
                <p className="m-0 font-[family-name:var(--font-display)] text-5xl font-extrabold">{hour.time}</p>
                <h2 className="m-0 mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold">{hour.title}</h2>
                <p className="m-0 mt-2 opacity-85">{hour.detail}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-[-0.04em]">Save me a colour</p>
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
    const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) setOn(true); }, { threshold: 0.16 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [live]);
  return <div ref={ref} className={`nt-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-display)] text-3xl font-extrabold">A colour is saved for you, {sent}.</p>;
  return (
    <form className="mt-6 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#fff6ec]/25 bg-transparent px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#fff6ec]/25 bg-[#1a1020] px-3 text-base text-[#fff6ec]">
          <option>Friday</option><option>Saturday</option><option>For the colours</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#fff6ec]/25 bg-transparent px-3 py-2 text-base" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[var(--w-accent)] px-5 text-base text-[#fff6ec]">I am coming</button>
    </form>
  );
}
