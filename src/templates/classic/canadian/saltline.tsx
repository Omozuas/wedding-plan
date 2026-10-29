"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { saltlineDay as day } from "./saltline-day";

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const update = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88 && rect.bottom > 40) setShown(true);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { ref, shown };
}

function Rise({ children, className = "", delay = "0s" }: { children: ReactNode; className?: string; delay?: string }) {
  const { ref, shown } = useInView();
  return (
    <div ref={ref} className={`salt-rise ${shown ? "is-in" : ""} ${className}`} style={{ animationDelay: delay }}>
      {children}
    </div>
  );
}

function band(progress: number, start: number, end: number) {
  const fade = 0.1;
  if (progress <= start) {
    if (start === 0) return 1;
    return Math.min(1, Math.max(0, (progress - (start - fade)) / fade));
  }
  if (progress >= end) {
    if (end === 1) return 1;
    return Math.min(1, Math.max(0, (end + fade - progress) / fade));
  }
  return 1;
}

export function Saltline() {
  return (
    <div className="bg-[#e7efe9] text-[#14221c]">
      <style>{`
        .salt-rise { opacity: 0; transform: translateY(28px); }
        .salt-rise.is-in { animation: salt-rise 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .salt-ken { animation: salt-ken 18s ease-in-out infinite alternate; }
        .salt-water {
          background-image: linear-gradient(180deg, #071411 0%, #16382f 42%, #0c241e 72%, #071411 100%);
          background-size: 100% 220%;
          animation: salt-water 8s ease-in-out infinite alternate;
        }
        .salt-glint { animation: salt-glint 5.5s ease-in-out infinite; }
        .salt-marquee { animation: salt-marquee 28s linear infinite; }
        .salt-draw { transform: scaleX(0); transform-origin: left center; }
        .salt-rise.is-in .salt-draw { animation: salt-draw 0.8s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .salt-bob { animation: salt-bob 2.8s ease-in-out infinite; }
        .salt-dash { stroke-dasharray: 8 10; animation: salt-dash 14s linear infinite; }
        @keyframes salt-rise { to { opacity: 1; transform: translateY(0); } }
        @keyframes salt-ken { from { transform: scale(1.06) translate3d(0, 0, 0); } to { transform: scale(1.14) translate3d(-2%, -3%, 0); } }
        @keyframes salt-water { from { background-position: 0 0; } to { background-position: 0 100%; } }
        @keyframes salt-glint { 0%, 100% { transform: translateX(-30%); opacity: 0; } 40% { opacity: 0.7; } 80% { transform: translateX(130%); opacity: 0; } }
        @keyframes salt-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes salt-draw { to { transform: scaleX(1); } }
        @keyframes salt-bob { 0%, 100% { transform: translateY(0); opacity: 0.4; } 50% { transform: translateY(-8px); opacity: 1; } }
        @keyframes salt-dash { to { stroke-dashoffset: -240; } }
        @media (prefers-reduced-motion: reduce) {
          .salt-rise, .salt-ken, .salt-water, .salt-glint, .salt-marquee, .salt-bob, .salt-dash { animation: none; }
          .salt-rise, .salt-rise.is-in { opacity: 1; transform: none; }
          .salt-draw { transform: none; }
        }
      `}</style>
      <ScrollCover />
      <main>
        <Invitation live revealed />
      </main>
    </div>
  );
}

function coverFade(progress: number, start: number, end: number) {
  if (end <= start) return progress >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}

