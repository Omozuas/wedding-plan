"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { rippleDay as day } from "./ripple-day";

const LINES = ["Lake Rosseau", "Claire", "Thomas", "Four o'clock"];

export function Ripple() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-hidden bg-[#f3fffb] text-[#06282e]">
      <style>{`
        .rp-sky { opacity: 1; transition: opacity 1.1s ease; }
        .rp-sky.is-leaving { opacity: 0; }
        .rp-photo { clip-path: circle(0% at 50% 58%); animation: rp-open 8.2s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .rp-ring {
          position: absolute; left: 50%; top: 54%; width: 42vmin; height: 42vmin;
          border: 1.5px solid rgba(140, 255, 232, 0.75); border-radius: 999px;
          animation: rp-ring 2.6s ease-out both;
        }
        .rp-line { opacity: 0; animation: rp-line 2.1s ease both; }
        .rp-line-last { animation-name: rp-stay; animation-duration: 1.4s; }
        .rp-rise { opacity: 0; transform: translateY(26px); }
        .rp-rise.is-in { animation: rp-stay 1s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .rp-breathe { animation: rp-breathe 16s ease-in-out infinite alternate; }
        .rp-float { animation: rp-float 7.5s ease-in-out infinite alternate; }
        @keyframes rp-open {
          0% { clip-path: circle(0% at 50% 58%); }
          22% { clip-path: circle(16% at 50% 56%); }
          46% { clip-path: circle(34% at 50% 52%); }
          70% { clip-path: circle(58% at 50% 50%); }
          100% { clip-path: circle(130% at 50% 48%); }
        }
        @keyframes rp-ring { from { transform: translate(-50%, -50%) scale(0.15); opacity: 0.9; } to { transform: translate(-50%, -50%) scale(3.4); opacity: 0; } }
        @keyframes rp-line { 0% { opacity: 0; transform: translateY(14px); } 20% { opacity: 1; transform: none; } 72% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes rp-stay { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes rp-breathe { from { transform: scale(1); } to { transform: scale(1.08); } }
        @keyframes rp-float { from { transform: translateY(0); } to { transform: translateY(-14px); } }
        @media (prefers-reduced-motion: reduce) {
          .rp-photo { clip-path: none; animation: none; }
          .rp-ring, .rp-line, .rp-breathe, .rp-float { animation: none; }
          .rp-line, .rp-rise { opacity: 1; transform: none; }
        }
      `}</style>
      {!open && <Water onDone={() => setOpen(true)} />}
      <Shore live={open} />
    </div>
  );
}

function Water({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 8600);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 9800);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`rp-sky fixed inset-0 z-50 overflow-hidden bg-[#031016] ${leaving ? "is-leaving" : ""}`} aria-label="Ripples clear the lake">
      <img src="/photos/couple.jpg" alt="" className="rp-photo absolute inset-0 size-full object-cover object-[center_32%]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(3,16,22,0.55)_100%)]" />
      {[0, 1, 2, 3].map((index) => (
        <span key={index} className="rp-ring" style={{ animationDelay: `${0.15 + index * 1.7}s` }} />
      ))}
      <div className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center">
        {LINES.map((line, index) => (
          <p
            key={line}
            className={`rp-line absolute m-0 font-[family-name:var(--font-display)] leading-none font-extrabold tracking-[-0.06em] ${index === LINES.length - 1 ? "rp-line-last text-[clamp(2rem,7vw,4rem)]" : "text-[clamp(3rem,12vw,7rem)]"}`}
            style={{ animationDelay: `${0.35 + index * 1.7}s` }}
          >
            {line}
          </p>
        ))}
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[2] cursor-pointer border border-[#d7fff4]/40 bg-[#031016]/50 px-4 py-2 text-[0.68rem] tracking-[0.22em] text-[#e9fff8] uppercase">
        Skip
      </button>
    </section>
  );
}

const BUBBLES = [
  { src: "/photos/kiss.jpg", alt: "The kiss" },
  { src: "/photos/dress.jpg", alt: "Supper in the boathouse" },
  { src: "/photos/bouquet.jpg", alt: "The bouquet" },
  { src: "/photos/walk.jpg", alt: "The walk to the water" },
];

