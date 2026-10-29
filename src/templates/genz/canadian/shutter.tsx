"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { shutterDay as day } from "./shutter-day";

const CUTS = [
  { src: "/photos/walk.jpg", motion: "sh-from-left" },
  { src: "/photos/bouquet.jpg", motion: "sh-from-top" },
  { src: "/photos/rings.jpg", motion: "sh-from-right" },
  { src: "/photos/kiss.jpg", motion: "sh-from-bottom" },
];
const CUT_STEP = 1.45;

export function Shutter() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-hidden bg-[#101114] text-[#f6f3ee]">
      <style>{`
        .sh-sky { opacity: 1; transition: opacity 0.9s ease; }
        .sh-sky.is-leaving { opacity: 0; }
        .sh-cut { animation: sh-left 1.55s cubic-bezier(0.7, 0, 0.2, 1) both; }
        .sh-from-top { animation-name: sh-top; }
        .sh-from-right { animation-name: sh-right; }
        .sh-from-bottom { animation-name: sh-bottom; }
        .sh-hold { opacity: 0; animation: sh-hold 0.85s cubic-bezier(0.7, 0, 0.2, 1) 5.7s both; }
        .sh-leak { opacity: 0; animation: sh-leak 0.55s ease both; }
        .sh-bar { transform: scaleX(0); transform-origin: left center; animation: sh-bar 0.5s cubic-bezier(0.7, 0, 0.2, 1) both; }
        .sh-count { opacity: 0; animation: sh-count 1.35s ease both; }
        .sh-flash { opacity: 0; animation: sh-flash 0.18s linear 5.7s both; }
        .sh-blade { transform: translateY(var(--away)); animation: sh-blade 1.15s cubic-bezier(0.7, 0, 0.2, 1) 6.55s both; }
        .sh-name { opacity: 0; animation: sh-name 0.7s cubic-bezier(0.16, 0.84, 0.3, 1) 7.15s both; }
        .sh-rise { opacity: 0; transform: translateY(22px); }
        .sh-rise.is-in { animation: sh-name 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .sh-in { animation: sh-pop 1.15s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .sh-pan { animation: sh-pan 18s ease-in-out infinite alternate; }
        @keyframes sh-left {
          0% { clip-path: inset(0 100% 0 0); transform: scale(1.16) translate3d(6%, 0, 0); filter: blur(5px); }
          18% { clip-path: inset(0 0 0 0); transform: scale(1.06) translate3d(0, 0, 0); filter: blur(0); }
          74% { clip-path: inset(0 0 0 0); transform: scale(1) translate3d(-3%, -1%, 0); filter: blur(0); }
          100% { clip-path: inset(0 0 0 100%); transform: scale(1.1) translate3d(-10%, 0, 0); filter: blur(3px); }
        }
        @keyframes sh-right {
          0% { clip-path: inset(0 0 0 100%); transform: scale(1.16) translate3d(-6%, 0, 0); filter: blur(5px); }
          18% { clip-path: inset(0 0 0 0); transform: scale(1.06) translate3d(0, 0, 0); filter: blur(0); }
          74% { clip-path: inset(0 0 0 0); transform: scale(1) translate3d(3%, 1%, 0); filter: blur(0); }
          100% { clip-path: inset(0 100% 0 0); transform: scale(1.1) translate3d(10%, 0, 0); filter: blur(3px); }
        }
        @keyframes sh-top {
          0% { clip-path: inset(100% 0 0 0); transform: scale(1.14) translate3d(0, 5%, 0); filter: blur(5px); }
          18% { clip-path: inset(0 0 0 0); transform: scale(1.05) translate3d(0, 0, 0); filter: blur(0); }
          74% { clip-path: inset(0 0 0 0); transform: scale(1) translate3d(1%, -3%, 0); filter: blur(0); }
          100% { clip-path: inset(0 0 100% 0); transform: scale(1.1) translate3d(0, -8%, 0); filter: blur(3px); }
        }
        @keyframes sh-bottom {
          0% { clip-path: inset(0 0 100% 0); transform: scale(1.14) translate3d(0, -5%, 0); filter: blur(5px); }
          18% { clip-path: inset(0 0 0 0); transform: scale(1.05) translate3d(0, 0, 0); filter: blur(0); }
          74% { clip-path: inset(0 0 0 0); transform: scale(1) translate3d(-1%, 3%, 0); filter: blur(0); }
          100% { clip-path: inset(100% 0 0 0); transform: scale(1.1) translate3d(0, 8%, 0); filter: blur(3px); }
        }
        @keyframes sh-hold { 0% { opacity: 0; clip-path: inset(46% 0 46% 0); transform: scale(1.18); } 28% { opacity: 1; clip-path: inset(0); transform: scale(1.05); } 100% { opacity: 1; clip-path: inset(0); transform: scale(1); } }
        @keyframes sh-leak { 0% { opacity: 0; transform: translateX(-130%) skewX(-16deg); } 30% { opacity: 0.85; } 100% { opacity: 0; transform: translateX(130%) skewX(-16deg); } }
        @keyframes sh-bar { 0% { transform: scaleX(0); opacity: 1; } 55% { transform: scaleX(1); opacity: 1; } 100% { transform: scaleX(1); opacity: 0; } }
        @keyframes sh-count { 0% { opacity: 0; transform: translateY(10px) scale(1.35); } 16% { opacity: 1; transform: none; } 72% { opacity: 1; } 100% { opacity: 0; transform: translateY(-8px); } }
        @keyframes sh-flash { 0%, 100% { opacity: 0; } 40% { opacity: 0.8; } }
        @keyframes sh-blade { 0% { transform: translateY(var(--away)); } 42% { transform: translateY(0); } 100% { transform: translateY(var(--away)); } }
        @keyframes sh-name { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @keyframes sh-pop { from { transform: scale(1.08); } to { transform: scale(1); } }
        @keyframes sh-pan { from { transform: scale(1.08); } to { transform: scale(1.16) translate3d(-2%, -1%, 0); } }
        @media (prefers-reduced-motion: reduce) {
          .sh-cut, .sh-flash, .sh-blade, .sh-leak, .sh-bar, .sh-count { animation: none; opacity: 0; }
          .sh-hold, .sh-name, .sh-rise { animation: none; opacity: 1; transform: none; }
          .sh-in, .sh-pan { animation: none; transform: none; }
        }
      `}</style>
      {!open && <Cuts onDone={() => setOpen(true)} />}
      <Frame live={open} />
    </div>
  );
}

