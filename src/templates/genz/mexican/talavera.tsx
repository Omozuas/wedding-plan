"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { talaveraDay as day } from "./talavera-day";

const COLORS = ["#143a8c", "#f0a202", "#f7f1e8", "#d23b6a"];
const FACES = [
  { kind: "color" as const, value: "#143a8c" },
  { kind: "photo" as const, value: "/photos/bouquet.jpg" },
  { kind: "color" as const, value: "#f0a202" },
  { kind: "photo" as const, value: "/photos/rings.jpg" },
  { kind: "color" as const, value: "#d23b6a" },
  { kind: "photo" as const, value: "/photos/kiss.jpg" },
  { kind: "color" as const, value: "#f7f1e8" },
  { kind: "photo" as const, value: "/photos/walk.jpg" },
  { kind: "color" as const, value: "#143a8c" },
  { kind: "color" as const, value: "#f0a202" },
  { kind: "photo" as const, value: "/photos/dress.jpg" },
  { kind: "color" as const, value: "#d23b6a" },
];

const TILES = FACES.map((face, index) => {
  const col = index % 3;
  const row = Math.floor(index / 3);
  const from = [
    ["-40vw", "-20vh"],
    ["0px", "-30vh"],
    ["40vw", "-16vh"],
    ["-36vw", "0px"],
    ["20vw", "24vh"],
    ["36vw", "8vh"],
    ["-20vw", "30vh"],
    ["0px", "36vh"],
    ["28vw", "28vh"],
    ["-32vw", "10vh"],
    ["18vw", "-24vh"],
    ["30vw", "20vh"],
  ][index] ?? ["0px", "20vh"];
  return { ...face, col, row, dx: from[0], dy: from[1], rot: `${(index % 2 === 0 ? -1 : 1) * (8 + (index % 4))}deg`, delay: `${0.35 + index * 0.32}s`, flip: `${11.4 + index * 0.12}s` };
});

export function Talavera() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-hidden bg-[#f7f1e8] text-[#1c140f]">
      <style>{`
        .tl-sky { opacity: 1; transition: opacity 1s ease; }
        .tl-sky.is-leaving { opacity: 0; }
        .tl-tile { opacity: 0; animation: tl-lock 0.95s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .tl-flip { height: 100%; transform-style: preserve-3d; animation: tl-flip 1s ease both; }
        .tl-face { position: absolute; inset: 0; backface-visibility: hidden; }
        .tl-back { transform: rotateY(180deg); }
        .tl-band { height: 0; overflow: hidden; animation: tl-band 0.9s ease 7.8s forwards; }
        .tl-name { opacity: 0; animation: tl-name 0.8s ease both; }
        .tl-rise { opacity: 0; transform: translateY(20px); }
        .tl-rise.is-in { animation: tl-name 0.85s ease forwards; }
        .tl-frame { background: repeating-linear-gradient(90deg, #143a8c 0 14px, #f0a202 14px 22px, #f7f1e8 22px 28px, #d23b6a 28px 34px); }
        @keyframes tl-lock { from { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(0.45); } to { opacity: 1; transform: none; } }
        @keyframes tl-flip { to { transform: rotateY(180deg); } }
        @keyframes tl-band { to { height: 34vh; } }
        @keyframes tl-name { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .tl-tile, .tl-flip, .tl-band, .tl-name, .tl-rise { animation: none; }
          .tl-tile, .tl-name, .tl-rise { opacity: 1; transform: none; }
          .tl-band { height: auto; }
          .tl-flip { transform: none; }
        }
      `}</style>
      {!open && <Mosaic onDone={() => setOpen(true)} />}
      <Courtyard live={open} />
    </div>
  );
}

