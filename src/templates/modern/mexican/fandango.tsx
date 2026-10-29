"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { fandangoDay as day } from "./fandango-day";

const BANNERS = [
  { word: "Claire", photo: "/photos/bouquet.jpg", color: "#ffb000", ink: "#12080c", delay: "0.5s" },
  { word: "Thomas", photo: "/photos/walk.jpg", color: "#1239c7", ink: "#fff6ea", delay: "3.1s" },
  { word: "Four", photo: "/photos/kiss.jpg", color: "#e4236a", ink: "#fff6ea", delay: "5.7s" },
  { word: "o'clock", photo: "/photos/rings.jpg", color: "#fff6ea", ink: "#12080c", delay: "8.3s" },
];

const RIBBONS = ["#ffb000", "#1239c7", "#e4236a", "#fff6ea"];

const SLABS = [
  { photo: "/photos/couple.jpg", color: "#ffb000", ink: "#12080c", hour: day.hours[0] },
  { photo: "/photos/walk.jpg", color: "#1239c7", ink: "#fff6ea", hour: day.hours[1] },
  { photo: "/photos/dress.jpg", color: "#fff6ea", ink: "#12080c", hour: day.hours[2] },
  { photo: "/photos/kiss.jpg", color: "#e4236a", ink: "#fff6ea", hour: day.hours[3] },
];

export function Fandango() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-hidden bg-[#12080c] text-[#fff6ea]">
      <style>{`
        .fa-sky { opacity: 1; transition: opacity 0.9s ease; }
        .fa-sky.is-leaving { opacity: 0; }
        .fa-picado { clip-path: polygon(0 0, 100% 0, 100% 82%, 96% 100%, 92% 82%, 88% 100%, 84% 82%, 80% 100%, 76% 82%, 72% 100%, 68% 82%, 64% 100%, 60% 82%, 56% 100%, 52% 82%, 48% 100%, 44% 82%, 40% 100%, 36% 82%, 32% 100%, 28% 82%, 24% 100%, 20% 82%, 16% 100%, 12% 82%, 8% 100%, 4% 82%, 0 100%); }
        .fa-banner { transform: translateY(-120vh); animation: fa-drop 1.35s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .fa-word { opacity: 0; animation: fa-word 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .fa-gem { opacity: 0; clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); transform: translate(-50%, -50%) scale(0.35) rotate(18deg); animation: fa-gem 3.4s cubic-bezier(0.16, 0.84, 0.3, 1) 11s forwards; }
        .fa-line { opacity: 0; animation: fa-word 1s ease 14.6s both; }
        .fa-ribbon { position: absolute; top: 0; width: 12px; transform: scaleY(0); transform-origin: top center; animation-name: fa-ribbon, fa-sway; animation-duration: 1.5s, 2.4s; animation-timing-function: cubic-bezier(0.16, 0.84, 0.3, 1), ease-in-out; animation-fill-mode: both, none; animation-iteration-count: 1, infinite; }
        .fa-rise { opacity: 0; transform: translateY(22px); }
        .fa-rise.is-in { animation: fa-word 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .fa-marquee { animation: fa-marquee 22s linear infinite; }
        @keyframes fa-drop { to { transform: translateY(0); } }
        @keyframes fa-word { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @keyframes fa-gem { to { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); } }
        @keyframes fa-ribbon { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes fa-sway { from { transform: scaleY(1) rotate(-3deg); } to { transform: scaleY(1) rotate(3deg); } }
        @keyframes fa-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .fa-banner, .fa-word, .fa-gem, .fa-line, .fa-ribbon, .fa-rise, .fa-marquee { animation: none; }
          .fa-banner, .fa-word, .fa-line, .fa-rise { opacity: 1; transform: none; }
          .fa-gem { opacity: 1; transform: translate(-50%, -50%); }
          .fa-ribbon { transform: scaleY(1); }
        }
      `}</style>
      {!open && <Dance onDone={() => setOpen(true)} />}
      <Floor live={open} />
    </div>
  );
}

function Dance({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 17200);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 18400);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`fa-sky fixed inset-0 z-50 overflow-hidden bg-[#12080c] ${leaving ? "is-leaving" : ""}`} aria-label="Banners drop, then the evening opens">
      <div className="relative z-[1]">
        {BANNERS.map((banner) => (
          <div key={banner.word} className="fa-banner fa-picado relative h-[22vh] overflow-hidden" style={{ animationDelay: banner.delay, background: banner.color, color: banner.ink }}>
            <img src={banner.photo} alt="" className="absolute inset-0 size-full object-cover opacity-45" />
            <p className="fa-word relative m-0 grid h-[74%] place-items-center px-4 font-[family-name:var(--font-display)] text-[clamp(2.1rem,8vw,4.6rem)] leading-none font-extrabold tracking-[-0.05em]" style={{ animationDelay: `calc(${banner.delay} + 0.45s)` }}>{banner.word}</p>
          </div>
        ))}
      </div>
      <div className="fa-gem absolute top-1/2 left-1/2 z-[2] size-[min(46vw,18rem)] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
        <img src="/photos/couple.jpg" alt="" className="size-full object-cover object-[center_30%]" />
      </div>
      {RIBBONS.map((color, index) => (
        <span key={color + index} className="fa-ribbon z-[3]" style={{ left: `${5 + index * 9.2}%`, height: `${26 + (index % 4) * 10}vh`, background: color, animationDelay: `${13.4 + index * 0.07}s, ${15 + index * 0.07}s` }} />
      ))}
      {RIBBONS.map((color, index) => (
        <span key={color + "b" + index} className="fa-ribbon z-[3]" style={{ left: `${8 + index * 9.2}%`, height: `${18 + (index % 3) * 8}vh`, background: RIBBONS[(index + 2) % 4], animationDelay: `${13.7 + index * 0.07}s, ${15.3 + index * 0.07}s` }} />
      ))}
      <p className="fa-line absolute inset-x-0 bottom-8 z-[4] m-0 text-center font-[family-name:var(--font-display)] text-[clamp(1rem,3vw,1.5rem)] font-extrabold tracking-[-0.03em]">{day.dateLabel} · {day.place}</p>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-4 right-4 z-[5] cursor-pointer border border-white/40 bg-black/40 px-4 py-2 text-[0.68rem] tracking-[0.22em] text-white uppercase">Skip</button>
    </section>
  );
}

