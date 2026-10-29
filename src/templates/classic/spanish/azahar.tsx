"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { azaharDay as day } from "./azahar-day";

const BLOOMS = [
  { left: "8%", top: "14%", delay: "0.8s", size: 18 },
  { left: "78%", top: "18%", delay: "1.6s", size: 14 },
  { left: "16%", top: "72%", delay: "2.4s", size: 16 },
  { left: "84%", top: "68%", delay: "3.1s", size: 20 },
  { left: "46%", top: "10%", delay: "2s", size: 12 },
  { left: "70%", top: "80%", delay: "3.8s", size: 15 },
];

const FRAMES = [
  { src: "/photos/walk.jpg", focus: "center 40%", title: "The dock", line: day.dock[0], note: day.letter[0] },
  { src: "/photos/bouquet.jpg", focus: "center", title: "The flowers", line: day.dock[1], note: day.letter[1] },
  { src: "/photos/rings.jpg", focus: "center", title: "The rings", line: day.dock[2], note: day.letter[2] },
  { src: "/photos/kiss.jpg", focus: "center 40%", title: "Before the light goes", line: day.dock[3], note: day.letter[3] },
  { src: "/photos/dress.jpg", focus: "center", title: "Supper", line: day.hours[2].detail, note: day.dress },
  { src: "/photos/couple.jpg", focus: "center 32%", title: "Claire and Thomas", line: `${day.time}. ${day.venue}.`, note: day.address },
];

export function Azahar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-clip bg-[#f6f1e7] text-[#2a241c]">
      <style>{`
        .az-sky { opacity: 1; transition: opacity 1s ease; }
        .az-sky.is-leaving { opacity: 0; }
        .az-shot { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .az-focus { animation: az-focus 7.4s cubic-bezier(0.45, 0, 0.2, 1) forwards, az-out 1.6s ease 7.6s forwards; }
        .az-final { opacity: 0; animation: az-stay 1.8s ease 14s forwards; }
        .az-bloom { position: absolute; border-radius: 999px; background: radial-gradient(circle at 40% 40%, #fff6d8, #e2a322 55%, #9a6a12); opacity: 0; transform: scale(0); animation: az-bloom 2.8s ease both; }
        .az-said { opacity: 0; animation: az-said 3.4s ease 1.2s both; }
        .az-name { opacity: 0; animation: az-track 1.5s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .az-line { opacity: 0; clip-path: inset(0 100% 0 0); animation: az-reveal 1.5s ease both; }
        .az-rise { opacity: 0; transform: translateY(22px); }
        .az-rise.is-in { animation: az-up 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .az-drift { animation: az-drift 26s ease-in-out infinite alternate; }
        @keyframes az-focus { from { filter: blur(16px); transform: scale(1.16); } to { filter: blur(0); transform: scale(1); } }
        @keyframes az-out { to { opacity: 0; } }
        @keyframes az-mid { 0% { opacity: 0; transform: scale(1.06); } 16% { opacity: 1; transform: scale(1); } 74% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes az-stay { from { opacity: 0; transform: scale(1.05); } to { opacity: 1; transform: none; } }
        @keyframes az-bloom { 0% { opacity: 0; transform: scale(0); } 35% { opacity: 0.95; transform: scale(1); } 70% { opacity: 0.85; } 100% { opacity: 0; transform: scale(1.2); } }
        @keyframes az-said { 0% { opacity: 0; } 20% { opacity: 1; } 70% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes az-track { from { opacity: 0; letter-spacing: 0.28em; transform: translateY(12px); } to { opacity: 1; letter-spacing: 0; transform: none; } }
        @keyframes az-reveal { to { opacity: 1; clip-path: inset(0 0 0 0); } }
        @keyframes az-up { to { opacity: 1; transform: none; } }
        @keyframes az-drift { from { transform: scale(1.04); } to { transform: scale(1.1) translate3d(-1.5%, -1%, 0); } }
        @media (prefers-reduced-motion: reduce) {
          .az-bloom, .az-said, .az-focus, .az-mid { display: none; }
          .az-final, .az-name, .az-line, .az-rise { animation: none; opacity: 1; transform: none; clip-path: none; letter-spacing: 0; filter: none; }
        }
      `}</style>
      {!open && <Focus onDone={() => setOpen(true)} />}
      <Letter live={open} />
    </div>
  );
}