function Cuts({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 8800);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 9800);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`sh-sky fixed inset-0 z-50 overflow-hidden bg-black text-white ${leaving ? "is-leaving" : ""}`} aria-label="The shutter opens on the dock">
      {CUTS.map((cut, index) => (
        <img key={cut.src} src={cut.src} alt="" className={`sh-cut ${cut.motion} absolute inset-0 size-full object-cover object-[center_34%]`} style={{ animationDelay: `${index * CUT_STEP}s`, zIndex: index + 1 }} />
      ))}
      <img src="/photos/couple.jpg" alt="" className="sh-hold absolute inset-0 z-[5] size-full object-cover object-[center_30%]" />
      {CUTS.map((cut, index) => (
        <span key={cut.src} className="sh-leak pointer-events-none absolute inset-y-0 left-0 z-[6] w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent" style={{ animationDelay: `${index * CUT_STEP + 0.08}s` }} />
      ))}
      {CUTS.map((cut, index) => (
        <span key={`${cut.src}-bar`} className="sh-bar pointer-events-none absolute inset-x-0 top-0 z-[6] h-[3px] bg-[#ff2f86]" style={{ animationDelay: `${index * CUT_STEP}s` }} />
      ))}
      {CUTS.map((cut, index) => (
        <p key={`${cut.src}-count`} className="sh-count absolute top-6 left-6 z-[6] m-0 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-[0.18em] text-[#ff2f86]" style={{ animationDelay: `${index * CUT_STEP + 0.12}s` }}>0{index + 1}</p>
      ))}
      <span className="sh-flash pointer-events-none absolute inset-0 z-[6] bg-white" />
      <span className="sh-blade absolute inset-x-0 top-0 z-[7] h-1/2 bg-black" style={{ ["--away" as string]: "-100%" }} />
      <span className="sh-blade absolute inset-x-0 bottom-0 z-[7] h-1/2 bg-black" style={{ ["--away" as string]: "100%" }} />
      <div className="sh-name absolute inset-x-0 bottom-0 z-[8] px-6 pb-16">
        <p className="m-0 text-[0.68rem] tracking-[0.4em] text-[#ff2f86] uppercase">Shutter · Cedar Point</p>
        <p className="m-0 mt-2 max-w-full font-[family-name:var(--font-display)] text-[clamp(2.7rem,11vw,7rem)] leading-[0.82] font-extrabold tracking-[-0.06em]">{day.first}</p>
        <p className="m-0 max-w-full font-[family-name:var(--font-display)] text-[clamp(2.7rem,11vw,7rem)] leading-[0.82] font-extrabold tracking-[-0.06em]">{day.second}</p>
        <p className="m-0 mt-3 text-lg">{day.time} · {day.shortDate}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 220); }} className="absolute top-5 right-5 z-[9] cursor-pointer border border-white/40 bg-black/50 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">
        Skip
      </button>
    </section>
  );
}

