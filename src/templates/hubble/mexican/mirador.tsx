"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { miradorDay as day } from "./mirador-day";

const SHOTS = [
  { src: "/photos/bouquet.jpg", focus: "center" },
  { src: "/photos/walk.jpg", focus: "center 40%" },
  { src: "/photos/couple.jpg", focus: "center 30%" },
];

const PANELS = [
  { src: "/photos/walk.jpg", focus: "center 40%", line: day.dock[0], side: "left" },
  { src: "/photos/bouquet.jpg", focus: "center", line: day.dock[1], side: "right" },
  { src: "/photos/kiss.jpg", focus: "center 40%", line: day.dock[2], side: "left" },
  { src: "/photos/dress.jpg", focus: "center", line: day.dock[3], side: "right" },
];

function coverFade(progress: number, start: number, end: number) {
  if (end <= start) return progress >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}

export function Mirador() {
  return (
    <div className="overflow-x-clip bg-[#f3e7d8] text-[#2a1210]">
      <style>{`
        .mi-rise { opacity: 0; transform: translateY(28px); }
        .mi-rise.is-in { animation: mi-rise 1.1s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .mi-vine { animation: mi-vine 7s ease-in-out infinite alternate; }
        @keyframes mi-rise { to { opacity: 1; transform: none; } }
        @keyframes mi-vine { from { transform: scaleX(0.92); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) {
          .mi-rise, .mi-vine { animation: none; }
          .mi-rise { opacity: 1; transform: none; }
        }
      `}</style>
      <Climb />
      <Terrace />
    </div>
  );
}

function Climb() {
  const rootRef = useRef<HTMLElement>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduce) return;
    const update = () => {
      const total = root.offsetHeight - window.innerHeight;
      const p = total <= 0 ? 1 : Math.min(1, Math.max(0, -root.getBoundingClientRect().top / total));
      const open = coverFade(p, 0.02, 0.9);
      const insetY = 40 - open * 20;
      const insetX = 34 - open * 20;
      const frame = root.querySelector<HTMLElement>("[data-frame]");
      const shots = root.querySelectorAll<HTMLElement>("[data-shot]");
      const label = root.querySelector<HTMLElement>("[data-label]");
      const names = root.querySelector<HTMLElement>("[data-names]");
      const vine = root.querySelector<HTMLElement>("[data-vine]");
      const cue = root.querySelector<HTMLElement>("[data-cue]");
      if (frame) {
        frame.style.top = `${insetY}%`;
        frame.style.right = `${insetX}%`;
        frame.style.bottom = `${insetY + 4}%`;
        frame.style.left = `${insetX}%`;
      }
      const levels = [
        1 - coverFade(p, 0.3, 0.4),
        coverFade(p, 0.3, 0.42) * (1 - coverFade(p, 0.58, 0.68)),
        coverFade(p, 0.58, 0.72),
      ];
      shots.forEach((shot, index) => {
        shot.style.opacity = String(levels[index] ?? 0);
        shot.style.transform = `scale(${1.08 - open * 0.06}) translate3d(0, ${(0.5 - p) * 4}%, 0)`;
      });
      if (label) {
        const floor = p < 0.34 ? 0 : p < 0.62 ? 1 : 2;
        label.textContent = day.floors[floor] ?? day.floors[0];
        label.style.opacity = String(coverFade(p, 0.05, 0.14));
      }
      if (vine) vine.style.transform = `scaleX(${0.15 + open * 0.85})`;
      if (names) {
        const shown = coverFade(p, 0.7, 0.86);
        names.style.opacity = String(shown);
        names.style.transform = `translate3d(0, ${(1 - shown) * 24}px, 0)`;
      }
      if (cue) cue.style.opacity = String(1 - coverFade(p, 0.02, 0.16));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      document.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reduce]);

  if (reduce) {
    return (
      <section className="grid min-h-[70vh] place-items-center bg-[#6b2b22] px-6 text-center text-[#f3e7d8]">
        <div>
          <p className="m-0 text-xs tracking-[0.38em] text-[#e7b15a] uppercase">Mirador</p>
          <h1 className="m-0 mt-4 font-[family-name:var(--font-serif)] text-6xl leading-none">{day.first}</h1>
          <h1 className="m-0 font-[family-name:var(--font-serif)] text-6xl leading-none text-[#e7b15a]">{day.second}</h1>
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="relative h-[540vh] bg-[#6b2b22] text-[#f3e7d8]" aria-label="Scroll to climb from the courtyard to the view">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div data-frame className="absolute overflow-hidden bg-[#1a0c0a]" style={{ top: "40%", right: "34%", bottom: "44%", left: "34%" }}>
          {SHOTS.map((shot, index) => (
            <img key={shot.src} data-shot src={shot.src} alt="" className="absolute inset-0 size-full object-cover" style={{ objectPosition: shot.focus, opacity: index === 0 ? 1 : 0 }} />
          ))}
          <div data-vine className="mi-vine absolute inset-x-0 top-0 h-2 origin-left bg-[#c4375a]" style={{ transform: "scaleX(0.15)" }} />
        </div>
        <p data-label className="absolute inset-x-0 top-[10vh] m-0 text-center font-[family-name:var(--font-serif)] text-[clamp(1.6rem,4vw,2.8rem)] italic opacity-0">{day.floors[0]}</p>
        <div data-names className="pointer-events-none absolute inset-x-0 bottom-[8vh] text-center opacity-0">
          <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(3rem,9vw,6rem)] leading-[0.86]">{day.first}</p>
          <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(3rem,9vw,6rem)] leading-[0.86] text-[#e7b15a]">{day.second}</p>
          <p className="m-0 mt-3 text-sm tracking-[0.22em] uppercase">{day.shortDate} · {day.time}</p>
        </div>
        <p data-cue className="absolute inset-x-0 bottom-6 m-0 text-center text-[0.68rem] tracking-[0.32em] uppercase">Climb</p>
        <a href="#mirador-letter" className="absolute top-5 right-5 z-[2] border border-[#f3e7d8]/40 px-4 py-2 text-[0.68rem] tracking-[0.22em] text-[#f3e7d8] uppercase no-underline">Skip</a>
      </div>
    </section>
  );
}

