"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { jaleoDay as day } from "./jaleo-day";

const CARDS = [
  { src: "/photos/kiss.jpg", focus: "center 40%", tilt: "-5deg", delay: "0.5s", line: "A kiss, before you put it down.", lineDelay: "0.8s" },
  { src: "/photos/bouquet.jpg", focus: "center", tilt: "4deg", delay: "4.2s", line: "The flowers, still warm.", lineDelay: "4.4s" },
  { src: "/photos/rings.jpg", focus: "center", tilt: "-3deg", delay: "7.9s", line: "The rings, in the last light.", lineDelay: "8.1s" },
  { src: "/photos/dress.jpg", focus: "center", tilt: "3deg", delay: "11.6s", line: "The long table, waiting.", lineDelay: "11.8s" },
];

const PRINTS = [
  { src: "/photos/walk.jpg", focus: "center 40%", kicker: "01", line: day.dock[0], note: day.letter[0] },
  { src: "/photos/bouquet.jpg", focus: "center", kicker: "02", line: day.dock[1], note: day.letter[1] },
  { src: "/photos/rings.jpg", focus: "center", kicker: "03", line: day.dock[2], note: day.letter[2] },
  { src: "/photos/kiss.jpg", focus: "center 36%", kicker: "04", line: day.dock[3], note: day.letter[3] },
  { src: "/photos/dress.jpg", focus: "center", kicker: "05", line: day.hours[2].title, note: day.dress },
  { src: "/photos/couple.jpg", focus: "center 30%", kicker: "06", line: `${day.time}. ${day.venue}.`, note: day.address },
];

