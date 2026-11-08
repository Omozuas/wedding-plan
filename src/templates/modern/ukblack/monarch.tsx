"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { themeVars } from "@/content";
import { monarchDay as day } from "./monarch-day";

const HALL_TITLES = (day.extras.hallTitles as string[] | undefined) ?? ["Approach", "Bloom", "Vow", "Seal"];
const HALLS = [
  { src: day.images.walk.src, focus: day.images.walk.focus, title: HALL_TITLES[0], line: day.dock[0], note: day.letter[0] },
  { src: day.images.bouquet.src, focus: day.images.bouquet.focus, title: HALL_TITLES[1], line: day.dock[1], note: day.letter[1] },
  { src: day.images.rings.src, focus: day.images.rings.focus, title: HALL_TITLES[2], line: day.dock[2], note: day.letter[2] },
  { src: day.images.kiss.src, focus: day.images.kiss.focus, title: HALL_TITLES[3], line: day.dock[3], note: day.letter[3] },
];

export function Monarch() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-clip bg-[var(--w-bg)] text-[var(--w-ink)]" style={themeVars(day.colors)}>
      <style>{`
        .mn-sky { opacity: 1; transition: opacity 1s ease; }
        .mn-sky.is-leaving { opacity: 0; }
        .mn-door { position: absolute; top: 0; bottom: 0; width: 52%; overflow: hidden; background: #1c0e12; transform-origin: left center; }
        .mn-door.right { right: 0; left: auto; transform-origin: right center; }
        .mn-door.left { left: 0; animation: mn-left 3.4s cubic-bezier(0.45, 0, 0.2, 1) 2.2s forwards; }
        .mn-door.right { animation: mn-right 3.4s cubic-bezier(0.45, 0, 0.2, 1) 2.2s forwards; }
        .mn-panel { position: absolute; inset: 8% 10%; border: 2px solid var(--w-accent); }
        .mn-handle { position: absolute; top: 50%; width: 14px; height: 48px; margin-top: -24px; border-radius: 999px; background: linear-gradient(#ffe9a0, var(--w-accent)); box-shadow: 0 0 24px rgba(201,162,39,0.45); }
        .mn-door.left .mn-handle { right: 18px; }
        .mn-door.right .mn-handle { left: 18px; }
        .mn-glow { position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(255,233,160,0.55), transparent 55%); opacity: 0; animation: mn-glow 2.8s ease 2s forwards; }
        .mn-couple { opacity: 0; transform: scale(1.06); animation: mn-couple 2.6s ease 3.6s forwards; }
        .mn-name { opacity: 0; animation: mn-name 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .mn-rise { opacity: 0; transform: translateY(20px); }
        .mn-rise.is-in { animation: mn-name 0.85s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        @keyframes mn-left { to { transform: perspective(900px) rotateY(-72deg); opacity: 0.15; } }
        @keyframes mn-right { to { transform: perspective(900px) rotateY(72deg); opacity: 0.15; } }
        @keyframes mn-glow { 0% { opacity: 0; } 40% { opacity: 1; } 100% { opacity: 0.2; } }
        @keyframes mn-couple { from { opacity: 0; transform: scale(1.06); } to { opacity: 1; transform: none; } }
        @keyframes mn-name { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .mn-door.left, .mn-door.right, .mn-glow { animation: none; opacity: 0; }
          .mn-couple, .mn-name, .mn-rise { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
      {!open && <Doors onDone={() => setOpen(true)} />}
      <Hall live={open} />
    </div>
  );
}

function Doors({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 17800);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 19000);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`mn-sky fixed inset-0 z-50 overflow-hidden bg-[#0a0608] text-[#f6ebe0] ${leaving ? "is-leaving" : ""}`} aria-label="Gold doors swing open onto Claire and Thomas">
      <img src={day.images.couple.src} alt="" className="mn-couple absolute inset-0 size-full object-cover object-[center_30%]" />
      <div className="mn-glow z-[1]" />
      <div className="mn-door left z-[2]">
        <img src={day.images.bouquet.src} alt="" className="absolute inset-0 size-full object-cover opacity-40" />
        <span className="mn-panel" />
        <span className="mn-handle" />
      </div>
      <div className="mn-door right z-[2]">
        <img src={day.images.walk.src} alt="" className="absolute inset-0 size-full object-cover opacity-40" />
        <span className="mn-panel" />
        <span className="mn-handle" />
      </div>
      <div className="absolute inset-0 z-[3] bg-gradient-to-t from-[#0a0608] via-transparent to-[#0a0608]/40" />
      <div className="absolute inset-x-0 bottom-[8vh] z-[4] px-6 text-center">
        <p className="mn-name m-0 text-[0.68rem] tracking-[0.28em] text-[var(--w-accent)] uppercase" style={{ animationDelay: "9.6s" }}>Enter</p>
        <p className="mn-name m-0 mt-2 font-[family-name:var(--font-display)] text-[clamp(2.8rem,10vw,6.2rem)] leading-none font-extrabold tracking-[-0.06em]" style={{ animationDelay: "10.5s" }}>{day.first}</p>
        <p className="mn-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.8rem,10vw,6.2rem)] leading-none font-extrabold tracking-[-0.06em] text-[var(--w-accent)]" style={{ animationDelay: "11.6s" }}>{day.second}</p>
        <p className="mn-name m-0 mt-4 font-[family-name:var(--font-serif)] text-2xl italic" style={{ animationDelay: "13s" }}>{day.time} · {day.shortDate}</p>
        <p className="mn-name m-0 mt-1 text-sm tracking-[0.14em] uppercase" style={{ animationDelay: "14.2s" }}>{day.venue}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[5] cursor-pointer border border-[var(--w-accent)]/50 bg-black/45 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Hall({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="relative min-h-[92vh] overflow-hidden">
        <img src={day.images.couple.src} alt="" className="absolute inset-0 size-full object-cover object-[center_28%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#14080c] via-[#14080c]/55 to-transparent" />
        <div className="relative flex min-h-[92vh] max-w-xl flex-col justify-end px-6 py-16 md:px-12">
          <p className="m-0 text-[0.68rem] font-semibold tracking-[0.28em] text-[var(--w-accent)] uppercase">{day.place}</p>
          <h1 className="m-0 mt-3 font-[family-name:var(--font-display)] text-[clamp(3.4rem,11vw,7rem)] leading-[0.82] font-extrabold tracking-[-0.07em]">
            {day.first}
            <span className="block text-[var(--w-accent)]">{day.second}</span>
          </h1>
          <p className="m-0 mt-5 text-sm font-semibold tracking-[0.16em] uppercase">{day.dateLabel}</p>
          <p className="m-0 mt-2 font-[family-name:var(--font-serif)] text-2xl italic">{day.time}</p>
          <p className="m-0 mt-2 text-lg">{day.venue}</p>
        </div>
      </section>

      <section className="bg-[var(--w-accent)] px-6 py-14 text-[var(--w-bg)] md:px-12">
        <Rise live={live}>
          <p className="m-0 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3.6rem)] leading-[1.05] font-extrabold tracking-[-0.04em]">{day.arrival}</p>
          <p className="m-0 mt-5 max-w-2xl text-lg">{day.bride} and {day.groom}. {day.address}.</p>
        </Rise>
      </section>

      {HALLS.map((hall, index) => (
        <section key={hall.title} className="relative min-h-[80vh]">
          <img src={hall.src} alt="" className="absolute inset-0 size-full object-cover" style={{ objectPosition: hall.focus }} />
          <div className={`absolute inset-0 ${index % 2 ? "bg-gradient-to-l from-[#14080c] via-[#14080c]/70 to-transparent" : "bg-gradient-to-r from-[#14080c] via-[#14080c]/70 to-transparent"}`} />
          <div className={`relative flex min-h-[80vh] items-center px-6 py-16 md:px-12 ${index % 2 ? "justify-end" : ""}`}>
            <Rise live={live}>
              <div className="max-w-md">
                <p className="m-0 font-[family-name:var(--font-display)] text-7xl leading-none font-extrabold tracking-[-0.08em] text-[var(--w-accent)]">{hall.title}</p>
                <p className="m-0 mt-4 font-[family-name:var(--font-display)] text-[clamp(1.7rem,3vw,2.5rem)] leading-snug font-extrabold tracking-[-0.04em]">{hall.line}</p>
                <p className="m-0 mt-4 text-lg leading-relaxed text-[#f6ebe0]/85">{hall.note}</p>
              </div>
            </Rise>
          </div>
        </section>
      ))}

      <section className="bg-[var(--w-ink)] px-6 py-16 text-[var(--w-bg)] md:px-12">
        <p className="m-0 text-[0.68rem] font-semibold tracking-[0.28em] text-[var(--w-accent-alt)] uppercase">The hours</p>
        <div className="mt-10 grid gap-0">
          {day.hours.map((hour) => (
            <Rise key={hour.time} live={live}>
              <article className="grid gap-2 border-t border-[#14080c]/15 py-8 md:grid-cols-[7rem_1fr_1.4fr] md:items-baseline">
                <p className="m-0 font-[family-name:var(--font-display)] text-5xl font-extrabold tracking-[-0.06em] text-[var(--w-accent-alt)]">{hour.time}</p>
                <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-[-0.04em]">{hour.title}</h2>
                <p className="m-0 text-lg text-[var(--w-bg)]/80">{hour.detail}</p>
              </article>
            </Rise>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <img src={day.images.dress.src} alt="" className="h-80 w-full object-cover md:h-auto md:min-h-[70vh]" />
        <div className="flex flex-col justify-center bg-[var(--w-accent-alt)] px-6 py-14 text-[#f6ebe0] md:px-12">
          <Rise live={live}>
            <p className="m-0 text-[0.68rem] font-semibold tracking-[0.28em] text-[var(--w-accent)] uppercase">Dress</p>
            <p className="m-0 mt-4 font-[family-name:var(--font-display)] text-[clamp(1.8rem,3vw,2.6rem)] leading-snug font-extrabold tracking-[-0.04em]">{day.dress}</p>
            <p className="m-0 mt-10 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-[-0.04em]">Hold my seat</p>
            <Reply />
          </Rise>
        </div>
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
  return <div ref={ref} className={`mn-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-[-0.04em]">Your seat is held, {sent}.</p>;
  return (
    <form className="mt-6 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border-0 bg-[#14080c] px-3 text-base text-[#f6ebe0]" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border-0 bg-[var(--w-ink)] px-3 text-base text-[var(--w-bg)]">
          <option>Friday</option><option>Saturday</option><option>For the lights</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border-0 bg-[#14080c] px-3 py-2 text-base text-[#f6ebe0]" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[var(--w-accent)] px-5 text-base text-[var(--w-bg)]">I am coming</button>
    </form>
  );
}