function Terrace() {
  return (
    <div id="mirador-letter">
      <section className="grid gap-8 px-6 py-20 md:grid-cols-[minmax(0,16rem)_1fr] md:px-12">
        <p className="m-0 text-xs tracking-[0.36em] text-[#c4375a] uppercase md:pt-3">{day.dateLabel}</p>
        <Rise>
          <h1 className="m-0 font-[family-name:var(--font-serif)] text-[clamp(3.2rem,8vw,6.2rem)] leading-[0.86] font-medium">
            {day.first}
            <span className="block text-[#c4375a]">{day.second}</span>
          </h1>
          <p className="m-0 mt-6 max-w-xl font-[family-name:var(--font-serif)] text-[clamp(1.6rem,3vw,2.4rem)] leading-snug">{day.arrival}</p>
          <p className="m-0 mt-4 max-w-lg text-lg leading-relaxed">{day.bride} and {day.groom}. {day.venue}. {day.place}. {day.address}. {day.time}.</p>
        </Rise>
      </section>
      {PANELS.map((panel) => (
        <section key={panel.line} className="grid min-h-[78vh] md:grid-cols-2">
          <img src={panel.src} alt="" className={`h-[48vh] w-full object-cover md:h-auto ${panel.side === "right" ? "md:order-2" : ""}`} style={{ objectPosition: panel.focus }} />
          <div className={`flex items-end px-6 py-12 md:px-12 ${panel.side === "right" ? "bg-[#2a1210] text-[#f3e7d8]" : "bg-[#f3e7d8]"}`}>
            <Rise>
              <span className="mb-4 block h-1 w-16 bg-[#c4375a]" />
              <p className="m-0 max-w-md font-[family-name:var(--font-serif)] text-[clamp(1.8rem,4vw,3rem)] leading-snug">{panel.line}</p>
            </Rise>
          </div>
        </section>
      ))}
      <section className="bg-[#6b2b22] px-6 py-20 text-[#f3e7d8] md:px-12">
        <p className="m-0 text-xs tracking-[0.34em] text-[#e7b15a] uppercase">From the terrace</p>
        <ol className="m-0 mt-10 list-none border-l border-[#e7b15a]/50 p-0">
          {day.hours.map((hour) => (
            <li key={hour.time} className="py-6 pl-6">
              <Rise>
                <p className="m-0 font-[family-name:var(--font-serif)] text-4xl text-[#e7b15a]">{hour.time}</p>
                <h2 className="m-0 mt-1 font-[family-name:var(--font-serif)] text-3xl font-medium">{hour.title}</h2>
                <p className="m-0 mt-2 max-w-md text-lg text-[#f3e7d8]/80">{hour.detail}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>
      <section className="grid items-center gap-10 px-6 py-20 md:grid-cols-2 md:px-12">
        <Rise>
          <img src="/photos/couple.jpg" alt="Claire and Thomas" className="aspect-[4/5] w-full object-cover shadow-[-16px_16px_0_#c4375a]" />
        </Rise>
        <Rise>
          <p className="m-0 text-xs tracking-[0.28em] text-[#c4375a] uppercase">What to wear</p>
          <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-3xl leading-snug">{day.dress}</p>
          <ul className="m-0 mt-8 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-t border-[#2a1210]/15 py-4">
                <p className="m-0 font-[family-name:var(--font-serif)] text-2xl">{stay.name}</p>
                <p className="m-0 mt-1">{stay.detail}</p>
              </li>
            ))}
          </ul>
          <Reply />
        </Rise>
      </section>
    </div>
  );
}

function Rise({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) setOn(true); }, { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`mi-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-serif)] text-3xl">We will see you from the terrace, {sent}.</p>;
  return (
    <form className="mt-8 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#2a1210]/20 bg-white/70 px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#2a1210]/20 bg-[#f3e7d8] px-3 text-base">
          <option>Friday</option><option>Saturday</option><option>The morning after</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#2a1210]/20 bg-white/70 px-3 py-2 text-base" /></label>
      <button type="submit" className="mt-1 min-h-12 cursor-pointer border-0 bg-[#6b2b22] px-5 text-base text-[#f3e7d8]">I will be on the terrace</button>
    </form>
  );
}
