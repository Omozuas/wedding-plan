"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { ivoryDay, type BirthdayDay, type BirthdayPhoto } from "@/templates/birthday/ivory-day";

function themeVars(colors: BirthdayDay["colors"]): CSSProperties {
  return {
    ["--b-bg" as string]: colors.bg,
    ["--b-ink" as string]: colors.ink,
    ["--b-muted" as string]: colors.muted,
    ["--b-accent" as string]: colors.accent,
    ["--b-accent-alt" as string]: colors.accentAlt,
    ["--b-surface" as string]: colors.surface,
    ["--b-surface-alt" as string]: colors.surfaceAlt,
    ["--b-on-accent" as string]: colors.onAccent,
  };
}

function useFadeIndex(live: boolean, total: number, intervalMs = 3800) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!live || total < 2) return;
    const id = window.setInterval(() => setIndex((c) => (c + 1) % total), intervalMs);
    return () => window.clearInterval(id);
  }, [live, total, intervalMs]);
  return index;
}

function Countdown({ targetISO, live }: { targetISO: string; live: boolean }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (!live) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [live]);

  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const diff = now == null ? 0 : Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const parts = [
    { label: "Days", value: now == null ? "--" : String(days).padStart(2, "0") },
    { label: "Hours", value: now == null ? "--" : String(hours).padStart(2, "0") },
    { label: "Mins", value: now == null ? "--" : String(mins).padStart(2, "0") },
    { label: "Secs", value: now == null ? "--" : String(secs).padStart(2, "0") },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 md:gap-5">
      {parts.map((part) => (
        <div
          key={part.label}
          className="border border-[color-mix(in_srgb,var(--b-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--b-surface)_80%,transparent)] px-2 py-4 text-center md:px-4"
        >
          <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(1.6rem,6vw,2.8rem)] leading-none text-[var(--b-accent)]">
            {part.value}
          </p>
          <p className="m-0 mt-2 text-[0.62rem] tracking-[0.22em] text-[var(--b-muted)] uppercase">{part.label}</p>
        </div>
      ))}
    </div>
  );
}