function Focus({ onDone }: { onDone: () => void }) {
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
    <section className={`az-sky fixed inset-0 z-50 overflow-hidden bg-[#1a140f] text-[#f6f1e7] ${leaving ? "is-leaving" : ""}`} aria-label="The afternoon comes into focus">
      <img src="/photos/couple.jpg" alt="" className="az-shot az-focus object-[center_32%]" />
      <img src="/photos/walk.jpg" alt="" className="az-shot az-mid object-[center_40%]" style={{ animation: "az-mid 3.8s ease 7.4s both" }} />
      <img src="/photos/bouquet.jpg" alt="" className="az-shot az-mid object-center" style={{ animation: "az-mid 3.6s ease 10.8s both" }} />
      <img src="/photos/couple.jpg" alt="" className="az-shot az-final object-[center_32%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
      {BLOOMS.map((bloom) => (
        <span key={bloom.left + bloom.top} className="az-bloom" style={{ left: bloom.left, top: bloom.top, width: bloom.size, height: bloom.size, animationDelay: bloom.delay }} />
      ))}
      <p className="az-said absolute inset-x-0 top-[12vh] m-0 text-center font-[family-name:var(--font-serif)] text-[clamp(1.8rem,4vw,3rem)] italic">Open your eyes.</p>
      <div className="absolute inset-x-0 bottom-[8vh] px-6 text-center">
        <p className="az-name m-0 font-[family-name:var(--font-serif)] text-[clamp(2.8rem,8vw,5.6rem)] leading-none" style={{ animationDelay: "15.2s" }}>{day.first}</p>
        <p className="az-name m-0 font-[family-name:var(--font-script)] text-[clamp(2rem,5vw,3.4rem)] text-[#f0c56e]" style={{ animationDelay: "16.4s" }}>and {day.second}</p>
        <p className="az-line m-0 mt-4 text-sm tracking-[0.22em] uppercase" style={{ animationDelay: "17.8s" }}>{day.dateLabel}</p>
        <p className="az-line m-0 mt-2 font-[family-name:var(--font-serif)] text-2xl italic" style={{ animationDelay: "19s" }}>{day.time} · {day.venue}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[3] cursor-pointer border border-white/40 bg-black/35 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Letter({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="relative min-h-dvh">
        <img src="/photos/couple.jpg" alt="Claire and Thomas at the lake" className="az-drift absolute inset-0 size-full object-cover object-[center_32%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a140f]/80 via-[#1a140f]/20 to-[#1a140f]/30" />
        <div className="relative flex min-h-dvh flex-col items-center justify-end px-6 pb-16 text-center text-[#f6f1e7]">
          <p className="m-0 text-[0.68rem] tracking-[0.34em] text-[#f0c56e] uppercase">{day.place}</p>
          <h1 className="m-0 mt-4 font-[family-name:var(--font-serif)] text-[clamp(3.2rem,8vw,6rem)] leading-[0.9] font-medium">
            {day.first}
            <span className="mt-1 block font-[family-name:var(--font-script)] text-[clamp(2.2rem,5vw,3.6rem)] text-[#f0c56e]">and</span>
            {day.second}
          </h1>
          <p className="m-0 mt-4 text-sm tracking-[0.18em] uppercase">{day.dateLabel}</p>
          <p className="m-0 mt-2 font-[family-name:var(--font-serif)] text-2xl italic">{day.time}</p>
        </div>
      </section>
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
          <p className="m-0 mt-8 text-sm tracking-[0.16em] text-[#8a5a18] uppercase">{day.bride} and {day.groom}</p>
          <p className="m-0 mt-2">{day.address}</p>
        </Rise>
      </section>
      {FRAMES.map((frame, index) => (
        <section key={frame.title} className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-12 md:grid-cols-2 md:py-16">
          <Rise live={live}>
            <img src={frame.src} alt="" className={`aspect-[4/5] w-full object-cover ${index % 2 ? "md:order-2" : ""}`} style={{ objectPosition: frame.focus }} />
          </Rise>
          <Rise live={live}>
            <div className={index % 2 ? "md:order-1" : ""}>
              <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#8a5a18] uppercase">{frame.title}</p>
              <p className="m-0 mt-3 font-[family-name:var(--font-serif)] text-[clamp(1.8rem,3vw,2.8rem)] leading-snug">{frame.line}</p>
              <p className="m-0 mt-4 text-lg leading-relaxed">{frame.note}</p>
            </div>
          </Rise>
        </section>
      ))}
      <section className="bg-[#2f3a28] px-6 py-20 text-[#f6f1e7]">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          <Rise live={live}>
            <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#f0c56e] uppercase">The hours</p>
            <ol className="m-0 mt-8 list-none p-0">
              {day.hours.map((hour) => (
                <li key={hour.time} className="border-t border-[#f6f1e7]/20 py-5">
                  <p className="m-0 font-[family-name:var(--font-serif)] text-4xl text-[#f0c56e]">{hour.time}</p>
                  <h2 className="m-0 mt-1 font-[family-name:var(--font-serif)] text-3xl font-medium">{hour.title}</h2>
                  <p className="m-0 mt-2 text-[#f6f1e7]/80">{hour.detail}</p>
                </li>
              ))}
            </ol>
          </Rise>
          <Rise live={live}>
            <img src="/photos/walk.jpg" alt="Claire and Thomas by the water" className="aspect-[3/4] w-full object-cover object-[center_40%]" />
            <p className="m-0 mt-6 font-[family-name:var(--font-serif)] text-2xl leading-snug">{day.dress}</p>
          </Rise>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr]">
        <Rise live={live}>
          <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#8a5a18] uppercase">Where to stay</p>
          <ul className="m-0 mt-6 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-t border-[#2a241c]/15 py-4">
                <p className="m-0 font-[family-name:var(--font-serif)] text-2xl">{stay.name}</p>
                <p className="m-0 mt-1 leading-relaxed">{stay.detail}</p>
              </li>
            ))}
          </ul>
        </Rise>
        <Rise live={live}>
          <img src="/photos/kiss.jpg" alt="" className="aspect-[4/5] w-full object-cover object-[center_40%]" />
        </Rise>
      </section>
      <section className="bg-[#f3e7d2] px-6 py-20 text-center">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-script)] text-5xl text-[#8a5a18]">A place in the afternoon</p>
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
  return <div ref={ref} className={`az-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
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
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#2a241c]/20 bg-white/80 px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#2a241c]/20 bg-[#f6f1e7] px-3 text-base">
          <option>Friday</option><option>Saturday</option><option>Already by the water</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#2a241c]/20 bg-white/80 px-3 py-2 text-base" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[#2f3a28] px-5 text-base text-[#f6f1e7]">Keep my place</button>
    </form>
  );
}
