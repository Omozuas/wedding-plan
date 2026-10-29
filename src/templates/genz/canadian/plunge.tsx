"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { plungeDay as day } from "./plunge-day";

const PRINTS = [
  { src: "/photos/walk.jpg", focus: "center 40%" },
  { src: "/photos/bouquet.jpg", focus: "center" },
  { src: "/photos/rings.jpg", focus: "center" },
  { src: "/photos/couple.jpg", focus: "center 36%" },
];
const PRINT_START = 10.4;
const PRINT_STEP = 2.6;

export function Plunge() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-hidden bg-[#090909] text-[#f6f6f1]">
      <style>{`
        .pl-sky { opacity: 1; transition: opacity 1.2s ease; }
        .pl-sky.is-leaving { opacity: 0; }
        .pl-kicker { opacity: 0; animation: pl-line 1.3s ease 0.6s forwards; }
        .pl-stamp { opacity: 0; animation: pl-stamp 1.35s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .pl-rule { transform: scaleX(0); transform-origin: center; animation: pl-rule 1.7s ease 8.6s forwards; }
        .pl-grow { box-shadow: 0 0 0 8px #fff; animation: pl-grow 2.85s linear both; }
        .pl-grow-stay { animation-name: pl-grow-stay; }
        .pl-line { opacity: 0; animation: pl-line 1s ease both; }
        .pl-rise { opacity: 0; transform: translateY(28px); }
        .pl-rise.is-in { animation: pl-title 1s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .pl-print { transform: rotate(-8deg) scale(1.05); }
        .pl-rise.is-in .pl-print { animation: pl-print 1.15s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .pl-stack { transform: translateY(22px) scale(0.98); }
        .pl-rise.is-in .pl-stack { animation: pl-stack 1s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        @keyframes pl-stamp {
          0% { opacity: 0; transform: translateY(-18%) scale(1.06); }
          62% { opacity: 1; transform: translateY(2%) scale(0.985); }
          100% { opacity: 1; transform: none; }
        }
        @keyframes pl-rule { to { transform: scaleX(1); } }
        @keyframes pl-grow {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.18); }
          10% { opacity: 1; transform: translate(-50%, -50%) scale(0.2); }
          32% { opacity: 1; transform: translate(-50%, -50%) scale(0.2); }
          68% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          86% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.04); }
        }
        @keyframes pl-grow-stay {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.18); }
          10% { opacity: 1; transform: translate(-50%, -50%) scale(0.2); }
          32% { opacity: 1; transform: translate(-50%, -50%) scale(0.2); }
          70% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes pl-line { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes pl-title { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        @keyframes pl-print { to { transform: rotate(-3deg) scale(1); } }
        @keyframes pl-stack { to { transform: none; } }
        @media (max-width: 700px) {
          .pl-print, .pl-rise.is-in .pl-print { animation: none; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pl-kicker, .pl-stamp, .pl-rule, .pl-grow, .pl-line, .pl-title, .pl-rise, .pl-print, .pl-stack { animation: none; }
          .pl-kicker, .pl-stamp, .pl-line, .pl-title, .pl-rise { opacity: 1; transform: none; }
          .pl-rule { transform: none; }
          .pl-grow { opacity: 0; }
          .pl-grow-stay { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          .pl-print { transform: rotate(-3deg); }
        }
      `}</style>
      {!open && <Fall onDone={() => setOpen(true)} />}
      <Dock live={open} />
    </div>
  );
}

function Fall({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 24200);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 25600);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`pl-sky fixed inset-0 z-50 overflow-hidden bg-black text-white ${leaving ? "is-leaving" : ""}`} aria-label="Prints of the day open one by one">
      <div className="flex min-h-full flex-col items-center justify-center px-5 pt-16 pb-8 text-center">
        <p className="pl-kicker m-0 max-w-[16rem] text-[0.72rem] tracking-[0.22em] text-[#e8ff47] uppercase">For the pleasure of your company</p>
        <p className="pl-stamp m-0 mt-4 font-[family-name:var(--font-display)] text-[clamp(2.6rem,11vw,6.8rem)] leading-[0.84] font-extrabold tracking-[-0.06em]" style={{ animationDelay: "2.8s" }}>{day.first}</p>
        <p className="pl-stamp m-0 font-[family-name:var(--font-display)] text-[clamp(2.6rem,11vw,6.8rem)] leading-[0.84] font-extrabold tracking-[-0.06em] text-[#e8ff47]" style={{ animationDelay: "6.4s" }}>{day.second}</p>
        <div className="pl-rule mt-4 h-[3px] w-16 bg-[#e8ff47]" />
        <div className="relative mt-8 h-[min(46vh,26rem)] w-[min(88vw,42rem)]">
          {PRINTS.map((print, index) => (
            <img
              key={print.src}
              src={print.src}
              alt=""
              className={`pl-grow absolute top-1/2 left-1/2 h-full w-full object-cover ${index === PRINTS.length - 1 ? "pl-grow-stay" : ""}`}
              style={{ animationDelay: `${PRINT_START + index * PRINT_STEP}s`, objectPosition: print.focus, zIndex: index + 1 }}
            />
          ))}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] bg-gradient-to-t from-black/70 to-transparent px-4 pt-10 pb-3 text-white">
            <p className="pl-line m-0 text-sm" style={{ animationDelay: "20.2s" }}>{day.dateLabel}</p>
            <p className="pl-line m-0 text-sm font-semibold" style={{ animationDelay: "21.2s" }}>{day.time}</p>
            <p className="pl-line m-0 text-sm" style={{ animationDelay: "22.2s" }}>Cedar Point · Lake Rosseau</p>
          </div>
        </div>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[3] cursor-pointer border border-white/30 bg-black/40 px-4 py-2 text-[0.68rem] tracking-[0.22em] text-white uppercase">
        Skip
      </button>
    </section>
  );
}