const FRAMES = [
  { src: "/photos/walk.jpg", alt: "The walk to the water", no: "02" },
  { src: "/photos/bouquet.jpg", alt: "The bouquet", no: "03" },
  { src: "/photos/kiss.jpg", alt: "The kiss", no: "04" },
  { src: "/photos/rings.jpg", alt: "The rings", no: "05" },
];

function Frame({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="px-3 pt-5 pb-2 sm:px-6">
        <div className="flex items-center justify-between gap-4 text-[0.68rem] tracking-[0.28em] text-[#ff2f86] uppercase">
          <span>Proof 03 · Cedar Point</span>
          <span>{day.shortDate}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:h-[calc(100dvh-8rem)] sm:grid-cols-4 sm:grid-rows-2 sm:gap-3">
          <figure className="relative col-span-2 overflow-hidden sm:row-span-2">
            <img src="/photos/couple.jpg" alt="Claire and Thomas at the lake" className="sh-in aspect-[4/5] w-full object-cover object-[center_30%] sm:absolute sm:inset-0 sm:aspect-auto sm:size-full" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-black/75 px-4 py-4">
              <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#ff2f86] uppercase">01 · {day.time}</p>
              <h1 className="m-0 mt-1 max-w-full font-[family-name:var(--font-display)] text-[clamp(1.7rem,4.2vw,3.2rem)] leading-[0.88] font-extrabold tracking-[-0.05em]">
                {day.bride}
                <span className="block">{day.groom}</span>
              </h1>
            </figcaption>
          </figure>
          {FRAMES.map((frame) => (
            <figure key={frame.no} className="relative overflow-hidden sm:h-full">
              <img src={frame.src} alt={frame.alt} className="sh-in aspect-[4/5] w-full object-cover object-[center_32%] sm:absolute sm:inset-0 sm:aspect-auto sm:size-full" />
              <figcaption className="absolute top-2 left-2 bg-black/80 px-2 py-1 text-[0.65rem] tracking-[0.18em] text-[#ff2f86]">{frame.no}</figcaption>
            </figure>
          ))}
        </div>
        <p className="m-0 mt-3 text-sm text-[#f6f3ee]/70">{day.dateLabel}. {day.venue}, {day.place}. {day.address}.</p>
      </section>

      <section className="px-4 py-12 sm:px-8">
        <Rise live={live}>
          <p className="m-0 max-w-[16ch] font-[family-name:var(--font-display)] text-[clamp(2.3rem,6vw,4.6rem)] leading-[0.9] font-extrabold tracking-[-0.05em]">{day.arrival}</p>
        </Rise>
      </section>

      <section className="px-3 sm:px-6">
        <div className="relative overflow-hidden">
          <img src="/photos/kiss.jpg" alt="The kiss" className="sh-pan aspect-[16/9] w-full object-cover object-[center_42%] sm:aspect-[21/9]" />
          <p className="absolute bottom-3 left-3 m-0 bg-[#ff2f86] px-3 py-1 text-[0.68rem] font-extrabold tracking-[0.22em] text-white uppercase">{day.place}</p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {day.dock.map((line, index) => (
            <Rise key={line} live={live}>
              <p className="m-0 text-lg leading-snug">
                <span className="mr-2 font-[family-name:var(--font-display)] text-[#ff2f86]">0{index + 1}</span>
                {line}
              </p>
            </Rise>
          ))}
        </div>
      </section>

      <section className="grid items-start gap-8 px-4 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <p className="m-0 text-[0.68rem] tracking-[0.32em] text-[#ff2f86] uppercase">The evening</p>
          <div className="mt-4 divide-y divide-white/15 border-y border-white/15">
            {day.hours.map((hour) => (
              <Rise key={hour.time} live={live}>
                <article className="grid gap-1 py-5 sm:grid-cols-[6rem_9rem_minmax(0,1fr)] sm:items-baseline sm:gap-4">
                  <p className="m-0 font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#ff2f86]">{hour.time}</p>
                  <h2 className="m-0 text-2xl font-extrabold tracking-[-0.04em]">{hour.title}</h2>
                  <p className="m-0 text-[#f6f3ee]/70">{hour.detail}</p>
                </article>
              </Rise>
            ))}
          </div>
        </div>
        <Rise live={live}>
          <div className="pr-3 pb-3">
            <div className="relative">
              <img src="/photos/dress.jpg" alt="Supper in the boathouse" className="relative z-[1] aspect-[4/5] w-full object-cover" />
              <span className="absolute top-3 left-3 size-full border-2 border-[#ff2f86]" />
            </div>
          </div>
        </Rise>
      </section>

      <section className="border-t border-white/15 px-4 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <Rise live={live}>
            <h2 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,3.6rem)] leading-none font-extrabold tracking-[-0.05em]">Stay through Sunday.</h2>
            <p className="m-0 mt-4 max-w-md text-lg text-[#f6f3ee]/75">{day.dress}</p>
            <ul className="m-0 mt-6 list-none p-0">
              {day.stays.map((stay, index) => (
                <li key={stay.name} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-t border-white/15 py-4">
                  <span className="font-[family-name:var(--font-display)] text-[#ff2f86]">0{index + 1}</span>
                  <span>
                    <span className="block font-extrabold">{stay.name}</span>
                    <span className="mt-1 block text-[#f6f3ee]/70">{stay.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Rise>
          <Rise live={live}><Reply /></Rise>
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
  return <div ref={ref} className={`sh-rise ${on ? "is-in" : ""} ${className}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 font-[family-name:var(--font-display)] text-4xl leading-none font-extrabold tracking-[-0.05em]">You are in the picture, {sent}.</p>;
  return (
    <form className="grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm font-semibold">Your name<input name="name" required placeholder="Your name" className="min-h-12 border-0 bg-white px-3 text-base font-normal text-[#111]" /></label>
      <label className="grid gap-1 text-sm font-semibold">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border-0 bg-white px-3 text-base font-normal text-[#111]">
          <option>Friday</option><option>Saturday</option><option>Already at the lake</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm font-semibold">A note for supper<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border-0 bg-white px-3 py-2 text-base font-normal text-[#111]" /></label>
      <button type="submit" className="mt-1 min-h-12 cursor-pointer border-0 bg-[#ff2f86] px-5 text-base font-semibold text-white">I am in the frame</button>
    </form>
  );
}
