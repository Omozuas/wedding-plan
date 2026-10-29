"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { velaDay as day } from "./vela-day";

const ROOMS = [
  { src: "/photos/bouquet.jpg", focus: "center", kicker: "The flowers", line: day.dock[1], note: day.letter[0] },
  { src: "/photos/couple.jpg", focus: "center 32%", kicker: "The two of them", line: `${day.first} and ${day.second}`, note: day.letter[1] },
  { src: "/photos/walk.jpg", focus: "center 40%", kicker: "The water", line: day.dock[0], note: day.letter[2] },
  { src: "/photos/rings.jpg", focus: "center", kicker: "The rings", line: day.dock[2], note: "Held up once, where the late light can find them." },
  { src: "/photos/dress.jpg", focus: "center", kicker: "Supper", line: day.hours[2].detail, note: day.letter[3] },
  { src: "/photos/kiss.jpg", focus: "center 40%", kicker: "After", line: day.dock[3], note: day.dress },
];

export function Vela() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-clip bg-[#100c0a] text-[#f6efe6]">
      <style>{`
        .ve-sky { opacity: 1; transition: opacity 1.1s ease; }
        .ve-sky.is-leaving { opacity: 0; }
        .ve-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; animation: ve-drift 18s ease-in-out alternate infinite; }
        .ve-shade { position: absolute; left: 50%; top: 50%; width: 280vmax; height: 280vmax; margin-left: -140vmax; margin-top: -140vmax; background: radial-gradient(circle at center, transparent 0 11%, #100c0a 21%); animation: ve-path 16.5s cubic-bezier(0.45, 0, 0.2, 1) forwards; pointer-events: none; }
        .ve-line { opacity: 0; animation: ve-line 1.3s ease both; }
        .ve-rise { opacity: 0; transform: translateY(22px); }
        .ve-rise.is-in { animation: ve-line 0.9s ease forwards; }
        .ve-glow { animation: ve-glow 7s ease-in-out infinite alternate; }
        @keyframes ve-path { 0% { transform: translate(-20vw, 8vh) scale(1); } 34% { transform: translate(2vw, -6vh) scale(1.2); } 64% { transform: translate(22vw, 4vh) scale(1.35); } 100% { transform: translate(0, 0) scale(4.2); } }
        @keyframes ve-hold { 0% { opacity: 0; } 12% { opacity: 1; } 78% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes ve-stay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ve-drift { from { transform: scale(1.06); } to { transform: scale(1.14) translate3d(-2%, -1%, 0); } }
        @keyframes ve-line { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes ve-glow { from { opacity: 0.45; } to { opacity: 0.9; } }
        @media (prefers-reduced-motion: reduce) {
          .ve-shade, .ve-photo { animation: none; }
          .ve-photo { opacity: 0; }
          .ve-final, .ve-line, .ve-rise { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
      {!open && <Light onDone={() => setOpen(true)} />}
      <Night live={open} />
    </div>
  );
}

function Light({ onDone }: { onDone: () => void }) {
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
    <section className={`ve-sky fixed inset-0 z-50 overflow-hidden bg-[#100c0a] text-[#f6efe6] ${leaving ? "is-leaving" : ""}`} aria-label="A pool of light moves across the room, then the night opens">
      <img src="/photos/bouquet.jpg" alt="" className="ve-photo object-center" style={{ animation: "ve-hold 7s ease both, ve-drift 18s ease-in-out alternate infinite" }} />
      <img src="/photos/couple.jpg" alt="" className="ve-photo object-[center_32%]" style={{ animation: "ve-hold 7.2s ease 6.2s both, ve-drift 18s ease-in-out alternate infinite" }} />
      <img src="/photos/walk.jpg" alt="" className="ve-photo ve-final object-[center_42%]" style={{ animation: "ve-stay 1.8s ease 12.8s forwards, ve-drift 18s ease-in-out alternate infinite" }} />
      <div className="ve-shade z-[2]" />
      <p className="ve-line absolute top-[16vh] left-[8vw] z-[3] m-0 max-w-[12rem] font-[family-name:var(--font-serif)] text-2xl italic" style={{ animationDelay: "1.4s" }}>The flowers first.</p>
      <div className="absolute top-[18vh] left-1/2 z-[3] w-[min(80vw,24rem)] -translate-x-1/2 text-center">
        <p className="ve-line m-0 font-[family-name:var(--font-display)] text-[clamp(2.6rem,8vw,5rem)] leading-none font-extrabold tracking-[-0.05em]" style={{ animationDelay: "7.4s" }}>{day.first}</p>
        <p className="ve-line m-0 font-[family-name:var(--font-display)] text-[clamp(2.6rem,8vw,5rem)] leading-none font-extrabold tracking-[-0.05em] text-[#ffb25a]" style={{ animationDelay: "8.6s" }}>{day.second}</p>
      </div>
      <p className="ve-line absolute right-[8vw] bottom-[22vh] z-[3] m-0 max-w-[12rem] text-right font-[family-name:var(--font-serif)] text-2xl italic" style={{ animationDelay: "13.4s" }}>Then the water.</p>
      <div className="absolute inset-x-0 bottom-[8vh] z-[3] px-6 text-center">
        <p className="ve-line m-0 font-[family-name:var(--font-serif)] text-[clamp(1.6rem,3vw,2.4rem)] italic" style={{ animationDelay: "16.6s" }}>{day.time}</p>
        <p className="ve-line m-0 mt-2 text-sm tracking-[0.16em] uppercase" style={{ animationDelay: "17.8s" }}>{day.dateLabel}</p>
        <p className="ve-line m-0 mt-1 text-sm text-[#ffb25a]" style={{ animationDelay: "19s" }}>{day.venue}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[4] cursor-pointer border border-[#ffb25a]/50 bg-black/45 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Night({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="px-6 pt-16 pb-8">
        <p className="ve-glow m-0 text-[0.68rem] tracking-[0.32em] text-[#ffb25a] uppercase">{day.place}</p>
        <h1 className="m-0 mt-4 max-w-[8ch] font-[family-name:var(--font-display)] text-[clamp(3.4rem,11vw,6.6rem)] leading-[0.84] font-extrabold tracking-[-0.06em]">
          {day.first}
          <span className="block text-[#ffb25a]">{day.second}</span>
        </h1>
        <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-2xl italic">{day.dateLabel}</p>
        <p className="m-0 text-[#ffb25a]">{day.time} · {day.venue}</p>
      </section>
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(1.7rem,3vw,2.4rem)] leading-snug italic">{day.arrival}</p>
          <p className="m-0 mt-4 text-lg text-[#f6efe6]/75">{day.address}</p>
        </Rise>
      </section>
      {ROOMS.map((room) => (
        <section key={room.kicker} className="relative min-h-[90vh]">
          <img src={room.src} alt="" className="absolute inset-0 size-full object-cover" style={{ objectPosition: room.focus }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100c0a] via-[#100c0a]/25 to-[#100c0a]/40" />
          <div className="relative flex min-h-[90vh] items-end px-6 py-14 md:px-14">
            <Rise live={live}>
              <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#ffb25a] uppercase">{room.kicker}</p>
              <p className="m-0 mt-3 max-w-xl font-[family-name:var(--font-serif)] text-[clamp(2rem,4vw,3.2rem)] leading-snug">{room.line}</p>
              <p className="m-0 mt-4 max-w-lg text-lg leading-relaxed text-[#f6efe6]/80">{room.note}</p>
            </Rise>
          </div>
        </section>
      ))}
      <section className="px-6 py-16 md:px-14">
        <p className="m-0 text-xs tracking-[0.28em] text-[#ffb25a] uppercase">While the light holds</p>
        <ol className="m-0 mt-8 list-none p-0">
          {day.hours.map((hour) => (
            <li key={hour.time} className="grid gap-2 border-t border-[#ffb25a]/30 py-6 md:grid-cols-[8rem_1fr]">
              <Rise live={live}>
                <p className="m-0 font-[family-name:var(--font-display)] text-4xl font-extrabold text-[#ffb25a]">{hour.time}</p>
                <h2 className="m-0 font-[family-name:var(--font-display)] text-2xl font-extrabold">{hour.title}</h2>
                <p className="m-0 max-w-md text-[#f6efe6]/75">{hour.detail}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>
      <section className="grid gap-8 px-6 pb-16 md:grid-cols-2 md:px-14">
        <Rise live={live}>
          <p className="m-0 text-xs tracking-[0.24em] text-[#ffb25a] uppercase">Where to stay</p>
          <ul className="m-0 mt-4 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-l border-[#ffb25a] py-3 pl-4">
                <p className="m-0 font-[family-name:var(--font-display)] text-xl font-extrabold">{stay.name}</p>
                <p className="m-0 mt-1 text-[#f6efe6]/75">{stay.detail}</p>
              </li>
            ))}
          </ul>
        </Rise>
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-script)] text-5xl text-[#ffb25a]">The light will know you</p>
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
  return <div ref={ref} className={`ve-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-serif)] text-3xl italic">The light will find you, {sent}.</p>;
  return (
    <form className="mt-8 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#ffb25a]/40 bg-transparent px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#ffb25a]/40 bg-[#1a1410] px-3 text-base text-[#f6efe6]">
          <option>Friday</option><option>Saturday</option><option>I am already there</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#ffb25a]/40 bg-transparent px-3 py-2 text-base" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[#ffb25a] px-5 text-base text-[#100c0a]">Find me a light</button>
    </form>
  );
}