function Mosaic({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 18800);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 20000);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`tl-sky fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#f7f1e8] ${leaving ? "is-leaving" : ""}`} aria-label="Tiles gather into the day, then turn toward the celebration">
      <div className="relative w-[min(92vw,34rem)]">
        <div className="grid grid-cols-3 gap-1" style={{ perspective: "1000px" }}>
          {TILES.map((tile, index) => (
            <div key={index} className="tl-tile relative aspect-square" style={{ animationDelay: tile.delay, ["--dx" as string]: tile.dx, ["--dy" as string]: tile.dy, ["--rot" as string]: tile.rot }}>
              <div className="tl-flip relative size-full" style={{ animationDelay: tile.flip }}>
                <div className="tl-face" style={{ backgroundImage: "url(/photos/couple.jpg)", backgroundSize: "300% 400%", backgroundPosition: `${tile.col * 50}% ${tile.row * 33.333}%` }} />
                {tile.kind === "photo" ? (
                  <img src={tile.value} alt="" className="tl-face tl-back size-full object-cover" />
                ) : (
                  <div className="tl-face tl-back" style={{ background: tile.value }} />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="tl-band absolute inset-x-0 top-1/2 z-[2] flex -translate-y-1/2 flex-col items-center justify-center bg-[#f7f1e8] text-center">
          <p className="tl-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.2rem,8vw,4.2rem)] leading-none font-extrabold tracking-[-0.05em] text-[#143a8c]" style={{ animationDelay: "8.6s" }}>{day.first}</p>
          <p className="tl-name m-0 font-[family-name:var(--font-script)] text-4xl text-[#d23b6a]" style={{ animationDelay: "9.4s" }}>and</p>
          <p className="tl-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.2rem,8vw,4.2rem)] leading-none font-extrabold tracking-[-0.05em] text-[#143a8c]" style={{ animationDelay: "10.2s" }}>{day.second}</p>
          <p className="tl-name m-0 mt-2 text-sm tracking-[0.16em] text-[#1c140f] uppercase" style={{ animationDelay: "15.8s" }}>{day.time} · {day.shortDate}</p>
          <p className="tl-name m-0 text-sm text-[#143a8c]" style={{ animationDelay: "16.8s" }}>{day.venue}</p>
        </div>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[3] cursor-pointer border border-[#143a8c]/30 bg-[#f7f1e8]/90 px-4 py-2 text-[0.68rem] tracking-[0.22em] text-[#143a8c] uppercase">Skip</button>
    </section>
  );
}

function Courtyard({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="px-4 py-12">
        <div className="tl-frame p-3">
          <div className="bg-[#f7f1e8] px-5 py-10 text-center">
            <p className="m-0 text-[0.68rem] tracking-[0.32em] text-[#143a8c] uppercase">{day.place}</p>
            <h1 className="m-0 mt-3 font-[family-name:var(--font-display)] text-[clamp(3rem,10vw,6rem)] leading-[0.86] font-extrabold tracking-[-0.06em] text-[#143a8c]">
              {day.first}
              <span className="block font-[family-name:var(--font-script)] text-[clamp(2.2rem,6vw,3.6rem)] font-normal text-[#d23b6a]">and</span>
              {day.second}
            </h1>
            <p className="m-0 mt-4 text-sm tracking-[0.16em] uppercase">{day.dateLabel} · {day.time}</p>
            <p className="m-0 mt-1">{day.venue}</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 pb-12 text-center">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(1.8rem,4vw,2.8rem)] leading-snug">{day.arrival}</p>
          <p className="m-0 mt-4 text-lg">{day.bride} and {day.groom}. {day.address}.</p>
        </Rise>
      </section>
      <section className="grid grid-cols-2 gap-2 px-4 md:grid-cols-4">
        {["/photos/walk.jpg", "/photos/bouquet.jpg", "/photos/rings.jpg", "/photos/kiss.jpg"].map((src) => (
          <img key={src} src={src} alt="" className="aspect-square w-full object-cover" />
        ))}
      </section>
      <section className="mx-auto grid max-w-5xl gap-6 px-6 py-16 md:grid-cols-2">
        {day.dock.map((line, index) => (
          <Rise key={line} live={live}>
            <article className="border-8 border-[#143a8c] bg-white p-5" style={{ borderColor: COLORS[index] }}>
              <p className="m-0 font-[family-name:var(--font-display)] text-5xl leading-none font-extrabold text-[#143a8c]">0{index + 1}</p>
              <p className="m-0 mt-3 font-[family-name:var(--font-serif)] text-2xl leading-snug">{line}</p>
            </article>
          </Rise>
        ))}
      </section>
      <section className="bg-[#143a8c] px-6 py-16 text-[#f7f1e8]">
        <p className="m-0 text-center text-xs tracking-[0.28em] text-[#f0a202] uppercase">The pattern of the day</p>
        <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
          {day.hours.map((hour, index) => (
            <Rise key={hour.time} live={live}>
              <article className="bg-[#f7f1e8] p-5 text-[#1c140f]" style={{ boxShadow: `8px 8px 0 ${index % 2 ? "#f0a202" : "#d23b6a"}` }}>
                <p className="m-0 font-[family-name:var(--font-display)] text-4xl font-extrabold text-[#143a8c]">{hour.time}</p>
                <h2 className="m-0 mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold">{hour.title}</h2>
                <p className="m-0 mt-2">{hour.detail}</p>
              </article>
            </Rise>
          ))}
        </div>
      </section>
      <section className="grid items-center gap-8 px-6 py-16 md:grid-cols-2">
        <Rise live={live}>
          <div className="tl-frame p-2">
            <img src="/photos/dress.jpg" alt="The table set for supper" className="aspect-[4/5] w-full object-cover" />
          </div>
        </Rise>
        <Rise live={live}>
          <p className="m-0 text-xs tracking-[0.24em] text-[#143a8c] uppercase">What to wear</p>
          <p className="m-0 mt-3 font-[family-name:var(--font-serif)] text-3xl leading-snug">{day.dress}</p>
          <ul className="m-0 mt-6 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-t border-[#143a8c]/20 py-3">
                <p className="m-0 font-[family-name:var(--font-display)] text-xl font-extrabold">{stay.name}</p>
                <p className="m-0 mt-1">{stay.detail}</p>
              </li>
            ))}
          </ul>
        </Rise>
      </section>
      <section className="px-6 pb-20">
        <Rise live={live}>
          <div className="mx-auto max-w-lg border-8 border-[#f0a202] bg-white p-6">
            <p className="m-0 font-[family-name:var(--font-display)] text-4xl leading-none font-extrabold tracking-[-0.04em] text-[#143a8c]">Keep a place in the pattern</p>
            <Reply />
          </div>
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
  return <div ref={ref} className={`tl-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-6 font-[family-name:var(--font-serif)] text-2xl">You are in the pattern, {sent}.</p>;
  return (
    <form className="mt-6 grid gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#143a8c]/30 px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#143a8c]/30 bg-[#f0a202]/30 px-3 text-base">
          <option>Friday</option><option>Saturday</option><option>Sunday breakfast</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#143a8c]/30 px-3 py-2 text-base" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[#143a8c] px-5 text-base text-[#f7f1e8]">Count me in the pattern</button>
    </form>
  );
}
