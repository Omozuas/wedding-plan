"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { flurryDay as day } from "./flurry-day";

const COLORS = ["#2457ff", "#ff4d3a", "#ffe14a", "#141414", "#7aa2ff", "#ff8a3d"];
const CHIP_PHOTOS = ["/photos/bouquet.jpg", "/photos/rings.jpg", "/photos/couple.jpg", "/photos/walk.jpg", "/photos/kiss.jpg", "/photos/dress.jpg"];
const BIT_COUNT = 96;

export function Flurry() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-hidden bg-[#f6f3ec] text-[#141414]">
      <style>{`
        .fl-sky { opacity: 1; transition: opacity 1.1s ease; }
        .fl-sky.is-leaving { opacity: 0; }
        .fl-flash { animation: fl-flash 0.7s ease both; }
        .fl-iris { clip-path: circle(0% at 50% 40%); animation: fl-iris 1.7s cubic-bezier(0.16, 0.84, 0.3, 1) 0.85s forwards; }
        .fl-name, .fl-sub { opacity: 0; animation: fl-pop 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .fl-name { animation-delay: 1.35s; }
        .fl-name-2 { animation-delay: 1.55s; }
        .fl-sub { animation-delay: 2.05s; }
        .fl-stage { animation: fl-stage 0.7s ease 3.3s forwards; }
        .fl-rise { opacity: 0; transform: translateY(32px); }
        .fl-rise.is-in { animation: fl-pop 1.05s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .fl-ken { animation: fl-ken 18s ease-in-out infinite alternate; }
        .fl-assemble.is-in .fl-band { animation: fl-band 1.15s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .fl-band:nth-child(odd) { --x: -14%; }
        .fl-band:nth-child(even) { --x: 14%; }
        .fl-card { opacity: 0; transform: translateY(24px) rotate(-1.5deg); }
        .fl-rise.is-in .fl-card { animation: fl-card 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .fl-marquee { animation: fl-marquee 26s linear infinite; }
        .fl-word { animation: fl-pop 0.8s ease both; }
        @keyframes fl-stage { to { opacity: 0; } }
        @keyframes fl-flash { 0% { opacity: 0.95; } 100% { opacity: 0; } }
        @keyframes fl-iris { to { clip-path: circle(78% at 50% 42%); } }
        @keyframes fl-pop { from { opacity: 0; transform: translateY(26px) scale(0.96); } to { opacity: 1; transform: none; } }
        @keyframes fl-ken { from { transform: scale(1.06) translate3d(0, 0, 0); } to { transform: scale(1.14) translate3d(-2%, -1%, 0); } }
        @keyframes fl-band { from { transform: translateX(var(--x)); } to { transform: none; } }
        @keyframes fl-card { to { opacity: 1; transform: none; } }
        @keyframes fl-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .fl-iris { clip-path: none; animation: none; }
          .fl-name, .fl-sub, .fl-rise, .fl-card, .fl-word { animation: none; opacity: 1; transform: none; }
          .fl-ken, .fl-marquee, .fl-flash, .fl-stage { animation: none; }
        }
      `}</style>
      {!open && <Splash onDone={() => setOpen(true)} />}
      <Invitation live={open} />
    </div>
  );
}

