"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { paseoDay as day } from "./paseo-day";

const WALKERS = [
  { src: "/photos/bouquet.jpg", note: "Someone carried the flowers.", delay: "0.4s", noteDelay: "1.6s" },
  { src: "/photos/rings.jpg", note: "The rings, catching the last light.", delay: "4.8s", noteDelay: "6s" },
  { src: "/photos/dress.jpg", note: "A coat for the dock, later.", delay: "9.2s", noteDelay: "10.4s" },
];

const STOPS = [
  { src: "/photos/walk.jpg", focus: "center 40%", kicker: "01", line: day.dock[0] },
  { src: "/photos/bouquet.jpg", focus: "center", kicker: "02", line: day.dock[1] },
  { src: "/photos/rings.jpg", focus: "center", kicker: "03", line: day.dock[2] },
  { src: "/photos/kiss.jpg", focus: "center 35%", kicker: "04", line: day.dock[3] },
  { src: "/photos/dress.jpg", focus: "center", kicker: "05", line: day.dress },
  { src: "/photos/couple.jpg", focus: "center 30%", kicker: "06", line: `${day.venue}. ${day.time}.` },
];

export function Paseo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-hidden bg-[#140c10] text-[#f6efe6]">
      <style>{`
        .ps-sky { opacity: 1; transition: opacity 1.1s ease; }
        .ps-sky.is-leaving { opacity: 0; }
        .ps-walk { position: absolute; top: 14vh; width: min(68vw, 22rem); animation: ps-walk 4.5s linear both; }
        .ps-note { position: absolute; right: 6vw; bottom: 16vh; max-width: 14rem; opacity: 0; animation: ps-note 2.8s ease both; }
        .ps-arrive { opacity: 0; transform: translateX(-50%); animation: ps-arrive 3.4s cubic-bezier(0.16, 0.84, 0.3, 1) 13.2s forwards; }
        .ps-name { opacity: 0; animation: ps-stay 1s ease both; }
        .ps-rise { opacity: 0; transform: translateY(24px); }
        .ps-rise.is-in { animation: ps-stay 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        @keyframes ps-walk { 0% { transform: translateX(105vw); } 36% { transform: translateX(18vw); } 62% { transform: translateX(8vw); } 100% { transform: translateX(-85vw); } }
        @keyframes ps-note { 0% { opacity: 0; transform: translateY(12px); } 18% { opacity: 1; transform: none; } 70% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes ps-arrive { 0% { opacity: 0; transform: translateX(calc(-50% + 42vw)) rotateY(26deg) scale(0.94); } 100% { opacity: 1; transform: translateX(-50%) rotateY(0deg) scale(1); } }
        @keyframes ps-stay { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .ps-walk, .ps-note { display: none; }
          .ps-arrive, .ps-name, .ps-rise { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
      {!open && <Street onDone={() => setOpen(true)} />}
      <Path live={open} />
    </div>
  );
}

function Street({ onDone }: { onDone: () => void }) {
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
    <section className={`ps-sky fixed inset-0 z-50 overflow-hidden bg-[#140c10] text-[#f6efe6] ${leaving ? "is-leaving" : ""}`} aria-label="The evening walks past, then stops with you" style={{ perspective: "1200px" }}>
      <div className="pointer-events-none absolute inset-0 z-[4] shadow-[inset_0_0_140px_rgba(0,0,0,0.72)]" />
      {WALKERS.map((walker) => (
        <div key={walker.src}>
          <div className="ps-walk" style={{ animationDelay: walker.delay }}>
            <img src={walker.src} alt="" className="h-[62vh] w-full object-cover shadow-[0_18px_40px_rgba(0,0,0,0.45)]" />
          </div>
          <p className="ps-note m-0 font-[family-name:var(--font-serif)] text-2xl leading-snug italic" style={{ animationDelay: walker.noteDelay }}>{walker.note}</p>
        </div>
      ))}
      <div className="ps-arrive absolute top-[16vh] left-1/2 z-[3] w-[min(72vw,24rem)]">
        <img src="/photos/couple.jpg" alt="" className="h-[64vh] w-full object-cover object-[center_30%] shadow-[0_24px_50px_rgba(0,0,0,0.5)]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#140c10] to-transparent px-4 pt-16 pb-4">
          <p className="ps-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.2rem,8vw,4rem)] leading-none font-extrabold tracking-[-0.05em]" style={{ animationDelay: "15.6s" }}>{day.first}</p>
          <p className="ps-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.2rem,8vw,4rem)] leading-none font-extrabold tracking-[-0.05em] text-[#ffb067]" style={{ animationDelay: "17s" }}>{day.second}</p>
          <p className="ps-name m-0 mt-2 text-sm tracking-[0.16em] uppercase" style={{ animationDelay: "18.4s" }}>{day.time} · {day.shortDate}</p>
        </div>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[6] cursor-pointer border border-[#ffb067]/50 bg-black/40 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Path({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="px-6 pt-16 pb-10">
        <p className="m-0 text-[0.68rem] tracking-[0.32em] text-[#ffb067] uppercase">{day.place}</p>
        <h1 className="m-0 mt-4 max-w-[8ch] font-[family-name:var(--font-display)] text-[clamp(3.4rem,12vw,6.5rem)] leading-[0.84] font-extrabold tracking-[-0.06em]">
          {day.first}
          <span className="block text-[#ffb067]">{day.second}</span>
        </h1>
        <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-2xl italic">{day.dateLabel}</p>
        <p className="m-0 text-[#ffb067]">{day.time} · {day.venue}</p>
      </section>
      <section className="px-6 pb-12">
        <Rise live={live}>
          <p className="m-0 max-w-xl font-[family-name:var(--font-serif)] text-[clamp(1.7rem,4vw,2.6rem)] leading-snug italic">{day.arrival}</p>
          <p className="m-0 mt-4 max-w-lg text-lg text-[#f6efe6]/75">{day.bride} and {day.groom}. {day.address}.</p>
        </Rise>
      </section>
      <div className="relative mx-auto max-w-3xl px-6 pb-8">
        <div className="absolute top-0 bottom-0 left-[1.85rem] w-px bg-[#e2a322]/70" />
        {STOPS.map((stop) => (
          <article key={stop.kicker} className="relative pb-16 pl-12">
            <span className="absolute top-2 left-[1.15rem] size-3.5 rounded-full bg-[#ffb067]" />
            <Rise live={live}>
              <p className="m-0 font-[family-name:var(--font-script)] text-4xl text-[#ffb067]">{stop.kicker}</p>
              <img src={stop.src} alt="" className="mt-3 aspect-[5/4] w-full object-cover" style={{ objectPosition: stop.focus }} />
              <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-2xl leading-snug">{stop.line}</p>
            </Rise>
          </article>
        ))}
      </div>
      <section className="bg-[#241018] px-6 py-16">
        <p className="m-0 text-xs tracking-[0.28em] text-[#ffb067] uppercase">Stops along the way</p>
        <ol className="m-0 mt-8 list-none p-0">
          {day.hours.map((hour) => (
            <li key={hour.time} className="grid gap-2 border-t border-[#ffb067]/30 py-6 sm:grid-cols-[6rem_1fr]">
              <Rise live={live}>
                <p className="m-0 font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#ffb067]">{hour.time}</p>
                <h2 className="m-0 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-[-0.04em]">{hour.title}</h2>
                <p className="m-0 max-w-md text-[#f6efe6]/75">{hour.detail}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>
      <section className="px-6 py-16">
        <Rise live={live}>
          <p className="m-0 text-xs tracking-[0.28em] text-[#ffb067] uppercase">Where to stay</p>
          <ul className="m-0 mt-6 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-l-2 border-[#ffb067] py-3 pl-4">
                <p className="m-0 font-[family-name:var(--font-display)] text-xl font-extrabold">{stay.name}</p>
                <p className="m-0 mt-1 text-[#f6efe6]/75">{stay.detail}</p>
              </li>
            ))}
          </ul>
        </Rise>
        <Rise live={live}>
          <p className="m-0 mt-12 font-[family-name:var(--font-script)] text-5xl text-[#ffb067]">Walk with us</p>
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
    const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) setOn(true); }, { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [live]);
  return <div ref={ref} className={`ps-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-serif)] text-3xl italic">We will save you a place on the path, {sent}.</p>;
  return (
    <form className="mt-8 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#ffb067]/40 bg-transparent px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#ffb067]/40 bg-[#241018] px-3 text-base text-[#f6efe6]">
          <option>Friday</option><option>Saturday</option><option>I am already there</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#ffb067]/40 bg-transparent px-3 py-2 text-base" /></label>
      <button type="submit" className="mt-1 min-h-12 cursor-pointer border-0 bg-[#ffb067] px-5 text-base text-[#140c10]">Walk with us</button>
    </form>
  );
}
