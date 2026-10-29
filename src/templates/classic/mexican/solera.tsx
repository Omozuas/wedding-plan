"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { soleraDay as day } from "./solera-day";

const PETALS = Array.from({ length: 14 }, (_, index) => ({
  left: `${4 + ((index * 13) % 92)}%`,
  delay: `${(index % 7) * 0.8}s`,
  duration: `${9 + (index % 4)}s`,
  color: index % 3 === 0 ? "#e2a322" : index % 3 === 1 ? "#c45c26" : "#f0c14a",
  width: index % 2 === 0 ? 12 : 16,
}));

const PLATES = [
  { src: "/photos/rings.jpg", focus: "center", klass: "so-shot-a" },
  { src: "/photos/bouquet.jpg", focus: "center", klass: "so-shot-b" },
  { src: "/photos/couple.jpg", focus: "center 32%", klass: "so-shot-c" },
];

export function Solera() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-hidden bg-[#f3eadc] text-[#2c1812]">
      <style>{`
        .so-sky { opacity: 1; transition: opacity 1s ease; }
        .so-sky.is-leaving { opacity: 0; }
        .so-petal { position: absolute; top: -8%; border-radius: 50% 50% 50% 50% / 62% 62% 38% 38%; opacity: 0; animation: so-fall linear infinite; }
        .so-said { opacity: 0; animation: so-said 4.6s ease 0.4s both; }
        .so-plate { transform: rotateX(64deg) scale(0.86); animation: so-tip 3.2s cubic-bezier(0.16, 0.84, 0.3, 1) 10.4s forwards; }
        .so-draw { stroke-dasharray: 289; stroke-dashoffset: 289; animation: so-draw 4.4s ease 1.5s forwards; }
        .so-shot { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; }
        .so-shot-a { animation: so-hold 4.2s ease 3s both; }
        .so-shot-b { animation: so-hold 4.2s ease 6.8s both; }
        .so-shot-c { animation: so-stay 1.8s ease 10.6s both; }
        .so-card { opacity: 0; animation: so-card 1.05s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .so-rise { opacity: 0; transform: translateY(24px); }
        .so-rise.is-in { animation: so-card 1s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .so-drift { animation: so-drift 28s linear infinite; }
        @keyframes so-fall { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 12% { opacity: 0.85; } 100% { transform: translateY(110vh) rotate(180deg); opacity: 0; } }
        @keyframes so-said { 0% { opacity: 0; transform: translateY(12px); } 18% { opacity: 1; transform: none; } 72% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes so-tip { to { transform: rotateX(0deg) scale(1); } }
        @keyframes so-draw { to { stroke-dashoffset: 0; } }
        @keyframes so-hold { 0% { opacity: 0; transform: scale(1.08); } 16% { opacity: 1; transform: scale(1); } 74% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes so-stay { from { opacity: 0; transform: scale(1.06); } to { opacity: 1; transform: none; } }
        @keyframes so-card { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes so-drift { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .so-petal, .so-said, .so-shot-a, .so-shot-b { display: none; }
          .so-plate, .so-draw, .so-shot-c, .so-card, .so-rise, .so-drift { animation: none; }
          .so-plate, .so-shot-c, .so-card, .so-rise { opacity: 1; transform: none; }
          .so-draw { stroke-dashoffset: 0; }
        }
      `}</style>
      {!open && <Table onDone={() => setOpen(true)} />}
      <Menu live={open} />
    </div>
  );
}