function Floor({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="relative min-h-dvh">
        <img src="/photos/couple.jpg" alt="Claire and Thomas at the lake" className="absolute inset-0 size-full object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-[#12080c]/35" />
        <div className="fa-picado absolute inset-x-0 top-1/2 -translate-y-1/2 bg-[#ffb000] px-6 pt-8 pb-16 text-center text-[#12080c]">
          <p className="m-0 text-[0.68rem] font-semibold tracking-[0.28em] uppercase">{day.place}</p>
          <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(3rem,12vw,7rem)] leading-[0.84] font-extrabold tracking-[-0.06em]">{day.first}</h1>
          <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(3rem,12vw,7rem)] leading-[0.84] font-extrabold tracking-[-0.06em] text-[#e4236a]">{day.second}</h1>
          <p className="m-0 mt-2 text-sm font-semibold tracking-[0.16em] uppercase">{day.dateLabel} · {day.time}</p>
        </div>
      </section>
      <div className="overflow-hidden bg-[#1239c7] py-3 text-[#fff6ea]">
        <p className="fa-marquee m-0 w-max font-[family-name:var(--font-display)] text-sm font-extrabold tracking-[0.18em] uppercase">{`${day.venue} · ${day.time} · dance · `.repeat(8)}</p>
      </div>
      <section className="px-6 py-16 text-center">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-[0.95] font-extrabold tracking-[-0.05em]">{day.arrival}</p>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">{day.bride} and {day.groom} marry at {day.venue}. {day.address}.</p>
        </Rise>
      </section>
      {day.dock.map((line, index) => (
        <section key={line} className="grid md:grid-cols-2">
          <img src={["/photos/walk.jpg", "/photos/bouquet.jpg", "/photos/rings.jpg", "/photos/dress.jpg"][index]} alt="" className={`h-72 w-full object-cover md:h-[70vh] ${index % 2 ? "md:order-2" : ""}`} />
          <div className="flex items-center px-6 py-12 md:px-12" style={{ background: index % 2 ? "#e4236a" : "#fff6ea", color: index % 2 ? "#fff6ea" : "#12080c" }}>
            <Rise live={live}>
              <p className="m-0 font-[family-name:var(--font-display)] text-6xl leading-none font-extrabold tracking-[-0.06em]">0{index + 1}</p>
              <p className="m-0 mt-4 max-w-md font-[family-name:var(--font-display)] text-[clamp(1.6rem,3vw,2.4rem)] leading-snug font-extrabold tracking-[-0.04em]">{line}</p>
            </Rise>
          </div>
        </section>
      ))}
      {SLABS.map((slab) => (
        <section key={slab.hour.time} className="grid min-h-[70vh] md:grid-cols-[1.1fr_0.9fr]" style={{ background: slab.color, color: slab.ink }}>
          <div className="flex flex-col justify-end px-6 py-12 md:px-12">
            <Rise live={live}>
              <p className="m-0 font-[family-name:var(--font-display)] text-[clamp(4rem,12vw,8rem)] leading-none font-extrabold tracking-[-0.07em]">{slab.hour.time}</p>
              <h2 className="m-0 mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-[-0.04em]">{slab.hour.title}</h2>
              <p className="m-0 mt-3 max-w-md text-lg">{slab.hour.detail}</p>
            </Rise>
          </div>
          <img src={slab.photo} alt="" className="h-72 w-full object-cover md:h-auto" />
        </section>
      ))}
      <section className="grid gap-8 bg-[#fff6ea] px-6 py-16 text-[#12080c] md:grid-cols-2 md:px-12">
        <Rise live={live}>
          <p className="m-0 text-xs font-semibold tracking-[0.24em] text-[#e4236a] uppercase">What to wear</p>
          <p className="m-0 mt-3 font-[family-name:var(--font-display)] text-3xl leading-snug font-extrabold tracking-[-0.04em]">{day.dress}</p>
        </Rise>
        <Rise live={live}>
          <ul className="m-0 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-t-4 border-[#ffb000] py-4">
                <p className="m-0 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-[-0.04em]">{stay.name}</p>
                <p className="m-0 mt-1">{stay.detail}</p>
              </li>
            ))}
          </ul>
        </Rise>
      </section>
      <section className="bg-[#1239c7] px-6 py-16">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-display)] text-5xl leading-none font-extrabold tracking-[-0.05em]">Save me a dance</p>
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
  return <div ref={ref} className={`fa-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-[-0.04em]">The floor is yours, {sent}.</p>;
  return (
    <form className="mt-8 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border-0 bg-white px-3 text-base text-[#12080c]" /></label>
      <label className="grid gap-1 text-sm">You are here for
        <select name="when" defaultValue="Both" className="min-h-12 border-0 bg-[#ffb000] px-3 text-base text-[#12080c]">
          <option>The vows</option><option>The dancing</option><option>Both</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border-0 bg-white px-3 py-2 text-base text-[#12080c]" /></label>
      <button type="submit" className="mt-1 min-h-12 cursor-pointer border-0 bg-[#e4236a] px-5 text-base text-white">I am coming to dance</button>
    </form>
  );
}