function Shore({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="bg-[radial-gradient(circle_at_center,#d9fff6_0%,#f3fffb_62%)] px-4 pt-14 pb-8 text-center">
        <p className="m-0 text-[0.72rem] tracking-[0.38em] text-[#0c8f86] uppercase">Ripple · Cedar Point</p>
        <h1 className="m-0 mt-4 font-[family-name:var(--font-serif)] text-[clamp(3.6rem,11vw,7.2rem)] leading-[0.92] font-medium tracking-[-0.03em] text-[#06282e]">
          {day.first}
          <span className="my-1 block font-[family-name:var(--font-script)] text-[0.38em] leading-none font-normal text-[#0c8f86]">and</span>
          {day.second}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-[#06282e]/75">{day.dateLabel}. {day.time} at {day.venue}, {day.place}.</p>
        <Rise live={live}>
          <div className="relative mx-auto mt-8 aspect-[3/4] w-full max-w-[40rem] sm:aspect-square sm:max-w-4xl">
            <div className="absolute top-[7%] left-[16%] size-[70%] overflow-hidden rounded-full bg-[#d7fff4] shadow-[0_24px_60px_rgba(6,40,46,0.16)] ring-[10px] ring-white">
              <img src="/photos/couple.jpg" alt="Claire and Thomas at the lake" className="rp-breathe size-full object-cover object-[center_24%]" />
            </div>
            <div className="rp-float absolute bottom-[1%] left-0 size-[34%] overflow-hidden rounded-full ring-[8px] ring-white">
              <img src="/photos/walk.jpg" alt="Claire and Thomas walking to the water" className="size-full object-cover object-[center_36%]" />
            </div>
            <div className="rp-float absolute top-0 right-[1%] size-[28%] overflow-hidden rounded-full ring-[8px] ring-white" style={{ animationDelay: "-2.4s" }}>
              <img src="/photos/bouquet.jpg" alt="" className="size-full object-cover object-center" />
            </div>
            <div className="rp-float absolute right-[8%] bottom-[6%] size-[23%] overflow-hidden rounded-full ring-[8px] ring-white" style={{ animationDelay: "-4.2s" }}>
              <img src="/photos/rings.jpg" alt="" className="size-full object-cover" />
            </div>
          </div>
        </Rise>
        <p className="m-0 mt-4 text-sm tracking-[0.16em] text-[#06282e]/60 uppercase">{day.address}</p>
      </section>

      <section className="mx-auto max-w-xl px-5 py-16 text-center">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(2rem,5vw,3.2rem)] leading-[1.15]">{day.arrival}</p>
        </Rise>
        <ul className="m-0 mt-8 list-none p-0">
          {day.dock.map((line) => (
            <Rise key={line} live={live}>
              <li className="mt-5 font-[family-name:var(--font-serif)] text-[clamp(1.35rem,3vw,1.85rem)] leading-snug text-[#06282e]/85">{line}</li>
            </Rise>
          ))}
        </ul>
      </section>

      <section className="px-4 pb-6 sm:px-8">
        <p className="m-0 text-center text-[0.72rem] tracking-[0.38em] text-[#0c8f86] uppercase">The evening</p>
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {day.hours.map((hour, index) => (
            <Rise key={hour.time} live={live}>
              <article className="text-center">
                <div className="mx-auto aspect-square w-full max-w-44 overflow-hidden rounded-full ring-[8px] ring-white">
                  <img src={BUBBLES[index].src} alt={BUBBLES[index].alt} className="size-full object-cover object-[center_40%]" />
                </div>
                <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-4xl leading-none">{hour.time}</p>
                <h2 className="m-0 mt-2 text-lg font-semibold">{hour.title}</h2>
                <p className="m-0 mt-2 text-sm leading-relaxed text-[#06282e]/70">{hour.detail}</p>
              </article>
            </Rise>
          ))}
        </div>
      </section>

      <section className="mx-4 my-10 overflow-hidden rounded-[2.2rem] bg-[#08343a] text-[#f3fffb] sm:mx-8">
        <div className="grid lg:grid-cols-2">
          <img src="/photos/dress.jpg" alt="The table in the boathouse" className="aspect-[4/3] w-full object-cover object-center lg:aspect-auto lg:min-h-full" />
          <div className="px-5 py-10 sm:px-10">
            <Rise live={live}>
              <h2 className="m-0 font-[family-name:var(--font-serif)] text-[clamp(2.4rem,5vw,3.6rem)] leading-none">Stay through Sunday.</h2>
              <p className="m-0 mt-4 max-w-md text-lg text-[#f3fffb]/80">{day.dress}</p>
              <ul className="m-0 mt-6 list-none p-0">
                {day.stays.map((stay) => (
                  <li key={stay.name} className="mt-4">
                    <p className="m-0 font-[family-name:var(--font-serif)] text-2xl text-[#9dffe8]">{stay.name}</p>
                    <p className="m-0 mt-1 text-[#f3fffb]/75">{stay.detail}</p>
                  </li>
                ))}
              </ul>
            </Rise>
            <Reply />
          </div>
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
  return <div ref={ref} className={`rp-rise ${on ? "is-in" : ""} ${className}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-serif)] text-4xl leading-none text-[#9dffe8]">The water will know you, {sent}.</p>;
  return (
    <form className="mt-8 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#9dffe8]/50 bg-transparent px-3 text-base text-[#f3fffb]" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#9dffe8]/50 bg-[#08343a] px-3 text-base text-[#f3fffb]">
          <option>Friday</option><option>Saturday</option><option>Already at the lake</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note for supper<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#9dffe8]/50 bg-transparent px-3 py-2 text-base text-[#f3fffb]" /></label>
      <button type="submit" className="mt-1 min-h-12 cursor-pointer border-0 bg-[#7dffe4] px-5 text-base font-semibold text-[#04141a]">Save a seat</button>
    </form>
  );
}