function ScrollCover() {
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
      const far = root.querySelector<HTMLElement>("[data-far]");
      const near = root.querySelector<HTMLElement>("[data-near]");
      const mist = root.querySelector<HTMLElement>("[data-mist]");
      const wash = root.querySelector<HTMLElement>("[data-wash]");
      const title = root.querySelector<HTMLElement>("[data-title]");
      const cue = root.querySelector<HTMLElement>("[data-cue]");
      const horizon = root.querySelector<HTMLElement>("[data-horizon]");
      const rule = root.querySelector<HTMLElement>("[data-rule]");
      if (far) {
        const visible = coverFade(p, 0.08, 0.3) * (1 - coverFade(p, 0.8, 1));
        far.style.opacity = String(visible);
        far.style.transform = `scale(${1.08 + coverFade(p, 0.08, 0.86) * 0.18}) translate3d(0, ${coverFade(p, 0.5, 1) * -10}%, 0)`;
      }
      if (near) {
        const visible = coverFade(p, 0.36, 0.58) * (1 - coverFade(p, 0.74, 0.94));
        near.style.opacity = String(visible * 0.92);
        near.style.transform = `scale(1.14) translate3d(${coverFade(p, 0.36, 0.9) * -6}%, ${coverFade(p, 0.36, 1) * -16}%, 0)`;
      }
      if (mist) mist.style.opacity = String(1 - coverFade(p, 0.1, 0.42));
      if (wash) wash.style.opacity = String(coverFade(p, 0.82, 1));
      if (horizon) {
        horizon.style.transform = `scaleX(${0.12 + coverFade(p, 0.02, 0.38) * 0.88})`;
        horizon.style.opacity = String(0.85 * (1 - coverFade(p, 0.62, 0.84)));
      }
      if (rule) rule.style.transform = `scaleX(${coverFade(p, 0.5, 0.7)})`;
      if (cue) {
        cue.style.opacity = String(1 - coverFade(p, 0.05, 0.2));
        cue.style.transform = `translateY(${coverFade(p, 0, 0.2) * -20}px)`;
      }
      root.querySelectorAll<HTMLElement>("[data-line]").forEach((line) => {
        const shown = coverFade(p, Number(line.dataset.start), Number(line.dataset.end));
        line.style.opacity = String(shown);
        line.style.transform = `translate3d(0, ${(1 - shown) * 42}px, 0)`;
      });
      if (title) {
        title.style.transform = `translate3d(0, ${coverFade(p, 0.74, 0.98) * -28}vh, 0)`;
        title.style.opacity = String(1 - coverFade(p, 0.86, 1));
      }
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
      <section className="grid min-h-dvh place-items-center bg-[#071411] px-6 text-center text-[#f4efe6]">
        <div>
          <p className="m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.34em] text-[#d85a3a] uppercase">Howe Sound</p>
          <h1 className="m-0 mt-4 font-[family-name:var(--font-display)] text-[clamp(3.4rem,12vw,6rem)] leading-[0.84] font-extrabold">Elise<br />Jonah</h1>
          <p className="m-0 mt-5 font-[family-name:var(--font-serif)] text-2xl">{day.time} · {day.place}</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="relative h-[520vh] bg-[#071411]" aria-label="Scroll up to enter">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="salt-water absolute inset-0" />
        <img data-far src="/photos/couple.jpg" alt="" className="absolute inset-[-8%] h-[116%] w-[116%] object-cover opacity-0" />
        <img data-near src="/photos/walk.jpg" alt="" className="absolute inset-[-8%] h-[116%] w-[116%] object-cover opacity-0" />
        <div data-mist className="absolute inset-0 bg-[#071411]" />
        <div data-wash className="absolute inset-0 bg-[#e7efe9] opacity-0" />
        <span className="salt-glint pointer-events-none absolute top-[22%] h-px w-2/5 bg-white/40" />
        <span className="salt-glint pointer-events-none absolute top-[70%] h-px w-1/3 bg-white/25" style={{ animationDelay: "-2.4s" }} />
        <div data-horizon className="absolute top-[58%] left-[14%] h-px w-[72%] origin-center bg-[#e7efe9]/80" style={{ transform: "scaleX(0.12)" }} />
        <div data-title className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-[#f4efe6]">
          <p data-line data-start="0.16" data-end="0.34" className="m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.38em] text-[#d85a3a] uppercase opacity-0">Howe Sound</p>
          <p data-line data-start="0.26" data-end="0.46" className="m-0 mt-5 font-[family-name:var(--font-display)] text-[clamp(3.6rem,13vw,7.2rem)] leading-[0.82] font-extrabold opacity-0 [text-shadow:0_12px_40px_rgba(0,0,0,0.35)]">Elise</p>
          <p data-line data-start="0.36" data-end="0.56" className="m-0 font-[family-name:var(--font-display)] text-[clamp(3.6rem,13vw,7.2rem)] leading-[0.82] font-extrabold text-[#d7ebe4] opacity-0 [text-shadow:0_12px_40px_rgba(0,0,0,0.35)]">Jonah</p>
          <div data-rule className="mt-6 h-px w-24 origin-center bg-[#d85a3a]" style={{ transform: "scaleX(0)" }} />
          <p data-line data-start="0.5" data-end="0.68" className="m-0 mt-6 font-[family-name:var(--font-serif)] text-[clamp(1.35rem,3vw,2rem)] opacity-0">{day.time}</p>
          <p data-line data-start="0.58" data-end="0.74" className="m-0 mt-2 font-[family-name:var(--font-ui)] text-sm tracking-[0.22em] uppercase opacity-0">{day.place} · {day.ferry}</p>
          <p data-line data-start="0.66" data-end="0.8" className="m-0 mt-3 font-[family-name:var(--font-serif)] text-xl opacity-0">{day.dateLabel}</p>
        </div>
        <p data-cue className="absolute inset-x-0 bottom-10 m-0 text-center font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.32em] text-[#e7efe9] uppercase">
          <span className="salt-bob mb-2 block text-base" aria-hidden="true">↑</span>
          Scroll up
        </p>
      </div>
    </section>
  );
}

