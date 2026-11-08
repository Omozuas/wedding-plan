"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { themeVars } from "@/content";
import { ellingtonDay as day } from "./ellington-day";

const SIDE_LABELS = (day.extras.sideLabels as string[] | undefined) ?? ["A1", "A2", "B1", "B2"];
const SIDES = [
  { side: SIDE_LABELS[0], src: day.images.walk.src, focus: day.images.walk.focus, line: day.dock[0], note: day.letter[0] },
  { side: SIDE_LABELS[1], src: day.images.bouquet.src, focus: day.images.bouquet.focus, line: day.dock[1], note: day.letter[1] },
  { side: SIDE_LABELS[2], src: day.images.rings.src, focus: day.images.rings.focus, line: day.dock[2], note: day.letter[2] },
  { side: SIDE_LABELS[3], src: day.images.kiss.src, focus: day.images.kiss.focus, line: day.dock[3], note: day.letter[3] },
];

export function Ellington() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-clip bg-[var(--w-bg)] text-[var(--w-ink)]" style={themeVars(day.colors)}>
      <style>{`
        .el-sky { opacity: 1; transition: opacity 1s ease; }
        .el-sky.is-leaving { opacity: 0; }
        .el-disc { position: absolute; top: 50%; left: 50%; width: min(78vw, 26rem); height: min(78vw, 26rem); margin: calc(min(78vw, 26rem) / -2) 0 0 calc(min(78vw, 26rem) / -2); border-radius: 999px; overflow: hidden; box-shadow: 0 0 0 14px #1a120e, 0 0 0 16px var(--w-accent), 0 40px 80px rgba(0,0,0,0.55); animation: el-spin 12s linear infinite, el-zoom 3.2s cubic-bezier(0.45, 0, 0.2, 1) 8.8s forwards; }
        .el-groove { position: absolute; inset: 8%; border-radius: 999px; border: 1px solid rgba(201,164,92,0.35); pointer-events: none; }
        .el-arm { position: absolute; top: 12%; right: 8%; width: 6px; height: 42%; transform-origin: top center; transform: rotate(-38deg); background: linear-gradient(#d8d0c4, #8a8070); border-radius: 3px; animation: el-arm 2.4s cubic-bezier(0.16, 0.84, 0.3, 1) 1.2s forwards; }
        .el-arm::after { content: ""; position: absolute; left: -10px; bottom: -4px; width: 26px; height: 18px; background: var(--w-accent); clip-path: polygon(20% 0, 100% 30%, 70% 100%, 0 60%); }
        .el-label { position: absolute; inset: 32%; border-radius: 999px; overflow: hidden; border: 3px solid var(--w-accent); }
        .el-final { position: absolute; inset: 0; opacity: 0; animation: el-final 2.2s ease 11.2s forwards; }
        .el-name { opacity: 0; animation: el-name 0.95s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .el-rise { opacity: 0; transform: translateY(22px); }
        .el-rise.is-in { animation: el-name 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        @keyframes el-spin { to { transform: rotate(360deg); } }
        @keyframes el-zoom { to { width: 140vmax; height: 140vmax; margin: -70vmax 0 0 -70vmax; border-radius: 0; box-shadow: none; } }
        @keyframes el-arm { from { transform: rotate(-38deg); } to { transform: rotate(-8deg); } }
        @keyframes el-final { from { opacity: 0; } to { opacity: 1; } }
        @keyframes el-name { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .el-disc, .el-arm { animation: none; }
          .el-final, .el-name, .el-rise { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
      {!open && <Stylus onDone={() => setOpen(true)} />}
      <Programme live={open} />
    </div>
  );
}

function Stylus({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 18800);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 20000);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`el-sky fixed inset-0 z-50 overflow-hidden bg-[#120e0c] text-[var(--w-bg)] ${leaving ? "is-leaving" : ""}`} aria-label="A stylus drops on vinyl, the disc opens into the couple">
      <div className="el-disc z-[1]">
        <img src={day.images.couple.src} alt="" className="size-full object-cover object-[center_30%]" />
        <span className="el-groove" style={{ inset: "6%" }} />
        <span className="el-groove" style={{ inset: "14%" }} />
        <span className="el-groove" style={{ inset: "22%" }} />
        <span className="el-label">
          <img src={day.images.rings.src} alt="" className="size-full object-cover" />
        </span>
      </div>
      <span className="el-arm z-[2]" />
      <img src={day.images.couple.src} alt="" className="el-final z-[3] size-full object-cover object-[center_30%]" />
      <div className="absolute inset-0 z-[4] bg-gradient-to-t from-[#120e0c] via-transparent to-[#120e0c]/45" />
      <div className="absolute inset-x-0 bottom-[8vh] z-[5] px-6 text-center md:text-left md:pl-[10vw]">
        <p className="el-name m-0 text-[0.68rem] tracking-[0.32em] text-[var(--w-accent)] uppercase" style={{ animationDelay: "12.4s" }}>Side A · The afternoon</p>
        <p className="el-name m-0 mt-3 font-[family-name:var(--font-serif)] text-[clamp(3rem,9vw,6rem)] leading-[0.88]" style={{ animationDelay: "13.2s" }}>{day.first}</p>
        <p className="el-name m-0 font-[family-name:var(--font-serif)] text-[clamp(3rem,9vw,6rem)] leading-[0.88] text-[var(--w-accent)]" style={{ animationDelay: "14.2s" }}>{day.second}</p>
        <p className="el-name m-0 mt-4 font-[family-name:var(--font-serif)] text-2xl italic" style={{ animationDelay: "15.4s" }}>{day.time} · {day.shortDate}</p>
        <p className="el-name m-0 mt-1 text-sm tracking-[0.14em] uppercase" style={{ animationDelay: "16.4s" }}>{day.venue}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[6] cursor-pointer border border-[var(--w-accent)]/50 bg-black/40 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Programme({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="border-b border-[#1a120e]/15 px-6 py-16 md:px-14">
        <p className="m-0 text-[0.68rem] tracking-[0.36em] text-[var(--w-surface-alt)] uppercase">{day.place}</p>
        <div className="mt-6 grid items-end gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <h1 className="m-0 font-[family-name:var(--font-serif)] text-[clamp(3.4rem,10vw,7.2rem)] leading-[0.84]">
            {day.first}
            <span className="mt-2 block italic text-[var(--w-surface-alt)]">&amp; {day.second}</span>
          </h1>
          <div className="border-l border-[#1a120e]/20 pl-6">
            <p className="m-0 font-[family-name:var(--font-serif)] text-2xl italic">{day.dateLabel}</p>
            <p className="m-0 mt-2 text-sm tracking-[0.18em] uppercase">{day.time}</p>
            <p className="m-0 mt-4 text-lg">{day.venue}</p>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-[var(--w-surface)] px-6 py-14 text-[var(--w-bg)] md:px-10">
          <Rise live={live}>
            <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[var(--w-accent)] uppercase">Programme notes</p>
            <p className="m-0 mt-5 font-[family-name:var(--font-serif)] text-[clamp(1.6rem,3vw,2.2rem)] leading-snug">{day.arrival}</p>
            <div className="mt-8 grid gap-5">
              {day.letter.map((paragraph) => (
                <p key={paragraph} className="m-0 text-base leading-relaxed text-[var(--w-bg)]/85">{paragraph}</p>
              ))}
            </div>
          </Rise>
        </div>
        <img src={day.images.couple.src} alt="" className="h-72 w-full object-cover object-[center_30%] md:h-auto md:min-h-full" />
      </section>

      <section className="px-6 py-10 md:px-14">
        <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[var(--w-surface-alt)] uppercase">The record</p>
        <div className="mt-8 grid gap-12">
          {SIDES.map((track, index) => (
            <Rise key={track.side} live={live}>
              <article className={`grid items-center gap-6 md:grid-cols-12 ${index % 2 ? "" : ""}`}>
                <div className={`md:col-span-5 ${index % 2 ? "md:order-2 md:col-start-8" : ""}`}>
                  <img src={track.src} alt="" className="aspect-[5/4] w-full object-cover" style={{ objectPosition: track.focus }} />
                </div>
                <div className={`md:col-span-5 ${index % 2 ? "md:col-start-1 md:row-start-1" : "md:col-start-7"}`}>
                  <p className="m-0 font-[family-name:var(--font-serif)] text-5xl text-[var(--w-surface-alt)]">{track.side}</p>
                  <p className="m-0 mt-3 font-[family-name:var(--font-serif)] text-[clamp(1.7rem,3vw,2.5rem)] leading-snug">{track.line}</p>
                  <p className="m-0 mt-3 max-w-md text-lg leading-relaxed text-[#1a120e]/75">{track.note}</p>
                </div>
              </article>
            </Rise>
          ))}
        </div>
      </section>

      <section className="bg-[var(--w-surface)] px-6 py-16 text-[var(--w-bg)] md:px-14">
        <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[var(--w-accent)] uppercase">From four o&apos;clock</p>
        <ol className="m-0 mt-10 grid list-none gap-0 p-0 md:grid-cols-4">
          {day.hours.map((hour) => (
            <li key={hour.time} className="border-t border-[#efe6d6]/20 py-6 md:border-t-0 md:border-l md:border-[#efe6d6]/20 md:px-5 md:first:border-l-0 md:first:pl-0">
              <Rise live={live}>
                <p className="m-0 font-[family-name:var(--font-serif)] text-4xl text-[var(--w-accent)]">{hour.time}</p>
                <h2 className="m-0 mt-2 font-[family-name:var(--font-serif)] text-2xl">{hour.title}</h2>
                <p className="m-0 mt-2 text-sm leading-relaxed text-[var(--w-bg)]/75">{hour.detail}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid items-start gap-10 px-6 py-16 md:grid-cols-2 md:px-14">
        <Rise live={live}>
          <img src={day.images.dress.src} alt="" className="aspect-[4/5] w-full object-cover" />
        </Rise>
        <Rise live={live}>
          <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[var(--w-surface-alt)] uppercase">What to wear</p>
          <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-3xl leading-snug">{day.dress}</p>
          <ul className="m-0 mt-8 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-t border-[#1a120e]/15 py-4">
                <p className="m-0 font-[family-name:var(--font-serif)] text-2xl">{stay.name}</p>
                <p className="m-0 mt-1 text-[#1a120e]/75">{stay.detail}</p>
              </li>
            ))}
          </ul>
          <p className="m-0 mt-10 font-[family-name:var(--font-serif)] text-3xl">Keep my place on the setlist</p>
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
  return <div ref={ref} className={`el-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-serif)] text-3xl">We will look for you, {sent}.</p>;
  return (
    <form className="mt-6 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#1a120e]/25 bg-transparent px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#1a120e]/25 bg-[#efe6d6] px-3 text-base text-[#1a120e]">
          <option>Friday</option><option>Saturday</option><option>The morning after</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#1a120e]/25 bg-transparent px-3 py-2 text-base" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[var(--w-surface)] px-5 text-base text-[var(--w-bg)]">I will be there</button>
    </form>
  );
}