function Splash({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLElement>(null);
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let leaveTimer = 0;
    let doneTimer = 0;
    if (reduce) {
      doneTimer = window.setTimeout(() => finish.current(), 400);
    } else {
      const root = rootRef.current;
      const bits = root?.querySelectorAll<HTMLElement>("[data-bit]") ?? [];
      const reach = Math.max(window.innerWidth, window.innerHeight);
      bits.forEach((bit, index) => {
        const angle = (index / bits.length) * Math.PI * 2 + (index % 4) * 0.18;
        const dist = (0.16 + (index % 7) * 0.07) * Math.min(reach, 980);
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist * 0.78 + 90;
        const rot = (index % 2 === 0 ? 1 : -1) * (160 + (index % 7) * 48);
        bit.animate(
          [
            { transform: "translate(-50%, -50%) scale(0.25) rotate(0deg)", opacity: 1, offset: 0 },
            { transform: `translate(calc(-50% + ${dx * 0.72}px), calc(-50% + ${dy * 0.55}px)) scale(1) rotate(${rot * 0.45}deg)`, opacity: 1, offset: 0.28 },
            { transform: `translate(calc(-50% + ${dx * 0.9}px), calc(-50% + ${dy * 0.8}px)) scale(1) rotate(${rot * 0.7}deg)`, opacity: 1, offset: 0.72 },
            { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 80}px)) scale(0.92) rotate(${rot}deg)`, opacity: 0, offset: 1 },
          ],
          {
            duration: 6400 + (index % 6) * 120,
            delay: (index % 12) * 36,
            easing: "cubic-bezier(0.16, 0.7, 0.2, 1)",
            fill: "forwards",
          },
        );
      });
      const orbs = root?.querySelectorAll<HTMLElement>("[data-orb]") ?? [];
      const width = window.innerWidth;
      const height = window.innerHeight;
      const openSize = Math.round(Math.min(width * 0.74, height * 0.66, 620));
      const entries = [
        [-width * 0.46, height * 0.06],
        [width * 0.46, -height * 0.1],
        [width * 0.04, -height * 0.42],
        [-width * 0.4, height * 0.34],
        [width * 0.42, height * 0.3],
        [0, height * 0.44],
      ];
      orbs.forEach((orb, index) => {
        const [x, y] = entries[index] ?? entries[0];
        orb.style.width = `${openSize}px`;
        orb.style.height = `${openSize}px`;
        orb.animate(
          [
            { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0.2)`, opacity: 0, borderRadius: "999px", clipPath: "circle(50% at 50% 50%)", offset: 0 },
            { transform: `translate(calc(-50% + ${x * 0.28}px), calc(-50% + ${y * 0.15}px)) scale(0.22)`, opacity: 1, borderRadius: "999px", clipPath: "circle(50% at 50% 50%)", offset: 0.16 },
            { transform: "translate(-50%, calc(-50% - 84px)) scale(0.24)", opacity: 1, borderRadius: "999px", clipPath: "circle(50% at 50% 50%)", offset: 0.3 },
            { transform: "translate(-50%, calc(-50% + 8px)) scale(0.28, 0.16)", opacity: 1, borderRadius: "999px", clipPath: "circle(50% at 50% 50%)", offset: 0.4 },
            { transform: "translate(-50%, calc(-50% - 36px)) scale(0.22)", opacity: 1, borderRadius: "999px", clipPath: "circle(50% at 50% 50%)", offset: 0.5 },
            { transform: "translate(-50%, -50%) scale(0.2)", opacity: 1, borderRadius: "999px", clipPath: "circle(50% at 50% 50%)", offset: 0.58 },
            { transform: "translate(-50%, -50%) scale(1.2, 1)", opacity: 1, borderRadius: "12px", clipPath: "inset(0% round 12px)", offset: 0.8 },
            { transform: "translate(-50%, -50%) scale(1.26, 1.04)", opacity: 0, borderRadius: "12px", clipPath: "inset(0% round 12px)", offset: 1 },
          ],
          { duration: 2200, delay: 2400 + index * 2200, easing: "linear", fill: "both" },
        );
      });
      leaveTimer = window.setTimeout(() => setLeaving(true), 2400 + orbs.length * 2200 + 200);
      doneTimer = window.setTimeout(() => finish.current(), 2400 + orbs.length * 2200 + 1400);
    }
    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = previous;
    };
  }, []);

  function skip() {
    setLeaving(true);
    window.setTimeout(() => finish.current(), 240);
  }

  return (
    <section
      ref={rootRef}
      className={`fl-sky fixed inset-0 z-50 overflow-hidden bg-[#f6f3ec] ${leaving ? "is-leaving" : ""}`}
      aria-label="A burst of colour opens the day"
    >
      <span className="fl-flash pointer-events-none absolute inset-0 bg-white" />
      {Array.from({ length: BIT_COUNT }, (_, index) => {
        const photo = index < CHIP_PHOTOS.length ? CHIP_PHOTOS[index] : undefined;
        const wide = index % 4 === 0;
        return (
          <span
            key={index}
            data-bit
            className="pointer-events-none absolute top-[42%] left-1/2 z-[2] block"
            style={{
              width: photo ? 78 : wide ? 42 : 18,
              height: photo ? 78 : wide ? 16 : 32,
              borderRadius: photo || index % 6 === 0 ? 999 : 2,
              backgroundColor: photo ? undefined : COLORS[index % COLORS.length],
              backgroundImage: photo ? `url(${photo})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0,
            }}
          />
        );
      })}
      {CHIP_PHOTOS.map((photo) => (
        <img
          key={photo}
          data-orb
          src={photo}
          alt=""
          className="pointer-events-none absolute top-1/2 left-1/2 z-[4] object-cover"
          style={{ width: 120, height: 120, borderRadius: 999, opacity: 0, transform: "translate(-50%, -50%)" }}
        />
      ))}
      <div className="fl-stage relative z-[3] flex h-full flex-col items-center justify-center px-6 text-center">
        <img src="/photos/couple.jpg" alt="" className="fl-iris h-[34vh] w-[34vh] max-w-[70vw] rounded-full object-cover" />
        <p className="fl-name m-0 mt-6 font-[family-name:var(--font-display)] text-[clamp(3.4rem,12vw,6.5rem)] leading-[0.84] font-extrabold tracking-[-0.07em]">
          Claire
        </p>
        <p className="fl-name fl-name-2 m-0 font-[family-name:var(--font-display)] text-[clamp(3.4rem,12vw,6.5rem)] leading-[0.84] font-extrabold tracking-[-0.07em] text-[#2457ff]">
          Thomas
        </p>
        <p className="fl-sub m-0 mt-4 text-lg">
          {day.time} · {day.venue}
        </p>
      </div>
      <button
        type="button"
        onClick={skip}
        className="absolute top-5 right-5 z-[5] cursor-pointer border border-[#141414]/20 bg-white/70 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase"
      >
        Skip
      </button>
    </section>
  );
}

function Invitation({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="relative min-h-dvh overflow-hidden">
        <img src="/photos/couple.jpg" alt="Claire and Thomas at the lake" className="fl-ken absolute inset-0 size-full object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-[#f6f3ec]/48" />
        <div className="relative grid min-h-dvh content-end gap-6 px-6 py-14 sm:px-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="m-0 text-[0.68rem] tracking-[0.34em] text-[#ff4d3a] uppercase">Flurry · Muskoka</p>
            <h1 className="m-0 mt-3 font-[family-name:var(--font-display)] text-[clamp(4rem,13vw,7.5rem)] leading-[0.82] font-extrabold tracking-[-0.07em]">
              {day.bride.split(" ")[0]}
              <span className="block text-[#2457ff]">{day.groom.split(" ")[0]}</span>
            </h1>
          </div>
          <p className="m-0 max-w-sm pb-2 text-xl leading-snug">
            {day.dateLabel}. {day.time} at {day.venue}, {day.place}.
          </p>
        </div>
      </section>
      <div className="overflow-hidden bg-[#2457ff] py-3 text-[#f6f3ec]">
        <p className="fl-marquee m-0 w-max text-sm font-semibold tracking-[0.28em] uppercase">
          {`${day.venue} · ${day.shortDate} · ${day.place} · `.repeat(4)}
        </p>
      </div>
      <section className="grid items-center gap-8 px-6 py-16 sm:px-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-extrabold tracking-[-0.05em]">
            {day.arrival}
          </p>
          <p className="m-0 mt-4 text-lg leading-relaxed text-[#141414]/75">{day.address}.</p>
        </Rise>
        <Rise live={live} className="fl-assemble relative h-[68vh] overflow-hidden">
          {[0, 1, 2].map((index) => (
            <img
              key={index}
              src="/photos/walk.jpg"
              alt={index === 0 ? "Claire and Thomas walking to the water" : ""}
              className="fl-band absolute inset-0 size-full object-cover"
              style={{
                clipPath: `inset(calc(${index} * 33.333% - 3px) 0 calc(${2 - index} * 33.333% - 3px) 0)`,
                animationDelay: `${0.08 + index * 0.16}s`,
              }}
            />
          ))}
        </Rise>
      </section>
      <section className="px-6 sm:px-12">
        <div className="grid gap-3 md:grid-cols-4">
          {day.dock.map((line, index) => (
            <Rise key={line} live={live}>
              <p className="fl-word m-0 border-t-2 border-[#ff4d3a] pt-3 font-[family-name:var(--font-display)] text-xl leading-snug font-extrabold tracking-[-0.04em]" style={{ animationDelay: `${index * 0.12}s` }}>
                {line}
              </p>
            </Rise>
          ))}
        </div>
      </section>
      <section className="grid gap-4 px-6 py-16 sm:px-12 md:grid-cols-2">
        <Rise live={live} className="overflow-hidden">
          <img src="/photos/bouquet.jpg" alt="The bouquet" className="fl-ken aspect-[5/4] w-full object-cover" />
        </Rise>
        <Rise live={live} className="overflow-hidden">
          <img src="/photos/rings.jpg" alt="The rings" className="aspect-[5/4] w-full object-cover" />
        </Rise>
      </section>
      <section className="px-6 pb-8 sm:px-12">
        <p className="m-0 text-[0.68rem] tracking-[0.32em] text-[#2457ff] uppercase">The evening</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {day.hours.map((hour, index) => (
            <Rise key={hour.time} live={live}>
              <article className="fl-card border border-[#141414]/10 bg-white p-6" style={{ animationDelay: `${index * 0.12}s` }}>
                <p className="m-0 font-[family-name:var(--font-display)] text-5xl font-extrabold tracking-[-0.06em] text-[#2457ff]">{hour.time}</p>
                <h2 className="m-0 mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-[-0.04em]">{hour.title}</h2>
                <p className="m-0 mt-2 text-lg leading-relaxed text-[#141414]/75">{hour.detail}</p>
              </article>
            </Rise>
          ))}
        </div>
      </section>
      <section className="grid gap-8 bg-[#141414] px-6 py-16 text-[#f6f3ec] sm:px-12 lg:grid-cols-[1fr_1fr]">
        <Rise live={live}>
          <h2 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.4rem,5vw,4rem)] leading-none font-extrabold tracking-[-0.05em]">Stay through Sunday.</h2>
          <p className="m-0 mt-4 max-w-md text-lg leading-relaxed text-white/75">{day.dress}</p>
          <div className="mt-6 grid gap-3">
            {day.stays.map((stay) => (
              <article key={stay.name} className="border-t border-white/15 pt-3">
                <p className="m-0 font-semibold text-[#ffe14a]">{stay.name}</p>
                <p className="m-0 mt-1 text-white/75">{stay.detail}</p>
              </article>
            ))}
          </div>
        </Rise>
        <Rise live={live}>
          <Reply />
        </Rise>
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setOn(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [live]);
  return (
    <div ref={ref} className={`fl-rise ${on ? "is-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

function burstFrom(origin: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = origin.getBoundingClientRect();
  const host = document.createElement("div");
  host.className = "pointer-events-none fixed inset-0 z-[70] overflow-hidden";
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let index = 0; index < 36; index += 1) {
    const bit = document.createElement("span");
    const angle = (index / 36) * Math.PI * 2;
    const dist = 90 + (index % 5) * 36;
    bit.style.position = "absolute";
    bit.style.left = `${cx}px`;
    bit.style.top = `${cy}px`;
    bit.style.width = index % 3 === 0 ? "14px" : "8px";
    bit.style.height = index % 3 === 0 ? "8px" : "16px";
    bit.style.background = COLORS[index % COLORS.length];
    bit.style.borderRadius = index % 5 === 0 ? "999px" : "2px";
    host.appendChild(bit);
    bit.animate(
      [
        { transform: "translate(-50%, -50%) scale(0.4)", opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist + 40}px)) rotate(${index * 24}deg)`, opacity: 0 },
      ],
      { duration: 900 + (index % 4) * 80, easing: "cubic-bezier(0.16, 0.7, 0.2, 1)", fill: "forwards" },
    );
  }
  document.body.appendChild(host);
  window.setTimeout(() => host.remove(), 1600);
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    burstFrom(event.currentTarget);
    setSent(String(data.get("name") || "").trim());
  }
  if (sent) {
    return <p className="fl-word m-0 font-[family-name:var(--font-display)] text-4xl leading-none font-extrabold tracking-[-0.05em] text-[#ffe14a]">You are in the burst, {sent}.</p>;
  }
  return (
    <form className="grid max-w-md gap-3" onSubmit={submit}>
      <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#ffe14a] uppercase">Tell us you are coming</p>
      <label className="grid gap-1 text-sm">
        Your name
        <input name="name" required placeholder="Your name" className="min-h-12 border border-white/20 bg-transparent px-3 text-base text-white" />
      </label>
      <label className="grid gap-1 text-sm">
        Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-white/20 bg-[#141414] px-3 text-base text-white">
          <option>Friday</option>
          <option>Saturday</option>
          <option>Already at the lake</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        A note for supper
        <textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-white/20 bg-transparent px-3 py-2 text-base text-white" />
      </label>
      <button type="submit" className="mt-2 min-h-12 cursor-pointer border-0 bg-[#ff4d3a] px-5 text-base font-semibold text-white">
        Count me in
      </button>
    </form>
  );
}