function Invitation({ live, revealed }: { live: boolean; revealed: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!live) return;
    const root = rootRef.current;
    if (!root) return;
    const update = () => {
      const hero = root.querySelector<HTMLElement>("[data-hero]");
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
        hero.style.setProperty("--p", progress.toFixed(3));
      }
      const reel = root.querySelector<HTMLElement>("[data-reel]");
      if (reel) {
        const rect = reel.getBoundingClientRect();
        const total = reel.offsetHeight - window.innerHeight;
        const progress = total <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / total));
        reel.querySelectorAll<HTMLElement>("[data-beat]").forEach((beat) => {
          const start = Number(beat.dataset.start);
          const end = Number(beat.dataset.end);
          const shown = band(progress, start, end);
          beat.style.opacity = String(shown);
          beat.style.transform = `translateY(${(1 - shown) * 24}px)`;
        });
        reel.querySelectorAll<HTMLElement>("[data-plate]").forEach((plate) => {
          const start = Number(plate.dataset.start);
          const end = Number(plate.dataset.end);
          const shown = band(progress, start, end);
          plate.style.opacity = String(shown);
          plate.style.transform = `scale(1.08) translate3d(0, ${(progress - 0.5) * -36}px, 0)`;
        });
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [live]);

  return (
    <div ref={rootRef} className="bg-[#e7efe9]">
      <section data-hero className="grid min-h-dvh md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="order-2 flex flex-col justify-end px-5 py-10 sm:px-10 md:order-1 md:py-16">
          <p className={`salt-rise m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.34em] text-[#d85a3a] uppercase ${revealed ? "is-in" : ""}`}>Saltline · {day.region}</p>
          <h1 id="saltline-title" tabIndex={-1} className="m-0 mt-3 font-[family-name:var(--font-display)] text-[clamp(4rem,14vw,7.5rem)] leading-[0.82] font-extrabold tracking-tight outline-none">
            <span className={`salt-rise block ${revealed ? "is-in" : ""}`} style={{ animationDelay: "0.08s" }}>Elise</span>
            <span className={`salt-rise block text-[#1f6a56] ${revealed ? "is-in" : ""}`} style={{ animationDelay: "0.18s" }}>Jonah</span>
          </h1>
          <p className={`salt-rise m-0 mt-6 max-w-sm font-[family-name:var(--font-serif)] text-2xl leading-snug ${revealed ? "is-in" : ""}`} style={{ animationDelay: "0.3s" }}>
            {day.dateLabel}. {day.time}, {day.ferry}.
          </p>
          <p className={`salt-rise m-0 mt-2 font-[family-name:var(--font-ui)] text-sm tracking-wide ${revealed ? "is-in" : ""}`} style={{ animationDelay: "0.4s" }}>{day.venue}</p>
        </div>
        <div className="relative order-1 min-h-[46vh] overflow-hidden md:order-2 md:min-h-dvh" style={{ transform: "translate3d(0, calc(var(--p, 0) * 48px), 0)" }}>
          <img src="/photos/couple.jpg" alt="" className="salt-ken absolute inset-0 h-[112%] w-full object-cover" />
        </div>
      </section>

      <div className="overflow-hidden border-y border-[#14221c]/10 bg-[#14221c] py-3 text-[#e7efe9]">
        <p className="salt-marquee m-0 w-max font-[family-name:var(--font-ui)] text-[0.72rem] tracking-[0.28em] whitespace-nowrap uppercase">
          {`${day.region} · ${day.time} · ${day.place} · 12 September · `.repeat(4)}
        </p>
      </div>

      <section data-reel className="relative h-[280vh]">
        <div className="sticky top-0 grid h-dvh md:grid-cols-2">
          <div className="relative min-h-[38vh] overflow-hidden md:min-h-0">
            {day.beats.map((beat, index) => (
              <img
                key={beat.src}
                src={beat.src}
                alt=""
                data-plate
                data-start={index === 0 ? 0 : index * 0.33}
                data-end={index === day.beats.length - 1 ? 1 : (index + 1) * 0.33 + 0.08}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: index === 0 ? 1 : 0 }}
              />
            ))}
          </div>
          <div className="relative flex items-end bg-[#e7efe9] px-5 py-8 sm:px-10 md:items-center">
            {day.beats.map((beat, index) => (
              <article
                key={beat.kicker}
                data-beat
                data-start={index === 0 ? 0 : index * 0.33}
                data-end={index === day.beats.length - 1 ? 1 : (index + 1) * 0.33 + 0.08}
                className="absolute inset-x-5 bottom-8 sm:inset-x-10 md:bottom-auto"
                style={{ opacity: index === 0 ? 1 : 0 }}
              >
                <p className="m-0 font-[family-name:var(--font-ui)] text-[0.66rem] tracking-[0.32em] text-[#d85a3a] uppercase">{beat.kicker}</p>
                <p className="m-0 mt-3 max-w-md font-[family-name:var(--font-serif)] text-[clamp(1.7rem,4vw,2.6rem)] leading-snug">{beat.line}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-10 sm:py-24">
        <Rise>
          <p className="m-0 font-[family-name:var(--font-ui)] text-[0.66rem] tracking-[0.32em] text-[#d85a3a] uppercase">The day</p>
          <div className="salt-draw mt-4 h-[3px] w-24 bg-[#d85a3a]" />
          <h2 className="m-0 mt-5 max-w-xl font-[family-name:var(--font-display)] text-[clamp(2.2rem,6vw,4rem)] leading-[0.95] font-extrabold">You are already on the water.</h2>
        </Rise>
        <Rise delay="0.08s">
          <p className="m-0 mt-6 max-w-xl font-[family-name:var(--font-serif)] text-2xl leading-snug">
            {day.bride} and {day.groom} marry at {day.venue}. Leave {day.ferry.split(" to ")[0]} on {day.time.toLowerCase()}. The crossing is short. At the cove, follow {day.address.toLowerCase()} until the jars start. A coat is enough for the deck. Kelp, rust, and cream belong beside the trees. Rooms are kept upstairs in the house. The last ferry home leaves after the lanterns, and nobody will rush you to it.
          </p>
        </Rise>
        <ol className="m-0 mt-12 grid list-none gap-8 p-0 md:grid-cols-2">
          {day.hours.map((hour, index) => (
            <li key={hour.at}>
              <Rise delay={`${index * 0.06}s`}>
                <p className="m-0 font-[family-name:var(--font-display)] text-5xl font-extrabold text-[#1f6a56]">{hour.at}</p>
                <h3 className="m-0 mt-2 font-[family-name:var(--font-display)] text-2xl font-bold">{hour.title}</h3>
                <p className="m-0 mt-2 max-w-sm font-[family-name:var(--font-serif)] text-xl leading-snug">{hour.line}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid items-center gap-8 bg-[#dfeae3] px-5 py-16 sm:px-10 md:grid-cols-2">
        <Rise>
          <img src="/photos/dress.jpg" alt="" className="aspect-[4/5] w-full object-cover" />
        </Rise>
        <Rise delay="0.1s">
          <svg viewBox="0 0 240 48" className="mb-4 h-12 w-60" aria-hidden="true">
            <path className="salt-dash" d="M0 32 C 40 8, 80 48, 120 24 S 200 8, 240 28" fill="none" stroke="#1f6a56" strokeWidth="2" />
          </svg>
          <h2 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3.4rem)] leading-none font-extrabold">The chair by the window is yours.</h2>
          <p className="m-0 mt-4 max-w-md font-[family-name:var(--font-serif)] text-2xl leading-snug">Linen, oranges, and the sound of the cove through the glass. Tell us you are coming, and how you will cross.</p>
          <Guestbook />
        </Rise>
      </section>

      <section className="relative grid min-h-[80vh] place-items-end overflow-hidden px-5 py-16 sm:px-10">
        <img src="/photos/rings.jpg" alt="" className="salt-ken absolute inset-0 h-full w-full object-cover" />
        <div className="relative max-w-lg bg-[#14221c] px-6 py-8 text-[#e7efe9]">
          <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(1.8rem,4vw,2.6rem)] leading-snug">When the lanterns go down, the sound is only water.</p>
          <p className="m-0 mt-4 font-[family-name:var(--font-ui)] text-sm tracking-[0.18em] uppercase">{day.bride} and {day.groom}</p>
        </div>
      </section>
    </div>
  );
}

function Guestbook() {
  const [sent, setSent] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSent(String(data.get("name") || ""));
  }

  if (sent) {
    return <p className="m-0 mt-8 font-[family-name:var(--font-display)] text-3xl leading-tight font-extrabold">The window seat is yours, {sent}.</p>;
  }

  return (
    <form className="mt-8 grid gap-3" onSubmit={submit}>
      <label className="grid gap-1 font-[family-name:var(--font-ui)] text-sm">
        Your name
        <input name="name" required className="min-h-12 border border-[#14221c]/20 bg-white px-3 text-base" placeholder="Your name" />
      </label>
      <label className="grid gap-1 font-[family-name:var(--font-ui)] text-sm">
        Arriving with
        <input name="with" className="min-h-12 border border-[#14221c]/20 bg-white px-3 text-base" placeholder="A name, if someone is with you" />
      </label>
      <label className="grid gap-1 font-[family-name:var(--font-ui)] text-sm">
        How you cross
        <select name="crossing" className="min-h-12 border border-[#14221c]/20 bg-white px-3 text-base" defaultValue={day.arrivals[0]}>
          {day.arrivals.map((arrival) => (
            <option key={arrival}>{arrival}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 font-[family-name:var(--font-ui)] text-sm">
        A note for the table
        <textarea name="note" rows={3} className="border border-[#14221c]/20 bg-white px-3 py-2 text-base" placeholder="A seat, a song, a diet" />
      </label>
      <button type="submit" className="mt-2 min-h-12 cursor-pointer border-0 bg-[#d85a3a] px-5 text-base text-white">
        Keep my place
      </button>
    </form>
  );
}