export function Jaleo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-clip bg-[#f7f1ea] text-[#1c1214]">
      <style>{`
        .ja-sky { opacity: 1; transition: opacity 1s ease; }
        .ja-sky.is-leaving { opacity: 0; }
        .ja-peel { transform: rotate(var(--tilt)); animation: ja-peel 2.9s cubic-bezier(0.45, 0, 0.2, 1) forwards; }
        .ja-line { opacity: 0; animation: ja-line 3.1s ease both; }
        .ja-name { opacity: 0; animation: ja-name 1s ease both; }
        .ja-rise { opacity: 0; transform: translateY(20px); }
        .ja-rise.is-in { animation: ja-name 0.85s ease forwards; }
        @keyframes ja-peel { 0%, 20% { transform: rotate(var(--tilt)) translateY(0); opacity: 1; } 100% { transform: rotate(calc(var(--tilt) - 10deg)) translateY(-82vh); opacity: 0; } }
        @keyframes ja-line { 0% { opacity: 0; transform: translateY(10px); } 16% { opacity: 1; transform: none; } 68% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes ja-name { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .ja-peel, .ja-line { display: none; }
          .ja-name, .ja-rise { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
      {!open && <Stack onDone={() => setOpen(true)} />}
      <Shout live={open} />
    </div>
  );
}

function Stack({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 20200);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 21400);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`ja-sky fixed inset-0 z-50 overflow-hidden bg-[#1a1014] text-[#f7f1ea] ${leaving ? "is-leaving" : ""}`} aria-label="Prints peel away until Claire and Thomas remain">
      <div className="absolute top-[7vh] left-1/2 h-[min(62vh,34rem)] w-[min(78vw,26rem)] -translate-x-1/2">
        <img src="/photos/couple.jpg" alt="" className="absolute inset-0 size-full border-[10px] border-[#f7f1ea] object-cover object-[center_30%] shadow-[0_24px_50px_rgba(0,0,0,0.45)]" />
        {CARDS.map((card, index) => (
          <img
            key={card.src}
            src={card.src}
            alt=""
            className="ja-peel absolute inset-0 size-full border-[10px] border-[#f7f1ea] object-cover shadow-[0_24px_50px_rgba(0,0,0,0.45)]"
            style={{ objectPosition: card.focus, zIndex: CARDS.length - index, animationDelay: card.delay, ["--tilt" as string]: card.tilt }}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-[#1a1014] to-transparent px-4 pt-16 pb-4">
          <p className="ja-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.2rem,7vw,3.6rem)] leading-none font-extrabold tracking-[-0.05em]" style={{ animationDelay: "15.2s" }}>{day.first}</p>
          <p className="ja-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.2rem,7vw,3.6rem)] leading-none font-extrabold tracking-[-0.05em] text-[#ffb25a]" style={{ animationDelay: "16.4s" }}>{day.second}</p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[6vh] px-6 text-center">
        {CARDS.map((card) => (
          <p key={card.line} className="ja-line absolute inset-x-6 m-0 font-[family-name:var(--font-serif)] text-[clamp(1.3rem,3vw,2rem)] italic" style={{ animationDelay: card.lineDelay }}>{card.line}</p>
        ))}
        <p className="ja-name m-0 font-[family-name:var(--font-serif)] text-2xl italic" style={{ animationDelay: "17.6s" }}>{day.time} · {day.shortDate}</p>
        <p className="ja-name m-0 mt-1 text-sm tracking-[0.14em] text-[#ffb25a] uppercase" style={{ animationDelay: "18.6s" }}>{day.venue}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[7] cursor-pointer border border-[#ffb25a]/40 bg-black/40 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Shout({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="bg-[#9b1b30] px-6 py-16 text-[#f7f1ea]">
        <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#ffb25a] uppercase">{day.place}</p>
        <h1 className="m-0 mt-3 font-[family-name:var(--font-display)] text-[clamp(3.2rem,11vw,6.8rem)] leading-[0.84] font-extrabold tracking-[-0.06em]">
          {day.first}
          <span className="block">{day.second}</span>
        </h1>
        <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-2xl italic">{day.dateLabel} · {day.time}</p>
        <p className="m-0 mt-1">{day.venue}</p>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-14">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] leading-snug font-extrabold tracking-[-0.04em]">{day.arrival}</p>
        </Rise>
        <div className="mt-8 grid gap-5">
          {day.letter.map((paragraph) => (
            <Rise key={paragraph} live={live}>
              <p className="m-0 text-lg leading-relaxed">{paragraph}</p>
            </Rise>
          ))}
        </div>
      </section>
      {PRINTS.map((print, index) => (
        <section key={print.kicker} className={index % 2 ? "flex min-h-[78vh] items-center bg-[#1c1214] text-[#f7f1ea]" : "flex min-h-[78vh] items-center"}>
          <div className="mx-auto grid max-w-6xl items-center gap-6 px-6 py-12 md:grid-cols-2">
            <Rise live={live}>
              <img src={print.src} alt="" className="aspect-[5/4] w-full object-cover shadow-[12px_12px_0_#9b1b30]" style={{ objectPosition: print.focus }} />
            </Rise>
            <Rise live={live}>
              <p className="m-0 font-[family-name:var(--font-display)] text-6xl leading-none font-extrabold text-[#9b1b30]">{print.kicker}</p>
              <p className="m-0 mt-3 font-[family-name:var(--font-display)] text-[clamp(1.6rem,3vw,2.4rem)] leading-snug font-extrabold tracking-[-0.04em]">{print.line}</p>
              <p className="m-0 mt-3 text-lg leading-relaxed opacity-80">{print.note}</p>
            </Rise>
          </div>
        </section>
      ))}
      <section className="bg-[#9b1b30] px-6 py-16 text-[#f7f1ea]">
        <p className="m-0 text-xs font-extrabold tracking-[0.24em] text-[#ffb25a] uppercase">The shouts of the day</p>
        <ol className="m-0 mt-8 grid list-none gap-6 p-0 md:grid-cols-2">
          {day.hours.map((hour) => (
            <li key={hour.time} className="bg-[#1c1214] p-5">
              <Rise live={live}>
                <p className="m-0 font-[family-name:var(--font-display)] text-5xl font-extrabold text-[#ffb25a]">{hour.time}</p>
                <h2 className="m-0 mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold">{hour.title}</h2>
                <p className="m-0 mt-2 text-[#f7f1ea]/80">{hour.detail}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Rise live={live}>
          <p className="m-0 text-xs font-extrabold tracking-[0.22em] text-[#9b1b30] uppercase">Where to stay</p>
          <ul className="m-0 mt-4 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-t border-[#1c1214]/15 py-4">
                <p className="m-0 font-[family-name:var(--font-display)] text-2xl font-extrabold">{stay.name}</p>
                <p className="m-0 mt-1">{stay.detail}</p>
              </li>
            ))}
          </ul>
          <p className="m-0 mt-10 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-[-0.04em]">Save me a shout</p>
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
  return <div ref={ref} className={`ja-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-display)] text-3xl font-extrabold">We saved you a shout, {sent}.</p>;
  return (
    <form className="mt-6 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#1c1214]/20 px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#1c1214]/20 bg-[#f7f1ea] px-3 text-base">
          <option>Friday</option><option>Saturday</option><option>For the lights</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#1c1214]/20 px-3 py-2 text-base" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[#9b1b30] px-5 text-base text-[#f7f1ea]">I am coming</button>
    </form>
  );
}
