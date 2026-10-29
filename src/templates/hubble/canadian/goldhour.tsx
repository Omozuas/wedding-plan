"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { goldhourDay as day } from "./goldhour-day";

function coverFade(progress: number, start: number, end: number) {
  if (end <= start) return progress >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}

function useShown() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.86 && rect.bottom > 32) setShown(true);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return { ref, shown };
}

function Rise({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { ref, shown } = useShown();
  return (
    <div ref={ref} className={`gh-rise ${shown ? "is-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

const lines = [
  "The road ends.",
  "The rest is water.",
  "Claire and Thomas",
  "Four o'clock on the dock",
];

export function Goldhour() {
  return (
    <div className="bg-[#f6ead8] text-[#1e3328]">
      <style>{`
        .gh-rise { opacity: 0; transform: translateY(32px); }
        .gh-rise.is-in { animation: gh-rise 1.15s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .gh-sun { animation: gh-sun 9s ease-in-out infinite; }
        .gh-marquee { animation: gh-marquee 32s linear infinite; }
        @keyframes gh-rise { to { opacity: 1; transform: translateY(0); } }
        @keyframes gh-sun { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        @keyframes gh-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .gh-rise, .gh-sun, .gh-marquee { animation: none; }
          .gh-rise { opacity: 1; transform: none; }
        }
      `}</style>
      <SunIntro />
      <Afternoon />
    </div>
  );
}

function SunIntro() {
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
      const photo = root.querySelector<HTMLElement>("[data-photo]");
      const sun = root.querySelector<HTMLElement>("[data-sun]");
      const veil = root.querySelector<HTMLElement>("[data-veil]");
      const cue = root.querySelector<HTMLElement>("[data-cue]");
      if (photo) {
        const bright = 0.28 + coverFade(p, 0.04, 0.78) * 0.82;
        photo.style.filter = `brightness(${bright}) saturate(${0.7 + coverFade(p, 0.2, 0.8) * 0.5})`;
        photo.style.transform = `scale(${1.12 - coverFade(p, 0, 0.9) * 0.08}) translate3d(0, ${coverFade(p, 0.4, 1) * -6}%, 0)`;
      }
      if (sun) {
        const rise = coverFade(p, 0.02, 0.82);
        sun.style.top = `${82 - rise * 52}%`;
        sun.style.left = `${34 + rise * 18}%`;
        sun.style.opacity = String(0.7 + rise * 0.3);
      }
      if (veil) veil.style.opacity = String(1 - coverFade(p, 0.08, 0.55));
      if (cue) cue.style.opacity = String(1 - coverFade(p, 0.05, 0.2));
      root.querySelectorAll<HTMLElement>("[data-line]").forEach((line) => {
        const start = Number(line.dataset.start);
        const end = Number(line.dataset.end);
        const shown = coverFade(p, start, start + 0.06) * (1 - coverFade(p, end, end + 0.07));
        line.style.opacity = String(line.dataset.last === "true" && p > end ? 1 : shown);
        line.style.transform = `translate3d(0, ${(1 - coverFade(p, start, end)) * 22}px, 0)`;
      });
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
      <section className="grid min-h-[70vh] place-items-end bg-[#c46a45] px-6 py-16 text-[#fff6ec]">
        <div>
          <p className="m-0 text-xs tracking-[0.38em] uppercase">Goldhour</p>
          <h1 className="m-0 mt-3 font-[family-name:var(--font-serif)] text-6xl leading-none italic">Claire & Thomas</h1>
          <p className="m-0 mt-3 text-xl">{day.time} · {day.venue}</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="relative h-[500vh] bg-[#1a120c]" aria-label="Scroll and the afternoon opens">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <img data-photo src="/photos/couple.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: "brightness(0.28)" }} />
        <div data-veil className="absolute inset-0 bg-[#1a120c]" />
        <div data-sun className="pointer-events-none absolute size-[170vmax] -translate-x-1/2 -translate-y-1/2" style={{ left: "34%", top: "82%" }}>
          <div className="gh-sun size-full bg-[radial-gradient(circle,#fff8e4_0%,rgba(231,161,90,0.4)_16%,rgba(196,106,69,0.08)_34%,transparent_52%)] mix-blend-screen" />
        </div>
        <div className="absolute inset-x-0 bottom-0 px-6 pb-24 text-[#fff6ec]">
          {lines.map((line, index) => (
            <p
              key={line}
              data-line
              data-start={0.16 + index * 0.18}
              data-end={0.3 + index * 0.18}
              data-last={index === lines.length - 1 ? "true" : "false"}
              className="absolute inset-x-6 bottom-24 m-0 font-[family-name:var(--font-serif)] text-[clamp(2rem,6vw,4.2rem)] leading-none italic [text-shadow:0_2px_28px_rgba(26,18,12,0.55)]"
              style={{ opacity: 0 }}
            >
              {line}
            </p>
          ))}
        </div>
        <p data-cue className="absolute inset-x-0 bottom-8 m-0 text-center text-[0.68rem] tracking-[0.32em] text-[#fff6ec] uppercase">Scroll into the light</p>
      </div>
    </section>
  );
}

function Afternoon() {
  return (
    <div>
      <div className="overflow-hidden border-b border-[#1e3328]/10 py-3">
        <p className="gh-marquee m-0 w-max text-xs tracking-[0.32em] uppercase">{`${day.place} · ${day.shortDate} · ${day.venue} · `.repeat(4)}</p>
      </div>
      <section className="grid items-end gap-8 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-12">
        <Rise>
          <p className="m-0 text-xs tracking-[0.36em] text-[#c46a45] uppercase">Goldhour · Muskoka</p>
          <h1 className="m-0 mt-4 font-[family-name:var(--font-serif)] text-[clamp(3.2rem,8vw,6.5rem)] leading-[0.86] italic">{day.bride}</h1>
          <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(3.2rem,8vw,6.5rem)] leading-[0.86]">{day.groom}</p>
        </Rise>
        <Rise>
          <p className="m-0 font-[family-name:var(--font-serif)] text-3xl leading-snug italic">{day.arrival}</p>
          <p className="m-0 mt-4 text-lg leading-relaxed">{day.dateLabel}. {day.time}, {day.venue}. {day.address}.</p>
        </Rise>
      </section>
      <section className="px-6 md:px-12">
        <img src="/photos/bouquet.jpg" alt="" className="h-[58vh] w-full object-cover" />
      </section>
      <section className="grid gap-16 px-6 py-20 md:px-12">
        {day.hours.map((hour) => (
          <Rise key={hour.time}>
            <article className="grid items-baseline gap-4 border-t border-[#1e3328]/15 pt-8 md:grid-cols-[8rem_1fr]">
              <p className="m-0 font-[family-name:var(--font-serif)] text-5xl text-[#c46a45] italic">{hour.time}</p>
              <div>
                <h2 className="m-0 font-[family-name:var(--font-serif)] text-4xl italic">{hour.title}</h2>
                <p className="m-0 mt-2 max-w-lg text-lg leading-relaxed">{hour.detail}</p>
              </div>
            </article>
          </Rise>
        ))}
      </section>
      <section className="grid items-center gap-10 bg-[#1e3328] px-6 py-16 text-[#f6ead8] md:grid-cols-2 md:px-12">
        <Rise>
          <img src="/photos/kiss.jpg" alt="" className="aspect-[4/5] w-full object-cover" />
        </Rise>
        <Rise>
          <h2 className="m-0 font-[family-name:var(--font-serif)] text-[clamp(2.2rem,5vw,3.6rem)] leading-none italic">Stay through Sunday.</h2>
          <p className="m-0 mt-4 max-w-md text-lg leading-relaxed">{day.dress}</p>
          <ul className="m-0 mt-6 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="mt-4">
                <p className="m-0 text-[#e7b089]">{stay.name}</p>
                <p className="m-0 mt-1 text-[#f6ead8]/80">{stay.detail}</p>
              </li>
            ))}
          </ul>
          <Reply />
        </Rise>
      </section>
    </div>
  );
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSent(String(data.get("name") || ""));
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-serif)] text-3xl italic">The light will find you, {sent}.</p>;
  return (
    <form className="mt-8 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">
        Your name
        <input name="name" required placeholder="Your name" className="min-h-12 border border-[#f6ead8]/30 bg-transparent px-3 text-base text-[#f6ead8]" />
      </label>
      <label className="grid gap-1 text-sm">
        Arriving
        <select name="when" className="min-h-12 border border-[#f6ead8]/30 bg-[#1e3328] px-3 text-base" defaultValue="Saturday">
          <option>Friday</option>
          <option>Saturday</option>
          <option>Already at the lake</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        A note for supper
        <textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#f6ead8]/30 bg-transparent px-3 py-2 text-base text-[#f6ead8]" />
      </label>
      <button type="submit" className="mt-2 min-h-12 cursor-pointer border-0 bg-[#c46a45] px-5 text-base text-[#fff6ec]">I will be there</button>
    </form>
  );
}