function Table({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 19800);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 21000);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`so-sky fixed inset-0 z-50 overflow-hidden bg-[#f3eadc] text-[#2c1812] ${leaving ? "is-leaving" : ""}`} aria-label="A place is set, then the day turns toward you">
      {PETALS.map((petal, index) => (
        <span key={index} className="so-petal" style={{ left: petal.left, width: petal.width, height: petal.width * 1.6, background: petal.color, animationDelay: petal.delay, animationDuration: petal.duration }} />
      ))}
      <p className="so-said absolute inset-x-0 top-[8vh] m-0 text-center font-[family-name:var(--font-serif)] text-[clamp(1.6rem,4vw,2.8rem)] italic">Take your seat.</p>
      <div className="flex h-full flex-col items-center justify-center gap-8 px-6 md:flex-row md:gap-16">
        <div style={{ perspective: "900px" }}>
          <div className="so-plate relative size-[min(72vw,22rem)]">
            <svg className="pointer-events-none absolute inset-[-5%] size-[110%]" viewBox="0 0 100 100" aria-hidden="true">
              <circle className="so-draw" cx="50" cy="50" r="46" fill="none" stroke="#b8893d" strokeWidth="0.7" />
            </svg>
            <div className="absolute inset-[7%] overflow-hidden rounded-full bg-[#2c1812] shadow-[0_24px_50px_rgba(44,24,18,0.28)]">
              {PLATES.map((plate) => (
                <img key={plate.src} src={plate.src} alt="" className={`so-shot ${plate.klass}`} style={{ objectPosition: plate.focus }} />
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-sm text-center md:text-left">
          <p className="so-card m-0 font-[family-name:var(--font-serif)] text-[clamp(2rem,5vw,3.4rem)] leading-none" style={{ animationDelay: "13.4s" }}>{day.bride}</p>
          <p className="so-card m-0 mt-2 font-[family-name:var(--font-serif)] text-[clamp(2rem,5vw,3.4rem)] leading-none text-[#9c4220]" style={{ animationDelay: "15s" }}>{day.groom}</p>
          <p className="so-card m-0 mt-4 text-sm tracking-[0.18em] uppercase" style={{ animationDelay: "16.6s" }}>{day.dateLabel}</p>
          <p className="so-card m-0 mt-2 font-[family-name:var(--font-serif)] text-xl italic text-[#9c4220]" style={{ animationDelay: "18s" }}>{day.time} · Cedar Point</p>
        </div>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[3] cursor-pointer border border-[#9c4220]/40 bg-[#f3eadc]/80 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Menu({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="px-6 py-20 text-center">
        <p className="m-0 text-[0.68rem] tracking-[0.38em] text-[#9c4220] uppercase">{day.place}</p>
        <div className="mx-auto mt-8 size-[min(70vw,18rem)] overflow-hidden rounded-full border-[10px] border-[#f7f1e6] shadow-[0_0_0_1px_#b8893d,0_20px_40px_rgba(44,24,18,0.15)]">
          <img src="/photos/couple.jpg" alt="Claire and Thomas at the lake" className="size-full object-cover object-[center_30%]" />
        </div>
        <h1 className="m-0 mt-8 font-[family-name:var(--font-serif)] text-[clamp(3rem,8vw,5.5rem)] leading-[0.9] font-medium">
          {day.first}
          <span className="mt-1 block font-[family-name:var(--font-script)] text-[clamp(2rem,5vw,3.2rem)] text-[#9c4220]">and</span>
          {day.second}
        </h1>
        <p className="m-0 mt-4 text-sm tracking-[0.2em] uppercase">{day.dateLabel}</p>
        <p className="m-0 mt-2 font-[family-name:var(--font-serif)] text-2xl italic">{day.time}</p>
      </section>
      <section className="mx-auto max-w-3xl px-6 pb-16 text-center">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(1.8rem,4vw,3rem)] leading-snug italic">{day.arrival}</p>
          <p className="m-0 mt-5 text-lg leading-relaxed">{day.bride} and {day.groom} marry at {day.venue}. {day.place}. {day.address}.</p>
        </Rise>
      </section>
      <div className="overflow-hidden border-y border-[#9c4220]/25 py-3">
        <p className="so-drift m-0 w-max text-xs tracking-[0.32em] text-[#9c4220] uppercase">{`${day.venue} · ${day.time} · `.repeat(6)}</p>
      </div>
      <section className="mx-auto grid max-w-5xl gap-16 px-6 py-20 md:grid-cols-2">
        {day.dock.map((line, index) => (
          <Rise key={line} live={live}>
            <div className={index % 2 === 0 ? "" : "md:mt-16"}>
              <img src={["/photos/walk.jpg", "/photos/bouquet.jpg", "/photos/dress.jpg", "/photos/kiss.jpg"][index]} alt="" className="aspect-[4/5] w-full rounded-[10rem] object-cover" style={{ objectPosition: index === 3 ? "center 40%" : "center" }} />
              <p className="m-0 mt-5 font-[family-name:var(--font-serif)] text-2xl leading-snug italic">{line}</p>
            </div>
          </Rise>
        ))}
      </section>
      <section className="bg-[#9c4220] px-6 py-20 text-[#f7f1e6]">
        <div className="mx-auto max-w-xl">
          <p className="m-0 text-center text-[0.68rem] tracking-[0.34em] uppercase">The courses</p>
          <ol className="m-0 mt-10 list-none p-0">
            {day.hours.map((hour) => (
              <li key={hour.time} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-[#f7f1e6]/25 py-5">
                <Rise live={live}>
                  <p className="m-0 font-[family-name:var(--font-serif)] text-2xl">{hour.time}</p>
                </Rise>
                <Rise live={live}>
                  <p className="m-0 font-[family-name:var(--font-serif)] text-2xl">{hour.title}</p>
                  <p className="m-0 mt-1 text-[#f7f1e6]/80">{hour.detail}</p>
                </Rise>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-20 md:grid-cols-2">
        <Rise live={live}>
          <img src="/photos/rings.jpg" alt="The rings" className="aspect-square w-full rounded-full object-cover" />
        </Rise>
        <Rise live={live}>
          <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#9c4220] uppercase">What to wear</p>
          <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-3xl leading-snug">{day.dress}</p>
          <ul className="m-0 mt-8 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-t border-[#9c4220]/20 py-4">
                <p className="m-0 font-[family-name:var(--font-serif)] text-xl">{stay.name}</p>
                <p className="m-0 mt-1">{stay.detail}</p>
              </li>
            ))}
          </ul>
        </Rise>
      </section>
      <section className="px-6 pb-24 text-center">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-script)] text-5xl text-[#9c4220]">A seat is waiting</p>
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
  return <div ref={ref} className={`so-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-serif)] text-3xl italic">Your seat is held, {sent}.</p>;
  return (
    <form className="mx-auto mt-8 grid max-w-md gap-3 text-left" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#9c4220]/30 bg-white/70 px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#9c4220]/30 bg-[#f7f1e6] px-3 text-base">
          <option>Friday evening</option><option>Saturday</option><option>Already by the water</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note for supper<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#9c4220]/30 bg-white/70 px-3 py-2 text-base" /></label>
      <button type="submit" className="mt-1 min-h-12 cursor-pointer border-0 bg-[#9c4220] px-5 text-base text-[#f7f1e6]">Hold my seat</button>
    </form>
  );
}
