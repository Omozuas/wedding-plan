"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { starfallDay as day } from "./starfall-day";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
};

type Rocket = {
  x: number;
  y: number;
  ty: number;
  vy: number;
  color: string;
  count: number;
};

type Glow = { x: number; y: number; color: string; life: number; max: number };

const SALVOS = [
  { at: 700, x: 0.24, y: 0.3, color: "#ffcf70", count: 78 },
  { at: 1700, x: 0.76, y: 0.26, color: "#d7f6ff", count: 70 },
  { at: 2800, x: 0.5, y: 0.2, color: "#ff5a7a", count: 88 },
  { at: 4000, x: 0.32, y: 0.28, color: "#ffcf70", count: 60 },
  { at: 4300, x: 0.68, y: 0.32, color: "#9ecbff", count: 60 },
  { at: 5600, x: 0.5, y: 0.18, color: "#fff1c4", count: 130 },
  { at: 6100, x: 0.36, y: 0.34, color: "#ff5a7a", count: 48 },
  { at: 6400, x: 0.64, y: 0.3, color: "#ffcf70", count: 48 },
];

function runSky(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  return paintSky(canvas, ctx);
}

function paintSky(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  let raf = 0;
  let step = 0;
  let running = true;
  const sparks: Spark[] = [];
  const rockets: Rocket[] = [];
  const glows: Glow[] = [];
  const launched = new Set<number>();
  const start = performance.now();

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, canvas.clientWidth) * dpr;
    canvas.height = Math.max(1, canvas.clientHeight) * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  function burst(x: number, y: number, color: string, count: number) {
    glows.push({ x, y, color, life: 0, max: 28 });
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.15;
      const speed = 1.1 + Math.random() * (count > 100 ? 4.2 : 3.1);
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        max: 78 + Math.random() * 56,
        color: i % 6 === 0 ? "#fffaf0" : color,
        size: 1.1 + Math.random() * 1.7,
      });
    }
  }

  function tick(now: number) {
    if (!running) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const t = now - start;
    ctx.clearRect(0, 0, w, h);

    SALVOS.forEach((salvo, index) => {
      if (t < salvo.at || launched.has(index)) return;
      launched.add(index);
      canvas.dataset.bursts = String(launched.size);
      const target = salvo.y * h;
      rockets.push({
        x: salvo.x * w,
        y: h * 0.9,
        ty: target,
        vy: (target - h * 0.9) / 42,
        color: salvo.color,
        count: salvo.count,
      });
    });

    for (let i = rockets.length - 1; i >= 0; i -= 1) {
      const rocket = rockets[i];
      rocket.y += rocket.vy;
      if (step % 2 === 0) {
        sparks.push({
          x: rocket.x,
          y: rocket.y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: 1.4,
          life: 0,
          max: 14,
          color: rocket.color,
          size: 1.5,
        });
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = rocket.color;
      ctx.beginPath();
      ctx.arc(rocket.x, rocket.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      if (rocket.y <= rocket.ty) {
        burst(rocket.x, rocket.y, rocket.color, rocket.count);
        rockets.splice(i, 1);
      }
    }

    const horizon = h * 0.78;
    for (let i = glows.length - 1; i >= 0; i -= 1) {
      const glow = glows[i];
      glow.life += 1;
      const fade = 1 - glow.life / glow.max;
      if (fade <= 0) {
        glows.splice(i, 1);
        continue;
      }
      const radius = 40 + glow.life * 4;
      const paint = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, radius);
      paint.addColorStop(0, glow.color);
      paint.addColorStop(1, "transparent");
      ctx.globalAlpha = fade * 0.55;
      ctx.fillStyle = paint;
      ctx.beginPath();
      ctx.arc(glow.x, glow.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = sparks.length - 1; i >= 0; i -= 1) {
      const spark = sparks[i];
      spark.life += 1;
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vy += 0.026;
      spark.vx *= 0.992;
      spark.vy *= 0.992;
      const fade = 1 - spark.life / spark.max;
      if (fade <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = fade;
      ctx.strokeStyle = spark.color;
      ctx.lineWidth = spark.size;
      ctx.beginPath();
      ctx.moveTo(spark.x, spark.y);
      ctx.lineTo(spark.x - spark.vx * 3.2, spark.y - spark.vy * 3.2);
      ctx.stroke();
      if (spark.y < horizon) {
        const reflected = horizon + (horizon - spark.y) * 0.28;
        ctx.globalAlpha = fade * 0.16;
        ctx.beginPath();
        ctx.moveTo(spark.x, reflected);
        ctx.lineTo(spark.x - spark.vx * 2, reflected + spark.vy * 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    if (sparks.length > 520) sparks.splice(0, sparks.length - 520);
    canvas.dataset.sparks = String(sparks.length);
    step += 1;
    raf = requestAnimationFrame(tick);
  }

  raf = requestAnimationFrame(tick);
  return () => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}

export function Starfall() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-hidden bg-[#07091c] text-[#f4f7ff]">
      <style>{`
        .sf-sky { opacity: 1; transition: opacity 1.15s ease; }
        .sf-sky.is-leaving { opacity: 0; }
        .sf-photo { filter: brightness(0.28) saturate(0.8); transform: scale(1.08); transition: filter 2.4s ease, transform 8s ease; }
        .sf-sky.is-lit .sf-photo { filter: brightness(0.62) saturate(1); transform: scale(1); }
        .sf-kicker, .sf-name, .sf-when { opacity: 0; animation: sf-in 1.25s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .sf-name { animation-delay: 2.5s; }
        .sf-name-2 { animation-delay: 3.15s; }
        .sf-when { animation-delay: 5.5s; }
        .sf-kicker { animation-delay: 0.45s; }
        .sf-ring, .sf-ring-2 {
          position: absolute; left: 50%; top: 24%;
          width: 7rem; height: 7rem; border-radius: 999px;
          border: 1px solid rgba(255, 207, 112, 0.75);
          opacity: 0;
          animation: sf-ring 1.8s ease both;
        }
        .sf-ring { animation-delay: 5.5s; }
        .sf-ring-2 { animation-delay: 5.85s; border-color: rgba(255, 90, 122, 0.65); }
        .sf-rise { opacity: 0; transform: translateY(36px); }
        .sf-rise.is-in { animation: sf-in 1.15s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .sf-drift { animation: sf-drift 22s ease-in-out infinite alternate; }
        .sf-zoom { transform: scale(1.12); }
        .sf-rise.is-in .sf-zoom { animation: sf-zoom 8s ease forwards; }
        .sf-hour { opacity: 0; transform: translateX(-28px); }
        .sf-rise.is-in .sf-hour { animation: sf-slide 0.95s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .sf-line { animation: sf-in 0.9s ease both; }
        .sf-marquee { animation: sf-marquee 28s linear infinite; }
        @keyframes sf-in { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
        @keyframes sf-slide { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: none; } }
        @keyframes sf-ring { from { opacity: 0.85; transform: translate(-50%, -50%) scale(0.2); } to { opacity: 0; transform: translate(-50%, -50%) scale(9); } }
        @keyframes sf-drift { from { transform: scale(1.08) translate3d(0, 0, 0); } to { transform: scale(1.16) translate3d(0, -2%, 0); } }
        @keyframes sf-zoom { to { transform: scale(1); } }
        @keyframes sf-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .sf-kicker, .sf-name, .sf-when, .sf-rise, .sf-line, .sf-hour { animation: none; opacity: 1; transform: none; }
          .sf-drift, .sf-marquee, .sf-ring, .sf-ring-2 { animation: none; }
          .sf-photo { filter: brightness(0.7); transform: none; }
        }
      `}</style>
      {!open && <Sky onDone={() => setOpen(true)} />}
      <Night live={open} />
    </div>
  );
}

function Sky({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  const [lit, setLit] = useState(false);
  finish.current = onDone;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stop = () => {};
    let litTimer = 0;
    let leaveTimer = 0;
    let doneTimer = 0;
    if (reduce) {
      doneTimer = window.setTimeout(() => finish.current(), 500);
    } else {
      const canvas = canvasRef.current;
      if (canvas) stop = runSky(canvas);
      litTimer = window.setTimeout(() => setLit(true), 5400);
      leaveTimer = window.setTimeout(() => setLeaving(true), 8400);
      doneTimer = window.setTimeout(() => finish.current(), 9700);
    }
    return () => {
      stop();
      window.clearTimeout(litTimer);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = previous;
    };
  }, []);

  function skip() {
    setLeaving(true);
    window.setTimeout(() => finish.current(), 280);
  }

  return (
    <section
      className={`sf-sky fixed inset-0 z-50 overflow-hidden bg-[#05060f] ${leaving ? "is-leaving" : ""} ${lit ? "is-lit" : ""}`}
      aria-label="Fireworks over the bay"
    >
      <img src="/photos/couple.jpg" alt="" className="sf-photo absolute inset-0 size-full object-cover object-[center_30%]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#05060f_0%,rgba(5,6,15,0.2)_42%,rgba(5,6,15,0.55)_100%)]" />
      <canvas ref={canvasRef} data-bursts="0" className="absolute inset-0 size-full" aria-hidden="true" />
      <span className="sf-ring" />
      <span className="sf-ring-2" />
      <div className="absolute inset-x-0 bottom-0 px-6 pb-16 sm:px-12">
        <p className="sf-kicker m-0 text-[0.68rem] tracking-[0.42em] text-[#ffcf70] uppercase">Muskoka · after dark</p>
        <p className="sf-name m-0 mt-3 max-w-full font-[family-name:var(--font-display)] text-[clamp(2.8rem,11vw,8rem)] leading-[0.82] font-extrabold tracking-[-0.06em] text-white [text-shadow:0_10px_40px_rgba(0,0,0,0.45)]">
          Claire
        </p>
        <p className="sf-name sf-name-2 m-0 max-w-full font-[family-name:var(--font-display)] text-[clamp(2.8rem,11vw,8rem)] leading-[0.82] font-extrabold tracking-[-0.06em] text-[#ffcf70] [text-shadow:0_10px_40px_rgba(0,0,0,0.45)]">
          Thomas
        </p>
        <p className="sf-when m-0 mt-5 max-w-md text-lg text-white/85">
          {day.time} · {day.shortDate}
          <span className="mt-1 block text-white/65">{day.venue}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={skip}
        className="absolute top-5 right-5 cursor-pointer border border-white/30 bg-transparent px-4 py-2 text-[0.68rem] tracking-[0.22em] text-white uppercase"
      >
        Skip
      </button>
    </section>
  );
}

function Night({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="relative h-dvh min-h-[36rem] overflow-hidden">
        <img src="/photos/walk.jpg" alt="Claire and Thomas beside the lake" className="sf-drift absolute inset-0 size-full object-cover object-[center_35%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07091c] via-[#07091c]/25 to-[#07091c]/40" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-12 sm:px-12">
          <p className="m-0 text-[0.68rem] tracking-[0.36em] text-[#ffcf70] uppercase">Starfall · Lake Rosseau</p>
          <h1 className="m-0 mt-3 max-w-[12ch] font-[family-name:var(--font-display)] text-[clamp(3.4rem,10vw,6.4rem)] leading-[0.86] font-extrabold tracking-[-0.05em]">
            {day.bride}
          </h1>
          <p className="m-0 font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,3.4rem)] leading-none font-extrabold tracking-[-0.04em] text-white/80">
            {day.groom}
          </p>
        </div>
      </section>
      <div className="overflow-hidden border-y border-white/10 py-3">
        <p className="sf-marquee m-0 w-max text-xs tracking-[0.34em] text-[#ffcf70] uppercase">
          {`${day.place} · ${day.shortDate} · ${day.venue} · `.repeat(4)}
        </p>
      </div>
      <section className="grid items-end gap-10 px-6 py-20 sm:px-12 lg:grid-cols-[1.1fr_0.9fr]">
        <Rise live={live}>
          <p className="m-0 max-w-[16ch] font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,4.2rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
            {day.arrival}
          </p>
        </Rise>
        <Rise live={live}>
          <p className="m-0 text-lg leading-relaxed text-white/75">
            {day.dateLabel}. {day.time}, {day.venue}. {day.address}.
          </p>
          <Lines live={live} />
        </Rise>
      </section>
      <section className="grid gap-4 px-6 sm:px-12 md:grid-cols-2">
        <Rise live={live} className="overflow-hidden">
          <img src="/photos/bouquet.jpg" alt="The bouquet" className="sf-zoom aspect-[4/5] w-full object-cover" />
        </Rise>
        <Rise live={live} className="overflow-hidden">
          <img src="/photos/rings.jpg" alt="The rings" className="sf-zoom aspect-[4/5] w-full object-cover" />
        </Rise>
      </section>
      <Rise live={live} className="px-6 py-20 sm:px-12">
        <p className="m-0 text-[0.68rem] tracking-[0.32em] text-[#ffcf70] uppercase">The evening</p>
        <div className="mt-8 grid gap-10">
          {day.hours.map((hour, index) => (
            <article key={hour.time} className="sf-hour grid items-baseline gap-3 border-t border-white/15 pt-6 md:grid-cols-[7rem_1fr]" style={{ animationDelay: `${index * 0.14}s` }}>
              <p className="m-0 font-[family-name:var(--font-display)] text-4xl font-extrabold text-[#ffcf70]">{hour.time}</p>
              <div>
                <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-[-0.04em]">{hour.title}</h2>
                <p className="m-0 mt-2 max-w-lg text-lg text-white/70">{hour.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </Rise>
      <section className="grid items-center gap-8 bg-[#ffcf70] px-6 py-16 text-[#14110c] sm:px-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Rise live={live}>
          <img src="/photos/dress.jpg" alt="The table at the boathouse" className="aspect-[4/5] w-full object-cover" />
        </Rise>
        <Rise live={live}>
          <h2 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.4rem,5vw,4rem)] leading-none font-extrabold tracking-[-0.04em]">Stay through Sunday.</h2>
          <p className="m-0 mt-4 max-w-md text-lg leading-relaxed">{day.dress}</p>
          <ul className="m-0 mt-6 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="mt-4 border-t border-[#14110c]/15 pt-3">
                <p className="m-0 font-semibold">{stay.name}</p>
                <p className="m-0 mt-1 text-[#14110c]/75">{stay.detail}</p>
              </li>
            ))}
          </ul>
          <Reply />
        </Rise>
      </section>
    </div>
  );
}

function Lines({ live }: { live: boolean }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setIndex((value) => (value + 1) % day.dock.length), 3400);
    return () => window.clearInterval(id);
  }, [live]);
  return (
    <p key={index} className="sf-line m-0 mt-8 max-w-md font-[family-name:var(--font-display)] text-2xl leading-snug font-extrabold tracking-[-0.03em] text-[#ffcf70]">
      {day.dock[index]}
    </p>
  );
}

function Rise({ live, children, className = "" }: { live: boolean; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!live) return;
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOn(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setOn(true);
      },
      { threshold: 0.22 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [live]);
  return (
    <div ref={ref} className={`sf-rise ${on ? "is-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSent(String(data.get("name") || "").trim());
  }
  if (sent) {
    return <p className="sf-line m-0 mt-8 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-[-0.04em]">The sky will know you, {sent}.</p>;
  }
  return (
    <form className="mt-8 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm font-medium">
        Your name
        <input name="name" required placeholder="Your name" className="min-h-12 border border-[#14110c]/20 bg-white/50 px-3 text-base" />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#14110c]/20 bg-[#ffcf70] px-3 text-base">
          <option>Friday</option>
          <option>Saturday</option>
          <option>Already at the lake</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium">
        A note for supper
        <textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#14110c]/20 bg-white/50 px-3 py-2 text-base" />
      </label>
      <button type="submit" className="mt-2 min-h-12 cursor-pointer border-0 bg-[#14110c] px-5 text-base text-[#ffcf70]">
        Hold my place
      </button>
    </form>
  );
}
