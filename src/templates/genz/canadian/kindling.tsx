"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { kindlingDay as day } from "./kindling-day";

const EMBERS = Array.from({ length: 16 }, (_, index) => ({
  left: `${6 + ((index * 17) % 88)}%`,
  delay: `${(index % 8) * 0.7}s`,
  duration: `${6.5 + (index % 5) * 0.8}s`,
  size: index % 3 === 0 ? 4 : 2,
}));

const LANTERNS = [
  { src: "/photos/bouquet.jpg", focus: "center", className: "bottom-[12%] left-[4%] w-[min(24vw,10rem)]", delay: "11.2s" },
  { src: "/photos/rings.jpg", focus: "center", className: "right-[5%] bottom-[22%] w-[min(20vw,8.5rem)]", delay: "13.4s" },
  { src: "/photos/kiss.jpg", focus: "center 40%", className: "bottom-[6%] left-[28%] w-[min(18vw,7.5rem)]", delay: "15.6s" },
];

const CHAPTERS = [
  { src: "/photos/walk.jpg", focus: "center 40%", line: day.dock[0] },
  { src: "/photos/bouquet.jpg", focus: "center", line: day.dock[1] },
  { src: "/photos/rings.jpg", focus: "center", line: day.dock[2] },
  { src: "/photos/dress.jpg", focus: "center", line: day.dock[3] },
];

const HOUR_PHOTOS = ["/photos/couple.jpg", "/photos/kiss.jpg", "/photos/dress.jpg", "/photos/walk.jpg"];

export function Kindling() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-hidden bg-[#140e0b] text-[#f6efe6]">
      <style>{`
        .ki-sky { opacity: 1; transition: opacity 1.2s ease; }
        .ki-sky.is-leaving { opacity: 0; }
        .ki-ember { position: absolute; bottom: 8%; border-radius: 999px; background: #ffb15a; opacity: 0; animation: ki-ember linear infinite; }
        .ki-said { opacity: 0; animation: ki-said 3.8s ease 0.8s both; }
        .ki-name { opacity: 0; animation: ki-stay 1.4s ease both; }
        .ki-line { opacity: 0; animation: ki-stay 1.1s ease both; }
        .ki-horizon { height: 26vh; animation: ki-rise 8s cubic-bezier(0.45, 0, 0.2, 1) 6.2s forwards; }
        .ki-pan { animation: ki-pan 22s ease-in-out infinite alternate; }
        .ki-in { opacity: 0; animation: ki-in 2.4s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .ki-sway { animation: ki-sway 6.5s ease-in-out infinite alternate; }
        .ki-rise { opacity: 0; transform: translateY(28px); }
        .ki-rise.is-in { animation: ki-stay 1s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .ki-glow { animation: ki-glow 5s ease-in-out infinite alternate; }
        @keyframes ki-ember { 0% { transform: translateY(0) scale(1); opacity: 0; } 12% { opacity: 0.85; } 100% { transform: translateY(-68vh) scale(0.3); opacity: 0; } }
        @keyframes ki-said { 0% { opacity: 0; transform: translateY(16px); } 20% { opacity: 1; transform: none; } 68% { opacity: 1; } 100% { opacity: 0; transform: translateY(-10px); } }
        @keyframes ki-stay { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes ki-rise { to { height: 56vh; } }
        @keyframes ki-pan { from { transform: scale(1.08) translate3d(0, 0, 0); } to { transform: scale(1.16) translate3d(-3%, -2%, 0); } }
        @keyframes ki-in { from { opacity: 0; transform: translateY(28px) scale(0.92); } to { opacity: 1; transform: none; } }
        @keyframes ki-sway { from { transform: translateY(0); } to { transform: translateY(-10px); } }
        @keyframes ki-glow { from { opacity: 0.35; } to { opacity: 0.7; } }
        @media (prefers-reduced-motion: reduce) {
          .ki-ember, .ki-said, .ki-name, .ki-line, .ki-horizon, .ki-pan, .ki-in, .ki-sway, .ki-rise, .ki-glow { animation: none; }
          .ki-name, .ki-line, .ki-rise, .ki-in { opacity: 1; transform: none; }
          .ki-horizon { height: 56vh; }
        }
      `}</style>
      {!open && <Dusk onDone={() => setOpen(true)} />}
      <Hearth live={open} />
    </div>
  );
}

