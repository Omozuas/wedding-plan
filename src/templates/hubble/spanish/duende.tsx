"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { duendeDay as day } from "./duende-day";

const ROOMS = [
  { src: "/photos/walk.jpg", focus: "center 42%", kicker: "One", line: day.dock[0], note: day.letter[0] },
  { src: "/photos/bouquet.jpg", focus: "center", kicker: "Two", line: day.dock[1], note: day.letter[1] },
  { src: "/photos/rings.jpg", focus: "center", kicker: "Three", line: day.dock[2], note: day.letter[2] },
  { src: "/photos/kiss.jpg", focus: "center 38%", kicker: "Four", line: day.dock[3], note: day.letter[3] },
  { src: "/photos/dress.jpg", focus: "center", kicker: "Five", line: day.hours[2].title, note: day.hours[2].detail },
  { src: "/photos/couple.jpg", focus: "center 30%", kicker: "Six", line: day.arrival, note: `${day.bride} and ${day.groom}. ${day.address}.` },
];

export function Duende() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-clip bg-[#f4efe8] text-[#2a1214]">
      <style>{`
        .du-sky { opacity: 1; transition: opacity 1s ease; }
        .du-sky.is-leaving { opacity: 0; }
        .du-pull { animation: du-pull 8s cubic-bezier(0.45, 0, 0.2, 1) forwards, du-fade 1.8s ease 8s forwards; }
        .du-back { opacity: 0; animation: du-back 2.8s ease 8s forwards; }
        .du-said { opacity: 0; animation: du-said 3.6s ease 0.6s both; }
        .du-name { opacity: 0; transform: scale(1.35); animation: du-name 1.5s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .du-line { opacity: 0; animation: du-line 1.1s ease both; }
        .du-rise { opacity: 0; transform: translateY(26px); }
        .du-rise.is-in { animation: du-line 1s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        @keyframes du-pull { from { transform: scale(2.7); } to { transform: scale(1.05); } }
        @keyframes du-fade { to { opacity: 0; } }
        @keyframes du-back { from { opacity: 0; transform: scale(1.08); } to { opacity: 1; transform: scale(1); } }
        @keyframes du-said { 0% { opacity: 0; } 18% { opacity: 1; } 62% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes du-name { from { opacity: 0; transform: scale(1.35); } to { opacity: 1; transform: scale(1); } }
        @keyframes du-line { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .du-pull, .du-said { display: none; }
          .du-back, .du-name, .du-line, .du-rise { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
      {!open && <Pull onDone={() => setOpen(true)} />}
      <Essay live={open} />
    </div>
  );
}

function Pull({ onDone }: { onDone: () => void }) {
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
    <section className={`du-sky fixed inset-0 z-50 overflow-hidden bg-[#1a0c0e] text-[#f4efe8] ${leaving ? "is-leaving" : ""}`} aria-label="The camera pulls back from the flowers to the couple">
      <img src="/photos/couple.jpg" alt="" className="du-back absolute inset-0 size-full object-cover object-[center_30%]" />
      <img src="/photos/bouquet.jpg" alt="" className="du-pull absolute inset-0 size-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      <p className="du-said absolute inset-x-0 top-[10vh] m-0 text-center font-[family-name:var(--font-serif)] text-[clamp(1.6rem,4vw,2.8rem)] italic">Closer.</p>
      <div className="absolute inset-x-0 bottom-[9vh] px-6 text-center">
        <p className="du-line m-0 text-[0.68rem] tracking-[0.32em] text-[#e7c27a] uppercase" style={{ animationDelay: "9.2s" }}>Now the whole afternoon</p>
        <p className="du-name m-0 mt-3 font-[family-name:var(--font-serif)] text-[clamp(3rem,9vw,6.4rem)] leading-[0.86]" style={{ animationDelay: "11.2s" }}>{day.first}</p>
        <p className="du-name m-0 font-[family-name:var(--font-serif)] text-[clamp(3rem,9vw,6.4rem)] leading-[0.86] text-[#e7c27a]" style={{ animationDelay: "13s" }}>{day.second}</p>
        <p className="du-line m-0 mt-4 font-[family-name:var(--font-serif)] text-2xl italic" style={{ animationDelay: "15.4s" }}>{day.time}</p>
        <p className="du-line m-0 mt-1 text-sm tracking-[0.16em] uppercase" style={{ animationDelay: "16.8s" }}>{day.dateLabel}</p>
        <p className="du-line m-0 mt-1 text-sm text-[#e7c27a]" style={{ animationDelay: "18s" }}>{day.venue}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[3] cursor-pointer border border-white/40 bg-black/40 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Essay({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="grid min-h-dvh items-end bg-[#3c1218] px-6 py-16 text-[#f4efe8] md:px-14">
        <div className="max-w-4xl">
          <p className="m-0 text-[0.68rem] tracking-[0.36em] text-[#e7c27a] uppercase">{day.place}</p>
          <h1 className="m-0 mt-4 font-[family-name:var(--font-serif)] text-[clamp(3.4rem,9vw,7rem)] leading-[0.84] font-medium">
            {day.first}
            <span className="block text-[#e7c27a]">{day.second}</span>
          </h1>
          <p className="m-0 mt-6 max-w-xl font-[family-name:var(--font-serif)] text-2xl italic">{day.dateLabel} · {day.time}</p>
          <p className="m-0 mt-2">{day.venue}</p>
        </div>
      </section>
      <section className="grid md:grid-cols-2">
        <img src="/photos/bouquet.jpg" alt="The flowers" className="h-[70vh] w-full object-cover md:h-auto md:min-h-[80vh]" />
        <div className="flex flex-col justify-center gap-8 px-6 py-16 md:px-12">
          {day.letter.map((paragraph) => (
            <Rise key={paragraph} live={live}>
              <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(1.4rem,2vw,1.8rem)] leading-snug">{paragraph}</p>
            </Rise>
          ))}
        </div>
      </section>
      {ROOMS.map((room, index) => (
        <section key={room.kicker} className="relative min-h-[88vh]">
          <img src={room.src} alt="" className="absolute inset-0 size-full object-cover" style={{ objectPosition: room.focus }} />
          <div className={`absolute inset-0 ${index % 2 ? "bg-gradient-to-r from-[#1a0c0e]/80 to-transparent" : "bg-gradient-to-t from-[#1a0c0e]/80 to-transparent"}`} />
          <div className="relative flex min-h-[88vh] items-end px-6 py-14 text-[#f4efe8] md:px-14">
            <Rise live={live}>
              <p className="m-0 text-[0.68rem] tracking-[0.32em] text-[#e7c27a] uppercase">{room.kicker}</p>
              <p className="m-0 mt-3 max-w-xl font-[family-name:var(--font-serif)] text-[clamp(2rem,4vw,3.4rem)] leading-[1.05]">{room.line}</p>
              <p className="m-0 mt-4 max-w-lg text-lg leading-relaxed text-[#f4efe8]/85">{room.note}</p>
            </Rise>
          </div>
        </section>
      ))}
      <section className="bg-[#3c1218] px-6 py-20 text-[#f4efe8] md:px-14">
        <p className="m-0 text-[0.68rem] tracking-[0.32em] text-[#e7c27a] uppercase">From four o&apos;clock</p>
        <ol className="m-0 mt-10 grid list-none gap-10 p-0 md:grid-cols-2">
          {day.hours.map((hour) => (
            <li key={hour.time}>
              <Rise live={live}>
                <p className="m-0 font-[family-name:var(--font-serif)] text-6xl text-[#e7c27a]">{hour.time}</p>
                <h2 className="m-0 mt-2 font-[family-name:var(--font-serif)] text-3xl font-medium">{hour.title}</h2>
                <p className="m-0 mt-2 max-w-md text-lg text-[#f4efe8]/80">{hour.detail}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>
      <section className="grid items-center gap-10 px-6 py-20 md:grid-cols-2 md:px-14">
        <Rise live={live}>
          <img src="/photos/dress.jpg" alt="The table set for supper" className="aspect-[4/5] w-full object-cover" />
        </Rise>
        <Rise live={live}>
          <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#8a3030] uppercase">What to wear</p>
          <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-3xl leading-snug">{day.dress}</p>
          <ul className="m-0 mt-8 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-t border-[#2a1214]/15 py-4">
                <p className="m-0 font-[family-name:var(--font-serif)] text-2xl">{stay.name}</p>
                <p className="m-0 mt-1">{stay.detail}</p>
              </li>
            ))}
          </ul>
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
  return <div ref={ref} className={`du-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-serif)] text-3xl">We will look for you, {sent}.</p>;
  return (
    <form className="mt-8 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#2a1214]/20 bg-white px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#2a1214]/20 bg-[#f4efe8] px-3 text-base">
          <option>Friday</option><option>Saturday</option><option>The morning after</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#2a1214]/20 bg-white px-3 py-2 text-base" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[#3c1218] px-5 text-base text-[#f4efe8]">I will be there</button>
    </form>
  );
}
