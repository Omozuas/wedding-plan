"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { compasDay as day } from "./compas-day";

const STRIPS = Array.from({ length: 8 }, (_, index) => index);

const BEATS = [
  { src: "/photos/walk.jpg", focus: "center 40%", time: "01", line: day.dock[0], note: day.letter[0], ink: "#12080c", wash: "#f4efe6" },
  { src: "/photos/bouquet.jpg", focus: "center", time: "02", line: day.dock[1], note: day.letter[1], ink: "#f4efe6", wash: "#9b1d2e" },
  { src: "/photos/rings.jpg", focus: "center", time: "03", line: day.dock[2], note: day.letter[2], ink: "#12080c", wash: "#e3a008" },
  { src: "/photos/kiss.jpg", focus: "center 40%", time: "04", line: day.dock[3], note: day.letter[3], ink: "#f4efe6", wash: "#12080c" },
  { src: "/photos/dress.jpg", focus: "center", time: "05", line: day.hours[2].title, note: day.hours[2].detail, ink: "#12080c", wash: "#f4efe6" },
  { src: "/photos/couple.jpg", focus: "center 30%", time: "06", line: day.arrival, note: day.address, ink: "#f4efe6", wash: "#9b1d2e" },
];

export function Compas() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-clip bg-[#12080c] text-[#f4efe6]">
      <style>{`
        .co-sky { opacity: 1; transition: opacity 0.9s ease; }
        .co-sky.is-leaving { opacity: 0; }
        .co-strip { transform: scaleX(0); animation: co-open 1.2s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .co-lift-up { animation: co-up 1.45s cubic-bezier(0.7, 0, 0.2, 1) forwards; }
        .co-lift-down { animation: co-down 1.45s cubic-bezier(0.7, 0, 0.2, 1) forwards; }
        .co-arrive { opacity: 0; animation: co-arrive 2.6s ease 8.6s forwards; }
        .co-name { opacity: 0; animation: co-name 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .co-beat { opacity: 0; animation: co-beat 1.8s ease 15.2s both; }
        .co-rise { opacity: 0; transform: translateY(20px); }
        .co-rise.is-in { animation: co-name 0.85s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .co-marquee { animation: co-marquee 22s linear infinite; }
        @keyframes co-open { to { transform: scaleX(1); } }
        @keyframes co-up { to { transform: translateY(-110%); } }
        @keyframes co-down { to { transform: translateY(110%); } }
        @keyframes co-arrive { from { opacity: 0; transform: scale(1.06); } to { opacity: 1; transform: none; } }
        @keyframes co-name { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @keyframes co-beat { 0% { opacity: 0; transform: scale(0.92); } 20% { opacity: 1; transform: scale(1.06); } 40% { opacity: 1; transform: scale(1); } 62% { transform: scale(1.04); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes co-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .co-strip, .co-lift-up, .co-lift-down { display: none; }
          .co-arrive, .co-name, .co-beat, .co-rise, .co-marquee { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
      {!open && <Beat onDone={() => setOpen(true)} />}
      <Score live={open} />
    </div>
  );
}

function Beat({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 18400);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 19600);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`co-sky fixed inset-0 z-50 overflow-hidden bg-[#12080c] text-[#f4efe6] ${leaving ? "is-leaving" : ""}`} aria-label="The picture assembles on the beat, then the couple arrives">
      <img src="/photos/walk.jpg" alt="" className="absolute inset-0 size-full object-cover object-[center_40%]" />
      <img src="/photos/couple.jpg" alt="" className="co-arrive absolute inset-0 size-full object-cover object-[center_30%]" />
      <div className="absolute inset-0 z-[1] flex">
        {STRIPS.map((index) => (
          <div key={index} className={`h-full flex-1 overflow-hidden ${index % 2 ? "co-lift-down" : "co-lift-up"}`} style={{ animationDelay: `${6 + index * 0.08}s` }}>
            <div
              className="co-strip h-full w-full bg-cover"
              style={{
                animationDelay: `${0.25 + index * 0.16}s`,
                backgroundImage: "url(/photos/couple.jpg)",
                backgroundSize: "800% 100%",
                backgroundPosition: `${(index / 7) * 100}% center`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-[8vh] z-[3] px-6 text-center">
        <p className="co-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.8rem,10vw,6rem)] leading-none font-extrabold tracking-[-0.06em]" style={{ animationDelay: "11.4s" }}>{day.first}</p>
        <p className="co-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.8rem,10vw,6rem)] leading-none font-extrabold tracking-[-0.06em] text-[#e3a008]" style={{ animationDelay: "12.8s" }}>{day.second}</p>
        <p className="co-beat m-0 mt-4 font-[family-name:var(--font-display)] text-[clamp(1.2rem,3vw,2rem)] font-extrabold tracking-[-0.04em]">{day.time}</p>
        <p className="co-name m-0 mt-2 text-sm tracking-[0.16em] uppercase" style={{ animationDelay: "16.4s" }}>{day.dateLabel} · {day.place}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[4] cursor-pointer border border-white/40 bg-black/45 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Score({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="relative min-h-dvh">
        <img src="/photos/couple.jpg" alt="Claire and Thomas at the lake" className="absolute inset-0 size-full object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-[#12080c]/40" />
        <div className="relative flex min-h-dvh flex-col justify-end px-6 pt-16 pb-20">
          <p className="m-0 text-[0.68rem] font-semibold tracking-[0.28em] text-[#e3a008] uppercase">{day.place}</p>
          <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(3rem,9vw,6rem)] leading-[0.84] font-extrabold tracking-[-0.06em]">{day.first}</h1>
          <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(3rem,9vw,6rem)] leading-[0.84] font-extrabold tracking-[-0.06em] text-[#e3a008]">{day.second}</h1>
          <p className="m-0 mt-3 text-sm font-semibold tracking-[0.14em] uppercase">{day.dateLabel} · {day.time}</p>
        </div>
      </section>
      <div className="overflow-hidden bg-[#9b1d2e] py-3">
        <p className="co-marquee m-0 w-max font-[family-name:var(--font-display)] text-sm font-extrabold tracking-[0.18em] uppercase">{`${day.venue} · ${day.time} · ${day.place} · `.repeat(6)}</p>
      </div>
      {BEATS.map((beat) => (
        <section key={beat.time} className="grid min-h-[82vh] md:grid-cols-2" style={{ background: beat.wash, color: beat.ink }}>
          <img src={beat.src} alt="" className="h-80 w-full object-cover md:h-auto" style={{ objectPosition: beat.focus }} />
          <div className="flex flex-col justify-end px-6 py-12 md:px-12">
            <Rise live={live}>
              <p className="m-0 font-[family-name:var(--font-display)] text-7xl leading-none font-extrabold tracking-[-0.06em]">{beat.time}</p>
              <p className="m-0 mt-4 max-w-md font-[family-name:var(--font-display)] text-[clamp(1.7rem,3vw,2.6rem)] leading-snug font-extrabold tracking-[-0.04em]">{beat.line}</p>
              <p className="m-0 mt-3 max-w-md text-lg leading-relaxed">{beat.note}</p>
            </Rise>
          </div>
        </section>
      ))}
      <section className="bg-[#e3a008] px-6 py-16 text-[#12080c] md:px-12">
        <p className="m-0 text-xs font-extrabold tracking-[0.24em] uppercase">The downbeats</p>
        <ol className="m-0 mt-8 grid list-none gap-6 p-0 md:grid-cols-2">
          {day.hours.map((hour) => (
            <li key={hour.time} className="border-t-4 border-[#12080c] pt-4">
              <Rise live={live}>
                <p className="m-0 font-[family-name:var(--font-display)] text-5xl font-extrabold tracking-[-0.05em]">{hour.time}</p>
                <h2 className="m-0 mt-1 font-[family-name:var(--font-display)] text-3xl font-extrabold">{hour.title}</h2>
                <p className="m-0 mt-2 max-w-md">{hour.detail}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>
      <section className="grid gap-8 bg-[#f4efe6] px-6 py-16 text-[#12080c] md:grid-cols-2 md:px-12">
        <Rise live={live}>
          <p className="m-0 text-xs font-extrabold tracking-[0.22em] text-[#9b1d2e] uppercase">What to wear</p>
          <p className="m-0 mt-3 font-[family-name:var(--font-display)] text-3xl leading-snug font-extrabold tracking-[-0.04em]">{day.dress}</p>
          <ul className="m-0 mt-6 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-t border-[#12080c]/15 py-3">
                <p className="m-0 font-[family-name:var(--font-display)] text-xl font-extrabold">{stay.name}</p>
                <p className="m-0 mt-1">{stay.detail}</p>
              </li>
            ))}
          </ul>
        </Rise>
        <Rise live={live}>
          <img src="/photos/rings.jpg" alt="The rings" className="aspect-square w-full object-cover" />
        </Rise>
      </section>
      <section className="bg-[#9b1d2e] px-6 py-16">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-display)] text-5xl leading-none font-extrabold tracking-[-0.05em]">Count me on the beat</p>
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
  return <div ref={ref} className={`co-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-[-0.04em]">You are on the beat, {sent}.</p>;
  return (
    <form className="mt-8 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border-0 bg-white px-3 text-base text-[#12080c]" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border-0 bg-[#e3a008] px-3 text-base text-[#12080c]">
          <option>Friday</option><option>Saturday</option><option>For the lights</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border-0 bg-white px-3 py-2 text-base text-[#12080c]" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[#12080c] px-5 text-base text-[#f4efe6]">I am in</button>
    </form>
  );
}