function Rise({ live, children, className = "" }: { live: boolean; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!live) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true);
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [live]);
  return (
    <div ref={ref} className={`iv-rise ${inView ? "is-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

function PhotoFade({
  photos,
  live,
  className = "",
  opacityClass = "",
  max = 5,
}: {
  photos: BirthdayPhoto[];
  live: boolean;
  className?: string;
  opacityClass?: string;
  max?: number;
}) {
  const slides = photos.slice(0, max);
  const index = useFadeIndex(live, slides.length);
  return (
    <div className={`absolute inset-0 ${opacityClass}`} aria-hidden>
      {slides.map((photo, i) => (
        <img
          key={photo.src}
          src={photo.src}
          alt=""
          className={`iv-fade absolute inset-0 size-full object-cover ${className} ${i === index ? "is-active" : ""}`}
          style={{ objectPosition: photo.focus ?? "center 18%" }}
        />
      ))}
    </div>
  );
}

export function Ivory({
  day = ivoryDay,
  onBegin,
}: {
  day?: BirthdayDay;
  onBegin?: () => void;
}) {
  const [begun, setBegun] = useState(false);

  return (
    <div className="overflow-x-clip bg-[var(--b-bg)] text-[var(--b-ink)]" style={themeVars(day.colors)}>
      <style>{`
        .iv-fade { opacity: 0; transition: opacity 0.7s ease; }
        .iv-fade.is-active { opacity: 1; }
        .iv-rise { opacity: 0; transform: translateY(28px); }
        .iv-rise.is-in { animation: iv-in 0.95s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        @keyframes iv-in { to { opacity: 1; transform: none; } }
        .iv-gold-rule {
          height: 1px; width: 4.5rem;
          background: linear-gradient(90deg, transparent, var(--b-accent), transparent);
        }
        .iv-scroll-cue {
          animation: iv-cue 1.8s ease-in-out infinite;
        }
        @keyframes iv-cue {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        .iv-marquee {
          animation: iv-marquee 28s linear infinite;
        }
        @keyframes iv-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .iv-shot {
          transition: transform 0.55s cubic-bezier(0.16, 0.84, 0.3, 1), filter 0.45s ease;
        }
        .iv-shot:hover { transform: scale(1.03) rotate(0deg) !important; filter: saturate(1.08) contrast(1.04); }
        .iv-scene-text {
          transition: opacity 0.45s ease, transform 0.55s cubic-bezier(0.16, 0.84, 0.3, 1);
        }
        .iv-scene-text.is-on { opacity: 1; transform: none; }
        .iv-scene-text.is-off { opacity: 0; transform: translateY(18px); pointer-events: none; }
        .iv-fx { pointer-events: none; position: absolute; inset: 0; z-index: 4; overflow: hidden; }
        .iv-confetti {
          position: absolute; top: -12%; width: 8px; height: 12px; border-radius: 2px; opacity: 0.85;
          animation: iv-fall linear infinite;
        }
        .iv-spark {
          position: absolute; width: 6px; height: 6px; border-radius: 999px;
          background: radial-gradient(circle, #fff7df 0%, var(--b-accent) 55%, transparent 70%);
          animation: iv-twinkle ease-in-out infinite;
        }
        .iv-balloon {
          position: absolute; bottom: -18%; width: 22px; height: 28px; border-radius: 50% 50% 48% 48%;
          animation: iv-float-up linear infinite;
        }
        .iv-balloon::after {
          content: ""; position: absolute; left: 50%; top: 100%; width: 1px; height: 34px;
          background: color-mix(in srgb, var(--b-ink) 45%, transparent); transform: translateX(-50%);
        }
        @keyframes iv-fall {
          0% { transform: translate3d(0,-10vh,0) rotate(0deg); opacity: 0; }
          12% { opacity: 0.9; }
          100% { transform: translate3d(18px, 110vh, 0) rotate(420deg); opacity: 0.15; }
        }
        @keyframes iv-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        @keyframes iv-float-up {
          0% { transform: translate3d(0, 0, 0) scale(0.85); opacity: 0; }
          15% { opacity: 0.8; }
          100% { transform: translate3d(-12px, -120vh, 0) scale(1); opacity: 0; }
        }
        @media (max-width: 767px) {
          .iv-mobile-cover { object-position: center 16% !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .iv-fade, .iv-rise, .iv-scroll-cue, .iv-marquee, .iv-scene-text, .iv-confetti, .iv-spark, .iv-balloon { animation: none !important; transition: none !important; }
          .iv-rise, .iv-scene-text.is-on, .iv-fade.is-active { opacity: 1; transform: none; }
          .iv-fx { display: none; }
        }
      `}</style>

      {!begun && (
        <Seal
          day={day}
          onOpen={() => {
            onBegin?.();
            setBegun(true);
          }}
        />
      )}
      {begun && (
        <>
          <ScrollIntro day={day} />
          <Celebration day={day} live />
        </>
      )}
    </div>
  );
}

const CONFETTI = [
  { left: "8%", delay: "0s", duration: "7.5s", color: "#d4b57a" },
  { left: "18%", delay: "1.1s", duration: "8.2s", color: "#f3e2b8" },
  { left: "28%", delay: "0.4s", duration: "6.8s", color: "#e8c98a" },
  { left: "40%", delay: "2s", duration: "9s", color: "#fff1cf" },
  { left: "52%", delay: "0.8s", duration: "7.1s", color: "#c9a05a" },
  { left: "63%", delay: "1.6s", duration: "8.6s", color: "#d4b57a" },
  { left: "74%", delay: "0.2s", duration: "7.8s", color: "#f7e7c6" },
  { left: "84%", delay: "2.4s", duration: "9.4s", color: "#e0bc74" },
  { left: "12%", delay: "3s", duration: "8s", color: "#fff7df" },
  { left: "91%", delay: "1.3s", duration: "6.9s", color: "#d4b57a" },
  { left: "35%", delay: "2.8s", duration: "8.8s", color: "#c9a05a" },
  { left: "58%", delay: "0.6s", duration: "7.4s", color: "#f3e2b8" },
];

const SPARKS = [
  { left: "14%", top: "18%", delay: "0s" },
  { left: "72%", top: "22%", delay: "0.7s" },
  { left: "48%", top: "12%", delay: "1.4s" },
  { left: "82%", top: "38%", delay: "0.3s" },
  { left: "22%", top: "42%", delay: "1.1s" },
  { left: "66%", top: "48%", delay: "1.8s" },
];

const BALLOONS = [
  { left: "10%", delay: "0s", duration: "11s", color: "#d4b57a" },
  { left: "78%", delay: "2.2s", duration: "12.5s", color: "#f3e2b8" },
  { left: "42%", delay: "4s", duration: "13s", color: "#c9a05a" },
  { left: "88%", delay: "1s", duration: "10.5s", color: "#e8c98a" },
];

function CelebrateFX() {
  return (
    <div className="iv-fx" aria-hidden>
      {CONFETTI.map((bit, i) => (
        <span
          key={`c-${i}`}
          className="iv-confetti"
          style={{
            left: bit.left,
            background: bit.color,
            animationDelay: bit.delay,
            animationDuration: bit.duration,
          }}
        />
      ))}
      {SPARKS.map((spark, i) => (
        <span
          key={`s-${i}`}
          className="iv-spark"
          style={{ left: spark.left, top: spark.top, animationDelay: spark.delay, animationDuration: "2.4s" }}
        />
      ))}
      {BALLOONS.map((balloon, i) => (
        <span
          key={`b-${i}`}
          className="iv-balloon"
          style={{
            left: balloon.left,
            background: `linear-gradient(160deg, ${balloon.color}, color-mix(in srgb, ${balloon.color} 55%, #8a6a3a))`,
            animationDelay: balloon.delay,
            animationDuration: balloon.duration,
          }}
        />
      ))}
    </div>
  );
}

function Seal({ day, onOpen }: { day: BirthdayDay; onOpen: () => void }) {
  return (
    <section className="fixed inset-0 z-50 grid min-h-[100dvh] place-items-center overflow-hidden bg-[var(--b-bg)]">
      <PhotoFade photos={day.photos} live max={4} opacityClass="opacity-50" className="iv-mobile-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--b-bg)] via-[color-mix(in_srgb,var(--b-bg)_55%,transparent)] to-[color-mix(in_srgb,var(--b-bg)_35%,transparent)]" />
      <CelebrateFX />
      <button
        type="button"
        onClick={onOpen}
        className="relative z-[2] mx-6 flex max-w-lg flex-col items-center gap-4 text-center"
      >
        <p className="m-0 text-[0.68rem] tracking-[0.34em] text-[var(--b-accent)] uppercase">{day.ui.introKicker}</p>
        <p className="m-0 max-w-[16ch] font-[family-name:var(--font-serif)] text-[clamp(1.9rem,6.5vw,3.8rem)] leading-[1.02] font-medium">
          {day.shortName}
          <span className="mt-2 block text-[var(--b-accent)]">at {day.age}</span>
        </p>
        <div className="iv-gold-rule" />
        <p className="m-0 text-[0.72rem] tracking-[0.22em] text-[var(--b-muted)] uppercase">{day.ui.openHint}</p>
        <span className="mt-1 border border-[color-mix(in_srgb,var(--b-accent)_55%,transparent)] bg-[color-mix(in_srgb,var(--b-accent)_16%,transparent)] px-8 py-3 text-[0.72rem] tracking-[0.28em] uppercase">
          Open
        </span>
      </button>
    </section>
  );
}

/** Sticky scroll welcome: images + copy change as the user scrolls. */
function ScrollIntro({ day }: { day: BirthdayDay }) {
  const trackRef = useRef<HTMLElement>(null);
  const scenes = day.introScenes;
  const sceneCount = scenes.length;
  const [progress, setProgress] = useState(0);
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(1);
      setScene(sceneCount - 1);
      return;
    }

    let frame = 0;
    function update() {
      frame = 0;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const raw = total <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / total));
      setProgress(raw);
      const idx = Math.min(sceneCount - 1, Math.floor(raw * sceneCount + 0.001));
      setScene(idx);
    }

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sceneCount]);

  function skipToEnd() {
    const el = trackRef.current;
    if (!el) return;
    const top = el.offsetTop + el.offsetHeight - window.innerHeight + 8;
    window.scrollTo({ top, behavior: "smooth" });
  }

  const photos = day.photos.slice(0, Math.max(sceneCount, 5));

  return (
    <section
      ref={trackRef}
      className="relative"
      style={{ height: `${sceneCount * 100}vh` }}
      aria-label={`Scroll welcome for ${day.name}`}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-[var(--b-bg)]">
        <div className="absolute inset-0">
          {photos.map((photo, i) => {
            const active = i === Math.min(scene, photos.length - 1);
            return (
              <img
                key={photo.src}
                src={photo.src}
                alt=""
                className={`iv-mobile-cover absolute inset-0 size-full object-cover transition-[opacity,transform] duration-700 ease-out ${
                  active ? "scale-100 opacity-100" : "scale-105 opacity-0"
                }`}
                style={{ objectPosition: photo.focus ?? "center 18%" }}
              />
            );
          })}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--b-bg)] via-[color-mix(in_srgb,var(--b-bg)_50%,transparent)] to-[color-mix(in_srgb,var(--b-bg)_42%,transparent)]" />
        <CelebrateFX />

        <div
          className="absolute top-0 left-0 z-[8] h-1 bg-[var(--b-accent)] transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
          aria-hidden
        />

        <div className="absolute top-5 left-5 z-[6] flex items-center gap-2">
          <p className="m-0 border border-[color-mix(in_srgb,var(--b-accent)_40%,transparent)] bg-black/35 px-3 py-1.5 text-[0.65rem] tracking-[0.24em] text-[var(--b-accent)] uppercase">
            {day.ui.welcome}
          </p>
          <p className="m-0 text-[0.62rem] tracking-[0.18em] text-[var(--b-muted)] uppercase">
            {scene + 1}/{sceneCount}
          </p>
        </div>
        <button
          type="button"
          onClick={skipToEnd}
          className="absolute top-5 right-5 z-[6] cursor-pointer border border-[color-mix(in_srgb,var(--b-accent)_45%,transparent)] bg-black/40 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase"
        >
          {day.ui.skip}
        </button>

        <div className="absolute inset-x-0 bottom-0 z-[5] px-6 pb-24 pt-24 md:px-14 md:pb-28">
          {scenes.map((item, i) => (
            <div
              key={item.title}
              className={`iv-scene-text absolute inset-x-6 bottom-24 max-w-3xl md:inset-x-14 md:bottom-28 ${
                i === scene ? "is-on" : "is-off"
              }`}
            >
              <p className="m-0 text-[0.68rem] tracking-[0.32em] text-[var(--b-accent)] uppercase">{item.kicker}</p>
              <h2 className="m-0 mt-3 font-[family-name:var(--font-serif)] text-[clamp(2.4rem,8vw,4.8rem)] leading-[0.92] font-medium">
                {item.title}
                <span className="mt-1 block text-[var(--b-accent)]">{item.accent}</span>
              </h2>
              <p className="m-0 mt-5 max-w-xl text-[clamp(1rem,2.8vw,1.25rem)] leading-relaxed text-[color-mix(in_srgb,var(--b-ink)_88%,transparent)]">
                {item.body}
              </p>
              {i === scene ? (
                <p className="iv-scroll-cue m-0 mt-6 flex items-center gap-3 text-[0.62rem] tracking-[0.22em] text-[color-mix(in_srgb,var(--b-ink)_72%,transparent)] uppercase">
                  <span className="block h-px w-8 bg-[var(--b-accent)]" aria-hidden />
                  {progress > 0.92 ? day.ui.welcomeFoot : "Scroll to continue"}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GenZGallery({
  photos,
  live,
  shortName,
}: {
  photos: BirthdayPhoto[];
  live: boolean;
  shortName: string;
}) {
  const layouts = [
    "md:col-span-2 md:row-span-2 aspect-[3/4] md:aspect-auto md:min-h-[28rem] -rotate-1",
    "aspect-[4/5] rotate-2",
    "aspect-square -rotate-2",
    "md:col-span-2 aspect-[16/10] rotate-1",
    "aspect-[3/4] -rotate-1",
    "aspect-[4/5] rotate-2",
    "aspect-square rotate-1",
    "md:col-span-2 aspect-[5/4] -rotate-1",
  ];
  const stickers = ["featured", "icon", "blessed", "80", "grace", "glow", "joy", "queen"];

  return (
    <section className="overflow-hidden bg-[var(--b-bg)] px-4 py-16 md:px-10 md:py-20">
      <div className="mb-8 overflow-hidden border-y border-[color-mix(in_srgb,var(--b-accent)_30%,transparent)] py-3">
        <p className="iv-marquee m-0 flex w-max gap-10 text-[0.78rem] tracking-[0.28em] text-[var(--b-accent)] uppercase">
          {Array.from({ length: 2 }).map((_, loop) => (
            <span key={loop} className="flex gap-10">
              {`80 · Grace · Blessed · White & Gold · ${shortName} · Faithful · `.repeat(3)}
            </span>
          ))}
        </p>
      </div>

      <Rise live={live}>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 px-1">
          <div>
            <p className="m-0 text-[0.68rem] tracking-[0.32em] text-[var(--b-accent)] uppercase">The feed</p>
            <h2 className="m-0 mt-2 font-[family-name:var(--font-serif)] text-[clamp(2rem,6vw,3.4rem)] leading-none">
              Moments of <span className="text-[var(--b-accent)]">Grace</span>
            </h2>
          </div>
          <p className="m-0 max-w-xs text-sm leading-relaxed text-[var(--b-muted)]">
            Tap in. Scroll the vibes. Eight looks, one legend.
          </p>
        </div>
      </Rise>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {photos.map((photo, index) => (
          <Rise live={live} key={photo.src} className={layouts[index] ?? "aspect-[4/5]"}>
            <figure className="iv-shot relative h-full overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--b-accent)_25%,transparent)] bg-[var(--b-surface)] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
              <img
                src={photo.src}
                alt={photo.alt ?? ""}
                className="iv-mobile-cover absolute inset-0 size-full object-cover"
                style={{ objectPosition: photo.focus }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 rounded-full bg-[var(--b-accent)] px-2.5 py-1 text-[0.58rem] font-medium tracking-[0.16em] text-[var(--b-on-accent)] uppercase">
                {stickers[index] ?? "shot"}
              </span>
              {index === 0 ? (
                <figcaption className="absolute right-3 bottom-3 left-3 font-[family-name:var(--font-serif)] text-xl text-[var(--b-ink)] md:text-2xl">
                  The one we had to feature
                </figcaption>
              ) : null}
            </figure>
          </Rise>
        ))}
      </div>

      <div className="mt-8 flex gap-3 overflow-x-auto pb-2 md:hidden">
        {photos.slice(0, 5).map((photo) => (
          <img
            key={`strip-${photo.src}`}
            src={photo.src}
            alt=""
            className="h-28 w-24 shrink-0 rounded-xl object-cover"
            style={{ objectPosition: photo.focus }}
          />
        ))}
      </div>
    </section>
  );
}

function Celebration({ day, live }: { day: BirthdayDay; live: boolean }) {
  const [sent, setSent] = useState<string | null>(null);
  const featured = day.photos[0];

  function onRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "Friend").trim() || "Friend";
    setSent(day.ui.rsvpSuccess.replace("{name}", name));
    event.currentTarget.reset();
  }

  return (
    <div>
      <section className="relative grid min-h-[100dvh] items-end overflow-hidden px-5 pb-14 pt-24 md:px-14 md:pb-16">
        <PhotoFade photos={day.photos} live={live} max={4} opacityClass="opacity-45" className="iv-mobile-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--b-surface)] via-[color-mix(in_srgb,var(--b-bg)_70%,transparent)] to-[color-mix(in_srgb,var(--b-bg)_40%,transparent)]" />
        <div className="relative z-[2] w-full max-w-4xl">
          <p className="m-0 text-[0.68rem] tracking-[0.34em] text-[var(--b-accent)] uppercase">{day.place}</p>
          <h1 className="m-0 mt-3 max-w-[16ch] font-[family-name:var(--font-serif)] text-[clamp(2.1rem,9vw,5.2rem)] leading-[1.02] font-medium">
            {day.shortName}
            <span className="mt-1 block text-[var(--b-accent)]">turns {day.age}</span>
          </h1>
          <p className="m-0 mt-5 max-w-2xl font-[family-name:var(--font-serif)] text-[clamp(1.25rem,3.5vw,2rem)] italic leading-snug">
            {day.headline}
          </p>
          <p className="m-0 mt-4 text-[var(--b-muted)]">
            {day.dateLabel} · Church 10am · Reception 12pm
          </p>
        </div>
      </section>

      <section className="bg-[var(--b-surface)] px-5 py-16 md:px-14">
        <Rise live={live}>
          <p className="m-0 text-center text-[0.68rem] tracking-[0.32em] text-[var(--b-accent)] uppercase">Until the day</p>
          <div className="mx-auto mt-8 max-w-3xl">
            <Countdown targetISO={day.dateISO} live={live} />
          </div>
        </Rise>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 bg-[var(--b-bg)] px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-10">
        <Rise live={live}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--b-accent)_28%,transparent)]">
            <img
              src={featured.src}
              alt={featured.alt ?? day.name}
              className="iv-mobile-cover size-full object-cover"
              style={{ objectPosition: featured.focus }}
            />
          </div>
        </Rise>
        <Rise live={live}>
          <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[var(--b-accent)] uppercase">Her story</p>
          <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-[clamp(1.6rem,3vw,2.4rem)] leading-snug italic">
            {day.message}
          </p>
          <p className="m-0 mt-6 text-lg leading-relaxed text-[var(--b-muted)]">{day.milestone}</p>
          <ul className="m-0 mt-8 flex list-none flex-wrap gap-2 p-0">
            {day.words.map((word) => (
              <li
                key={word}
                className="rounded-full border border-[color-mix(in_srgb,var(--b-accent)_40%,transparent)] px-3 py-1.5 text-[0.68rem] tracking-[0.18em] text-[var(--b-accent)] uppercase"
              >
                {word}
              </li>
            ))}
          </ul>
          <p className="m-0 mt-5 text-[var(--b-muted)]">{day.about}</p>
        </Rise>
      </section>

      <section className="bg-[var(--b-surface-alt)] px-5 py-16 text-[var(--b-ink)] md:px-14">
        <Rise live={live}>
          <p className="m-0 text-[0.68rem] tracking-[0.32em] text-[var(--b-accent)] uppercase">The day</p>
        </Rise>
        <ol className="m-0 mt-10 grid list-none gap-10 p-0 md:grid-cols-2">
          {day.hours.map((hour) => (
            <li key={hour.title}>
              <Rise live={live}>
                <p className="m-0 font-[family-name:var(--font-serif)] text-5xl text-[var(--b-accent)]">{hour.time}</p>
                <h2 className="m-0 mt-2 font-[family-name:var(--font-serif)] text-3xl font-medium">{hour.title}</h2>
                <p className="m-0 mt-3 max-w-md text-lg leading-relaxed text-[var(--b-muted)]">{hour.detail}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>

      <GenZGallery photos={day.photos} live={live} shortName={day.shortName} />

      <section className="grid gap-10 bg-[var(--b-surface)] px-5 py-16 md:grid-cols-2 md:px-14">
        <Rise live={live}>
          <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[var(--b-accent)] uppercase">Dress code</p>
          <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-3xl">{day.dress}</p>
          <p className="m-0 mt-3 text-lg text-[var(--b-muted)]">
            {day.celebrationType} · {day.feel}
          </p>
        </Rise>
        <Rise live={live}>
          <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[var(--b-accent)] uppercase">Please note</p>
          <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-2xl leading-snug">{day.guestNote}</p>
        </Rise>
      </section>

      <section className="bg-[var(--b-bg)] px-5 py-20 md:px-14">
        <Rise live={live}>
          <div className="mx-auto max-w-xl">
            <p className="m-0 text-[0.68rem] tracking-[0.32em] text-[var(--b-accent)] uppercase">{day.ui.rsvpTitle}</p>
            <p className="m-0 mt-3 font-[family-name:var(--font-serif)] text-3xl">Save your place</p>
            <p className="m-0 mt-3 text-[var(--b-muted)]">
              Responses go to {day.rsvpPhone}. Reply anytime after you receive your invite.
            </p>
            {sent ? (
              <p className="m-0 mt-8 border border-[color-mix(in_srgb,var(--b-accent)_40%,transparent)] px-5 py-4 font-[family-name:var(--font-serif)] text-xl italic">
                {sent}
              </p>
            ) : (
              <form className="mt-8 grid gap-4" onSubmit={onRsvp}>
                <label className="grid gap-2 text-[0.72rem] tracking-[0.18em] uppercase">
                  Your name
                  <input
                    name="name"
                    required
                    className="border border-[color-mix(in_srgb,var(--b-accent)_35%,transparent)] bg-transparent px-4 py-3 text-base tracking-normal text-[var(--b-ink)] outline-none"
                    placeholder="Full name"
                  />
                </label>
                <label className="grid gap-2 text-[0.72rem] tracking-[0.18em] uppercase">
                  Attending
                  <select
                    name="attending"
                    className="border border-[color-mix(in_srgb,var(--b-accent)_35%,transparent)] bg-[var(--b-bg)] px-4 py-3 text-base tracking-normal text-[var(--b-ink)] outline-none"
                    defaultValue="yes"
                  >
                    <option value="yes">Joyfully yes</option>
                    <option value="mass">Mass only</option>
                    <option value="reception">Reception only</option>
                    <option value="no">Unable to attend</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="mt-2 border border-[var(--b-accent)] bg-[var(--b-accent)] px-6 py-3 text-[0.72rem] tracking-[0.24em] text-[var(--b-on-accent)] uppercase"
                >
                  {day.ui.rsvpCta}
                </button>
              </form>
            )}
          </div>
        </Rise>
      </section>

      <footer className="border-t border-[color-mix(in_srgb,var(--b-accent)_22%,transparent)] px-5 py-10 text-center md:px-14">
        <p className="m-0 font-[family-name:var(--font-serif)] text-2xl text-[var(--b-accent)]">{day.name}</p>
        <p className="m-0 mt-2 text-sm tracking-[0.18em] text-[var(--b-muted)] uppercase">
          {day.dateLabel} · Lagos
        </p>
      </footer>
    </div>
  );
}
