"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { northlightDay as day } from "./northlight-day";

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
    <div ref={ref} className={`nl-rise ${shown ? "is-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function Northlight() {
  return (
    <div className="bg-[#070b0a] text-[#efe6d6]">
      <style>{`
        .nl-rise { opacity: 0; transform: translateY(28px); }
        .nl-rise.is-in { animation: nl-rise 1.1s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .nl-beam { animation: nl-beam 7s ease-in-out infinite; }
        .nl-drift { animation: nl-drift 22s linear infinite; }
        @keyframes nl-rise { to { opacity: 1; transform: translateY(0); } }
        @keyframes nl-beam { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.7; } }
        @keyframes nl-drift { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .nl-rise, .nl-beam, .nl-drift { animation: none; }
          .nl-rise { opacity: 1; transform: none; }
        }
      `}</style>
      <SlitIntro />
      <Shore />
    </div>
  );
}

function SlitIntro() {
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
      const travel = coverFade(p, 0, 0.72);
      const open = coverFade(p, 0.58, 1);
      const slit = 18 + open * 82;
      const left = travel * (100 - slit);
      const photo = root.querySelector<HTMLElement>("[data-photo]");
      const beam = root.querySelector<HTMLElement>("[data-beam]");
      const names = root.querySelector<HTMLElement>("[data-names]");
      const cue = root.querySelector<HTMLElement>("[data-cue]");
      if (photo) {
        photo.style.clipPath = `inset(0 ${Math.max(0, 100 - left - slit)}% 0 ${left}%)`;
        photo.style.transform = `scale(${1.08 + travel * 0.08}) translate3d(${travel * -3}%, 0, 0)`;
      }
      if (beam) {
        beam.style.left = `${left}%`;
        beam.style.width = `${slit}%`;
        beam.style.opacity = String(0.85 * (1 - open));
      }
      if (names) {
        const shown = coverFade(p, 0.28, 0.48) * (1 - coverFade(p, 0.86, 1));
        names.style.opacity = String(shown);
        names.style.transform = `translate3d(0, ${(1 - coverFade(p, 0.28, 0.5)) * 28}px, 0)`;
      }
      if (cue) cue.style.opacity = String(1 - coverFade(p, 0.04, 0.18));
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
      <section className="grid min-h-[70vh] place-items-center px-6 text-center">
        <div>
          <p className="m-0 text-xs tracking-[0.38em] text-[#e7a15a] uppercase">Northlight</p>
          <h1 className="m-0 mt-4 font-[family-name:var(--font-serif)] text-6xl leading-none font-medium">Claire & Thomas</h1>
          <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-2xl">{day.place}</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="relative h-[480vh]" aria-label="Scroll to bring the light across the bay">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <img data-photo src="/photos/walk.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: "inset(0 82% 0 0%)" }} />
        <div data-beam className="nl-beam pointer-events-none absolute inset-y-0 left-0 w-[18%] bg-[linear-gradient(90deg,transparent,rgba(231,161,90,0.28),transparent)]" />
        <div data-names className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center opacity-0">
          <div>
            <p className="m-0 text-[0.68rem] tracking-[0.42em] text-[#e7a15a] uppercase">Lake Rosseau</p>
            <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-[clamp(3.4rem,10vw,6.4rem)] leading-[0.88] font-medium">Claire</p>
            <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(3.4rem,10vw,6.4rem)] leading-[0.88] font-medium text-[#e7a15a]">Thomas</p>
            <p className="m-0 mt-5 text-sm tracking-[0.22em] uppercase">{day.shortDate} · {day.time}</p>
          </div>
        </div>
        <p data-cue className="absolute inset-x-0 bottom-8 m-0 text-center text-[0.68rem] tracking-[0.32em] uppercase">Scroll the light across</p>
      </div>
    </section>
  );
}

function Shore() {
  const dockRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = dockRef.current;
    if (!root) return;
    const update = () => {
      const total = root.offsetHeight - window.innerHeight;
      const p = total <= 0 ? 1 : Math.min(1, Math.max(0, -root.getBoundingClientRect().top / total));
      root.querySelectorAll<HTMLElement>("[data-line]").forEach((line, index) => {
        const start = index / day.dock.length;
        const end = (index + 1) / day.dock.length;
        const local = coverFade(p, Math.max(0, start - 0.04), end);
        const hold = index === day.dock.length - 1 && p > start ? 1 : local * (1 - coverFade(p, end, end + 0.12));
        const shown = index === 0 && p < 0.08 ? 1 : hold;
        line.style.opacity = String(Math.min(1, shown));
        line.style.transform = `translate3d(0, ${(1 - Math.min(1, shown)) * 24}px, 0)`;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div>
      <section className="grid gap-10 px-6 py-20 md:grid-cols-[auto_1fr] md:px-12">
        <p className="m-0 text-xs tracking-[0.42em] text-[#e7a15a] uppercase md:[writing-mode:vertical-rl]">{day.dateLabel}</p>
        <Rise>
          <p className="m-0 max-w-xl font-[family-name:var(--font-serif)] text-[clamp(2rem,5vw,3.6rem)] leading-[1.05]">{day.arrival}</p>
          <p className="m-0 mt-6 max-w-md text-lg leading-relaxed text-[#efe6d6]/75">
            {day.bride} and {day.groom} marry at {day.venue}. {day.place}. {day.address}.
          </p>
        </Rise>
      </section>
      <section ref={dockRef} className="relative h-[260vh]">
        <div className="sticky top-0 grid h-dvh items-end md:grid-cols-2">
          <img src="/photos/dress.jpg" alt="" className="h-[42vh] w-full object-cover md:h-dvh" />
          <div className="relative px-6 py-10 md:px-12">
            {day.dock.map((line, index) => (
              <p key={line} data-line className="absolute inset-x-6 bottom-10 m-0 font-[family-name:var(--font-serif)] text-[clamp(1.7rem,4vw,2.8rem)] leading-snug md:inset-x-12" style={{ opacity: index === 0 ? 1 : 0 }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>
      <section className="px-6 py-16 md:px-12">
        <div className="overflow-hidden border-y border-[#efe6d6]/15 py-3">
          <p className="nl-drift m-0 w-max text-xs tracking-[0.35em] uppercase">{`${day.place} · ${day.venue} · `.repeat(4)}</p>
        </div>
        <ol className="m-0 mt-12 grid list-none gap-10 p-0 md:grid-cols-2">
          {day.hours.map((hour) => (
            <li key={hour.time}>
              <Rise>
                <p className="m-0 font-[family-name:var(--font-serif)] text-5xl text-[#e7a15a]">{hour.time}</p>
                <h2 className="m-0 mt-2 font-[family-name:var(--font-serif)] text-3xl font-medium">{hour.title}</h2>
                <p className="m-0 mt-2 max-w-sm text-lg leading-relaxed text-[#efe6d6]/75">{hour.detail}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>
      <section className="grid items-center gap-8 px-6 py-16 md:grid-cols-2 md:px-12">
        <Rise>
          <img src="/photos/rings.jpg" alt="" className="aspect-[4/5] w-full object-cover" />
        </Rise>
        <Rise>
          <h2 className="m-0 font-[family-name:var(--font-serif)] text-[clamp(2rem,5vw,3.4rem)] leading-none font-medium">A place on the dock.</h2>
          <p className="m-0 mt-4 max-w-md text-lg leading-relaxed">{day.dress}</p>
          <ul className="m-0 mt-6 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="mt-4 border-t border-[#efe6d6]/15 pt-4">
                <p className="m-0 text-[#e7a15a]">{stay.name}</p>
                <p className="m-0 mt-1 text-[#efe6d6]/75">{stay.detail}</p>
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
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-serif)] text-3xl">The dock will know you, {sent}.</p>;
  return (
    <form className="mt-8 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">
        Your name
        <input name="name" required placeholder="Your name" className="min-h-12 border border-[#efe6d6]/25 bg-transparent px-3 text-base text-[#efe6d6]" />
      </label>
      <label className="grid gap-1 text-sm">
        Coming with
        <input name="with" placeholder="If someone is with you" className="min-h-12 border border-[#efe6d6]/25 bg-transparent px-3 text-base text-[#efe6d6]" />
      </label>
      <label className="grid gap-1 text-sm">
        A note
        <textarea name="note" rows={3} placeholder="Friday arrival, a seat, a song" className="border border-[#efe6d6]/25 bg-transparent px-3 py-2 text-base text-[#efe6d6]" />
      </label>
      <button type="submit" className="mt-2 min-h-12 cursor-pointer border-0 bg-[#e7a15a] px-5 text-base text-[#1a120c]">Keep my place</button>
    </form>
  );
}