function Dusk({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 23600);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 25000);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`ki-sky fixed inset-0 z-50 overflow-hidden bg-[#140e0b] text-[#f6efe6] ${leaving ? "is-leaving" : ""}`} aria-label="Evening settles on the dock">
      {EMBERS.map((ember, index) => (
        <span key={index} className="ki-ember" style={{ left: ember.left, width: ember.size, height: ember.size, animationDelay: ember.delay, animationDuration: ember.duration }} />
      ))}
      <div className="relative z-[2] px-5 pt-[9vh] text-center">
        <p className="ki-said m-0 font-[family-name:var(--font-serif)] text-[clamp(1.8rem,5vw,3.4rem)] leading-tight italic">The light is going.</p>
        <p className="ki-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.6rem,10vw,6rem)] leading-[0.86] font-extrabold tracking-[-0.05em]" style={{ animationDelay: "4.6s" }}>{day.first}</p>
        <p className="ki-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.6rem,10vw,6rem)] leading-[0.86] font-extrabold tracking-[-0.05em] text-[#ff9a4a]" style={{ animationDelay: "7.8s" }}>{day.second}</p>
        <p className="ki-line m-0 mt-3 font-[family-name:var(--font-serif)] text-[clamp(1.4rem,3vw,2rem)] italic" style={{ animationDelay: "17.2s" }}>{day.time}</p>
        <p className="ki-line m-0 mt-1 text-sm tracking-[0.18em] text-[#f6efe6]/80 uppercase" style={{ animationDelay: "19s" }}>{day.dateLabel}</p>
        <p className="ki-line m-0 mt-1 text-sm text-[#ffd7b0]" style={{ animationDelay: "20.8s" }}>{day.venue}</p>
      </div>
      <div className="ki-horizon absolute inset-x-0 bottom-0 overflow-hidden">
        <img src="/photos/walk.jpg" alt="" className="ki-pan absolute inset-0 size-full object-cover object-[center_42%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-[#140e0b]" />
        {LANTERNS.map((lantern) => (
          <div key={lantern.src} className={`ki-in absolute ${lantern.className}`} style={{ animationDelay: lantern.delay }}>
            <div className="ki-sway overflow-hidden rounded-t-[2rem] rounded-b-md shadow-[0_0_36px_rgba(255,150,60,0.45)]">
              <img src={lantern.src} alt="" className="aspect-[3/4] w-full object-cover" style={{ objectPosition: lantern.focus }} />
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[3] cursor-pointer border border-[#ffd7b0]/40 bg-black/40 px-4 py-2 text-[0.68rem] tracking-[0.22em] text-[#f6efe6] uppercase">
        Skip
      </button>
    </section>
  );
}

function Hearth({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="relative min-h-dvh overflow-hidden">
        <img src="/photos/couple.jpg" alt="Claire and Thomas at the lake" className="ki-pan absolute inset-0 size-full object-cover object-[center_32%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#140e0b] via-[#140e0b]/35 to-[#140e0b]/55" />
        {EMBERS.slice(0, 8).map((ember, index) => (
          <span key={index} className="ki-ember" style={{ left: ember.left, width: ember.size, height: ember.size, animationDelay: ember.delay, animationDuration: ember.duration }} />
        ))}
        <div className="relative z-[1] flex min-h-dvh flex-col justify-end px-5 pb-14 sm:px-10">
          <p className="m-0 font-[family-name:var(--font-serif)] text-lg italic text-[#ffd7b0]">Kindling · Lake Rosseau</p>
          <h1 className="m-0 mt-2 max-w-full font-[family-name:var(--font-script)] text-[clamp(3.2rem,8vw,6.4rem)] leading-[0.85] text-[#f6efe6]">
            {day.first}
            <span className="block font-[family-name:var(--font-serif)] text-[0.42em] italic text-[#ff9a4a]">and</span>
            {day.second}
          </h1>
          <p className="m-0 mt-4 max-w-xl text-lg leading-relaxed text-[#f6efe6]/85">{day.dateLabel}. {day.time}. {day.venue}, {day.place}.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-24 text-center">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(2rem,5vw,3.4rem)] leading-snug italic">{day.arrival}</p>
          <p className="m-0 mt-6 text-[#f6efe6]/70">{day.address}</p>
        </Rise>
      </section>

      {CHAPTERS.map((chapter, index) => (
        <section key={chapter.line} className="px-5 py-10 sm:px-10">
          <div className={`grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] ${index % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <Rise live={live}>
              <div className="overflow-hidden rounded-t-[8rem] rounded-b-2xl shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                <img src={chapter.src} alt="" className="ki-pan aspect-[16/10] w-full object-cover" style={{ objectPosition: chapter.focus }} />
              </div>
            </Rise>
            <Rise live={live}>
              <p className="m-0 font-[family-name:var(--font-script)] text-6xl text-[#ff9a4a]">0{index + 1}</p>
              <p className="m-0 mt-3 max-w-md font-[family-name:var(--font-serif)] text-[clamp(1.8rem,4vw,2.8rem)] leading-snug">{chapter.line}</p>
            </Rise>
          </div>
        </section>
      ))}

      <section className="px-5 py-20 sm:px-10">
        <Rise live={live}>
          <p className="m-0 text-center font-[family-name:var(--font-serif)] text-3xl italic text-[#ffd7b0]">The evening, slowly</p>
        </Rise>
        <div className="mt-10 grid gap-16">
          {day.hours.map((hour, index) => (
            <Rise key={hour.time} live={live}>
              <article className="mx-auto max-w-4xl">
                <div className="overflow-hidden rounded-t-[10rem]">
                  <img src={HOUR_PHOTOS[index]} alt="" className="ki-pan aspect-[16/8] w-full object-cover object-[center_40%]" />
                </div>
                <div className="relative -mt-10 px-4">
                  <p className="m-0 font-[family-name:var(--font-display)] text-[clamp(3.5rem,10vw,6rem)] leading-none font-extrabold tracking-[-0.06em] text-[#ff9a4a]">{hour.time}</p>
                  <h2 className="m-0 mt-2 font-[family-name:var(--font-serif)] text-4xl">{hour.title}</h2>
                  <p className="m-0 mt-2 max-w-lg text-lg text-[#f6efe6]/75">{hour.detail}</p>
                </div>
              </article>
            </Rise>
          ))}
        </div>
      </section>

      <section className="grid items-center gap-10 px-5 py-16 sm:px-10 lg:grid-cols-2">
        <Rise live={live}>
          <div className="overflow-hidden rounded-[2.5rem]">
            <img src="/photos/dress.jpg" alt="Supper in the boathouse" className="ki-pan aspect-[4/5] w-full object-cover" />
          </div>
        </Rise>
        <Rise live={live}>
          <h2 className="m-0 font-[family-name:var(--font-script)] text-[clamp(3rem,6vw,4.5rem)] leading-none">Stay through Sunday.</h2>
          <p className="m-0 mt-5 max-w-md text-lg leading-relaxed text-[#f6efe6]/80">{day.dress}</p>
          <ul className="m-0 mt-8 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="mt-4 border-t border-[#ff9a4a]/30 pt-4">
                <p className="m-0 font-[family-name:var(--font-serif)] text-2xl text-[#ffd7b0]">{stay.name}</p>
                <p className="m-0 mt-1 text-[#f6efe6]/75">{stay.detail}</p>
              </li>
            ))}
          </ul>
        </Rise>
      </section>

      <section className="relative min-h-[70vh] overflow-hidden">
        <img src="/photos/kiss.jpg" alt="The kiss" className="ki-pan absolute inset-0 size-full object-cover object-[center_40%]" />
        <div className="absolute inset-0 bg-[#140e0b]/55" />
        <div className="relative flex min-h-[70vh] items-end px-5 py-16 sm:px-10">
          <p className="m-0 max-w-xl font-[family-name:var(--font-serif)] text-[clamp(2.2rem,5vw,3.6rem)] leading-snug italic">We will be on the dock when the lanterns come on.</p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-10">
        <div className="mx-auto max-w-lg rounded-[2rem] bg-[#f6efe6] px-6 py-10 text-[#2a1812]">
          <h2 className="m-0 font-[family-name:var(--font-script)] text-5xl leading-none text-[#c4511a]">Come to the fire.</h2>
          <Reply />
        </div>
      </section>
    </div>
  );
}

function Rise({ live, children, className = "" }: { live: boolean; children: ReactNode; className?: string }) {
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
  return <div ref={ref} className={`ki-rise ${on ? "is-in" : ""} ${className}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-serif)] text-3xl italic">The fire is saved for you, {sent}.</p>;
  return (
    <form className="mt-8 grid gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#2a1812]/20 bg-white px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#2a1812]/20 bg-[#f6efe6] px-3 text-base">
          <option>Friday</option><option>Saturday</option><option>Already at the lake</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note for supper<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#2a1812]/20 bg-white px-3 py-2 text-base" /></label>
      <button type="submit" className="mt-1 min-h-12 cursor-pointer border-0 bg-[#c4511a] px-5 text-base text-[#f6efe6]">Save me a place by the fire</button>
    </form>
  );
}