const HOUR_PHOTOS = ["/photos/kiss.jpg", "/photos/dress.jpg", "/photos/walk.jpg", "/photos/bouquet.jpg"];

function Dock({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="px-4 pt-8 pb-6 sm:px-8">
        <p className="m-0 text-[0.72rem] font-extrabold tracking-[0.38em] text-[#e8ff47] uppercase">Plunge · Lake Rosseau</p>
        <div className="mt-5 grid items-end gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,22rem)]">
          <div className="min-w-0">
            <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.35rem,10vw,8.4rem)] leading-[0.78] font-extrabold tracking-[-0.06em] uppercase">
              <span className="block bg-[#e8ff47] px-3 py-1 text-[#090909]">{day.first}</span>
              <span className="mt-2 block border-[6px] border-[#e8ff47] px-3 py-1 text-[#e8ff47]">{day.second}</span>
            </h1>
            <p className="m-0 mt-5 max-w-md text-lg leading-snug text-white/80">{day.bride} and {day.groom}. {day.dateLabel}. {day.time}.</p>
            <p className="m-0 mt-2 text-white/60">{day.venue}. {day.address}.</p>
          </div>
          <Rise live={live}>
            <div className="pl-print overflow-hidden border-[10px] border-white bg-white shadow-[8px_10px_0_#e8ff47]">
              <img src="/photos/couple.jpg" alt="Claire and Thomas at the lake" className="aspect-[3/4] w-full object-cover object-[center_38%]" />
            </div>
          </Rise>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-8">
        <Rise live={live}>
          <p className="m-0 max-w-[14ch] font-[family-name:var(--font-display)] text-[clamp(2.2rem,6vw,4.4rem)] leading-[0.9] font-extrabold tracking-[-0.05em]">{day.arrival}</p>
        </Rise>
        <div className="mt-8">
          <Rise live={live}>
            <img src="/photos/walk.jpg" alt="Claire and Thomas walking to the water" className="pl-stack aspect-[16/10] w-[92%] border-[8px] border-white object-cover object-[center_40%]" />
          </Rise>
          <Rise live={live} className="-mt-16 flex justify-end sm:-mt-36">
            <img src="/photos/bouquet.jpg" alt="The bouquet" className="pl-stack aspect-[4/5] w-[48%] border-[8px] border-[#e8ff47] object-cover object-center" />
          </Rise>
          <Rise live={live} className="-mt-20 sm:-mt-44">
            <img src="/photos/rings.jpg" alt="The rings" className="pl-stack aspect-square w-[40%] border-[8px] border-white object-cover" />
          </Rise>
        </div>
        <ul className="m-0 mt-10 list-none p-0">
          {day.dock.map((line, index) => (
            <Rise key={line} live={live}>
              <li className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-3 border-t border-white/15 py-4">
                <span className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-[#e8ff47]">0{index + 1}</span>
                <span className="text-xl leading-snug">{line}</span>
              </li>
            </Rise>
          ))}
        </ul>
      </section>

      <section>
        <p className="m-0 px-4 py-8 text-[0.72rem] font-extrabold tracking-[0.38em] text-[#e8ff47] uppercase sm:px-8">The evening</p>
        {day.hours.map((hour, index) => (
          <Rise key={hour.time} live={live}>
            <article className="relative min-h-[18rem] overflow-hidden">
              <img src={HOUR_PHOTOS[index]} alt="" className="absolute inset-0 size-full object-cover object-[center_40%]" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
              <div className="relative flex min-h-[18rem] max-w-3xl flex-col justify-end px-4 py-8 sm:px-8">
                <p className="m-0 font-[family-name:var(--font-display)] text-6xl leading-none font-extrabold text-[#e8ff47]">{hour.time}</p>
                <h2 className="m-0 mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-[-0.04em]">{hour.title}</h2>
                <p className="m-0 mt-2 max-w-lg text-lg text-white/85">{hour.detail}</p>
              </div>
            </article>
          </Rise>
        ))}
      </section>

      <section className="grid gap-8 bg-[#e8ff47] px-4 py-14 text-[#090909] sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Rise live={live}>
          <h2 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.9] font-extrabold tracking-[-0.05em] uppercase">Stay through Sunday.</h2>
          <p className="m-0 mt-4 max-w-md text-lg">{day.dress}</p>
          <ul className="m-0 mt-6 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="mt-3 border-2 border-dashed border-[#090909] bg-[#090909] px-4 py-4 text-[#f6f6f1]">
                <p className="m-0 font-extrabold tracking-[-0.03em]">{stay.name}</p>
                <p className="m-0 mt-1 text-white/80">{stay.detail}</p>
              </li>
            ))}
          </ul>
        </Rise>
        <Rise live={live}><Reply /></Rise>
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
  return <div ref={ref} className={`pl-rise ${on ? "is-in" : ""} ${className}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-[-0.04em]">The dock is expecting you, {sent}.</p>;
  return (
    <form className="mt-8 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm font-semibold">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-black/20 bg-white/70 px-3 text-base font-normal" /></label>
      <label className="grid gap-1 text-sm font-semibold">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-black/20 bg-[#e8ff47] px-3 text-base font-normal">
          <option>Friday</option><option>Saturday</option><option>Already at the lake</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm font-semibold">A note for supper<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-black/20 bg-white/70 px-3 py-2 text-base font-normal" /></label>
      <button type="submit" className="mt-1 min-h-12 cursor-pointer border-0 bg-[#090909] px-5 text-base text-[#e8ff47]">Count me there</button>
    </form>
  );
}
