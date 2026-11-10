"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { themeVars, type Photo, type WeddingDay } from "@/content";
import { sageDay } from "./sage-day";

const LEAVES = [
  { left: "8%", top: "14%", delay: "0.4s", size: 18, rot: "-28deg" },
  { left: "82%", top: "18%", delay: "1.1s", size: 22, rot: "34deg" },
  { left: "18%", top: "62%", delay: "1.8s", size: 16, rot: "16deg" },
  { left: "74%", top: "58%", delay: "2.4s", size: 20, rot: "-22deg" },
  { left: "44%", top: "8%", delay: "0.9s", size: 14, rot: "8deg" },
  { left: "56%", top: "72%", delay: "3s", size: 18, rot: "-12deg" },
  { left: "28%", top: "38%", delay: "2s", size: 12, rot: "40deg" },
  { left: "66%", top: "34%", delay: "2.7s", size: 15, rot: "-36deg" },
];

export function Sage({
  day = sageDay,
  onBegin,
}: {
  day?: WeddingDay;
  /** Called synchronously from the Open tap so music can start with the intro. */
  onBegin?: () => void;
}) {
  const [begun, setBegun] = useState(false);
  const [open, setOpen] = useState(false);
  const moreRooms = (day.images.more ?? []).map((photo, index) => {
    const isGele = photo.src.includes("photo-12");
    return {
      src: photo.src,
      focus: isGele ? "center top" : (photo.focus ?? "center"),
      label: ["More light", "Closer still", "Another glance", "Held close"][index] ?? "More",
      note: photo.alt ?? day.dock[index % day.dock.length] ?? day.couple,
      contain: isGele,
    };
  });
  const gather = [
    { src: day.images.bouquet.src, focus: day.images.bouquet.focus ?? "center", label: "The gathering", note: day.letter[0], contain: false },
    { src: day.images.walk.src, focus: day.images.walk.focus ?? "center 40%", label: "The walk", note: day.dock[0], contain: false },
    { src: day.images.rings.src, focus: day.images.rings.focus ?? "center", label: "The promise", note: day.dock[2], contain: false },
    { src: day.images.kiss.src, focus: day.images.kiss.focus ?? "center 38%", label: "The soft hour", note: day.dock[3], contain: false },
    { src: day.images.dress.src, focus: day.images.dress.focus ?? "center", label: "The celebration", note: day.hours[2]?.detail ?? day.dress, contain: false },
    { src: day.images.couple.src, focus: day.images.couple.focus ?? "center 30%", label: "Us", note: `${day.first} and ${day.second}. ${day.address}.`, contain: false },
    ...moreRooms,
  ];
  const coupleSlides: Photo[] = [
    day.images.couple,
    day.images.walk,
    day.images.kiss,
    day.images.dress,
    day.images.more?.[0] ?? day.images.bouquet,
  ].slice(0, 5);
  const heroSlides: Photo[] = [
    day.images.couple,
    day.images.walk,
    day.images.kiss,
    day.images.more?.[0] ?? day.images.dress,
  ].slice(0, 4);
  const veilExtra = day.images.more?.[0]?.src ?? day.images.bouquet.src;
  const hashtag = typeof day.extras.hashtag === "string" ? day.extras.hashtag : null;

  return (
    <div className="overflow-x-clip bg-[var(--w-ink)] text-[var(--w-bg)]" style={themeVars(day.colors)}>
      <style>{`
        .sg-sky { opacity: 1; transition: opacity 1.15s ease; }
        .sg-sky.is-leaving { opacity: 0; }
        .sg-veil-l, .sg-veil-r {
          position: absolute; inset-block: 0; width: 54%; overflow: hidden;
          animation: sg-part 3.4s cubic-bezier(0.45, 0, 0.2, 1) 1.2s forwards;
        }
        .sg-veil-l { left: 0; }
        .sg-veil-r { right: 0; }
        .sg-veil-l img { object-position: left center; width: 100%; height: 100%; object-fit: cover; }
        .sg-veil-r img { object-position: right center; transform: scaleX(-1); width: 100%; height: 100%; object-fit: cover; }
        .sg-couple {
          opacity: 0; transform: scale(1.12);
          animation: sg-reveal 2.6s cubic-bezier(0.16, 0.84, 0.3, 1) 3.6s forwards;
        }
        .sg-mobile-cover {
          width: 100%;
          height: 100%;
          max-width: none;
          object-fit: cover;
        }
        .sg-leaf {
          position: absolute; border-radius: 60% 40% 55% 45% / 55% 45% 60% 40%;
          background: linear-gradient(145deg, var(--w-accent), var(--w-accent-alt) 48%, var(--w-surface));
          opacity: 0; pointer-events: none;
          animation: sg-fall 5.5s ease-in-out infinite;
          box-shadow: 0 4px 12px color-mix(in srgb, var(--w-bg) 35%, transparent);
        }
        .sg-said { opacity: 0; animation: sg-said 3.2s ease 0.5s both; }
        .sg-name { opacity: 0; transform: translateY(28px); animation: sg-grow 1.35s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .sg-line { opacity: 0; animation: sg-line 1.1s ease both; }
        .sg-rise { opacity: 0; transform: translateY(30px); }
        .sg-rise.is-in { animation: sg-line 1s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .sg-frame { position: relative; }
        .sg-frame::before, .sg-frame::after {
          content: ""; position: absolute; width: 2.4rem; height: 2.4rem; border: 2px solid var(--w-accent); opacity: 0;
          transition: none;
        }
        .sg-rise.is-in .sg-frame::before { top: 0.7rem; left: 0.7rem; border-right: 0; border-bottom: 0; animation: sg-corner 0.9s ease 0.15s forwards; }
        .sg-rise.is-in .sg-frame::after { right: 0.7rem; bottom: 0.7rem; border-left: 0; border-top: 0; animation: sg-corner 0.9s ease 0.35s forwards; }
        .sg-stamp { opacity: 0; transform: rotate(-8deg) scale(0.85); }
        .sg-rise.is-in .sg-stamp { animation: sg-stamp 0.95s cubic-bezier(0.34, 1.3, 0.64, 1) 0.2s forwards; }
        .sg-unfurl { opacity: 0; transform: translateX(-36px) rotate(-2deg); transform-origin: left center; }
        .sg-rise.is-in .sg-unfurl { animation: sg-unfurl 1.05s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .sg-unfurl-r { opacity: 0; transform: translateX(36px) rotate(2deg); transform-origin: right center; }
        .sg-rise.is-in .sg-unfurl-r { animation: sg-unfurl 1.05s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .sg-breathe { animation: sg-breathe 18s ease-in-out infinite alternate; }
        .sg-vine { animation: sg-vine 24s linear infinite; }
        .sg-glow { animation: sg-glow 6s ease-in-out infinite alternate; }
        .sg-photo { transition: transform 1.1s cubic-bezier(0.16, 0.84, 0.3, 1), filter 0.8s ease; }
        .sg-photo:hover { transform: scale(1.04); filter: saturate(1.12) contrast(1.04); }
        .sg-fade-slide {
          position: absolute; inset: 0; opacity: 0;
          transition: opacity 1.15s ease;
          pointer-events: none;
        }
        .sg-fade-slide.is-active { opacity: 1; }
        .sg-progress {
          position: absolute; top: 0; left: 0; z-index: 7;
          height: 2px; width: 0; background: var(--w-accent);
          box-shadow: 0 0 12px color-mix(in srgb, var(--w-accent) 55%, transparent);
          animation: sg-progress 19.2s linear forwards;
        }
        @keyframes sg-progress { to { width: 100%; } }
        @keyframes sg-part {
          to { width: 0%; opacity: 0.35; }
        }
        @keyframes sg-reveal {
          from { opacity: 0; transform: scale(1.12); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes sg-fall {
          0% { opacity: 0; transform: translateY(-12px) rotate(var(--r, 0deg)) scale(0.5); }
          22% { opacity: 0.95; transform: translateY(8px) rotate(calc(var(--r, 0deg) + 12deg)) scale(1); }
          70% { opacity: 0.55; }
          100% { opacity: 0; transform: translateY(48px) rotate(calc(var(--r, 0deg) + 28deg)) scale(0.7); }
        }
        @keyframes sg-said {
          0% { opacity: 0; transform: translateY(10px); }
          18% { opacity: 1; transform: none; }
          68% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes sg-grow {
          from { opacity: 0; transform: translateY(28px) scale(0.96); }
          to { opacity: 1; transform: none; }
        }
        @keyframes sg-line { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes sg-corner { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: none; } }
        @keyframes sg-stamp { to { opacity: 1; transform: rotate(-4deg) scale(1); } }
        @keyframes sg-unfurl { to { opacity: 1; transform: none; } }
        @keyframes sg-breathe { from { transform: scale(1.04); } to { transform: scale(1.1) translate3d(-1.5%, -1%, 0); } }
        @keyframes sg-vine { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes sg-glow { from { opacity: 0.45; } to { opacity: 0.9; } }
        @media (prefers-reduced-motion: reduce) {
          .sg-veil-l, .sg-veil-r, .sg-leaf, .sg-said { display: none; }
          .sg-couple, .sg-name, .sg-line, .sg-rise, .sg-stamp, .sg-unfurl, .sg-unfurl-r, .sg-breathe, .sg-vine, .sg-glow, .sg-progress { animation: none; opacity: 1; transform: none; }
          .sg-progress { width: 100%; }
          .sg-rise.is-in .sg-frame::before, .sg-rise.is-in .sg-frame::after { opacity: 1; animation: none; }
        }
        @media (max-width: 767px) {
          .sg-mobile-cover,
          .sg-couple,
          .sg-fade-slide {
            object-position: center 18% !important;
          }
          .sg-veil-l img,
          .sg-veil-r img {
            object-position: center 18% !important;
          }
          .sg-breathe {
            animation: none !important;
            transform: none !important;
          }
          .sg-couple {
            transform: none;
            animation: sg-reveal-mobile 2.2s cubic-bezier(0.16, 0.84, 0.3, 1) 3.2s forwards;
          }
          @keyframes sg-reveal-mobile {
            from { opacity: 0; transform: scale(1.04); }
            to { opacity: 1; transform: scale(1); }
          }
          .sg-fade-frame {
            aspect-ratio: 3 / 4;
            max-height: min(68vh, 34rem);
          }
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
      {begun && !open && <Bloom day={day} veilExtra={veilExtra} onDone={() => setOpen(true)} />}
      <Grove day={day} gather={gather} coupleSlides={coupleSlides} heroSlides={heroSlides} hashtag={hashtag} live={open} />
    </div>
  );
}

function Seal({ day, onOpen }: { day: WeddingDay; onOpen: () => void }) {
  return (
    <section className="fixed inset-0 z-50 grid min-h-[100dvh] place-items-center overflow-hidden bg-[var(--w-bg)] text-[var(--w-ink)]">
      <img
        src={day.images.couple.src}
        alt=""
        className="sg-mobile-cover absolute inset-0 size-full opacity-55"
        style={{ objectPosition: day.images.couple.focus ?? "center 28%" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--w-bg)] via-[color-mix(in_srgb,var(--w-bg)_55%,transparent)] to-[color-mix(in_srgb,var(--w-bg)_40%,transparent)]" />
      <button
        type="button"
        onClick={onOpen}
        className="relative z-[2] mx-6 flex max-w-lg flex-col items-center gap-5 text-center"
      >
        <p className="m-0 text-[0.68rem] tracking-[0.34em] text-[var(--w-accent)] uppercase">{day.place}</p>
        <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(2.8rem,8vw,5.2rem)] leading-[0.9] font-medium">
          {day.first}
          <span className="mt-1 block text-[var(--w-accent)]">{day.second}</span>
        </p>
        <p className="m-0 text-[0.72rem] tracking-[0.22em] text-[color-mix(in_srgb,var(--w-ink)_75%,transparent)] uppercase">
          A short welcome
        </p>
        <span className="mt-1 border border-[color-mix(in_srgb,var(--w-accent)_55%,transparent)] bg-[color-mix(in_srgb,var(--w-accent)_18%,transparent)] px-8 py-3 text-[0.72rem] tracking-[0.28em] uppercase">
          Open
        </span>
      </button>
    </section>
  );
}

function Bloom({
  day,
  veilExtra,
  onDone,
}: {
  day: WeddingDay;
  veilExtra: string;
  onDone: () => void;
}) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 17800);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 19200);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section
      className={`sg-sky fixed inset-0 z-50 min-h-[100dvh] overflow-hidden bg-[var(--w-bg)] text-[var(--w-ink)] ${leaving ? "is-leaving" : ""}`}
      aria-label={`Welcome intro for ${day.first} and ${day.second}`}
    >
      <div className="sg-progress" aria-hidden />
      <img
        src={day.images.couple.src}
        alt=""
        className="sg-couple sg-mobile-cover absolute inset-0 size-full"
        style={{ objectPosition: day.images.couple.focus ?? "center 28%" }}
      />
      <div className="sg-veil-l z-[2]">
        <img src={veilExtra} alt="" className="sg-mobile-cover brightness-75" />
        <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--w-bg)_35%,transparent)]" />
      </div>
      <div className="sg-veil-r z-[2]">
        <img src={day.images.bouquet.src} alt="" className="sg-mobile-cover brightness-75" />
        <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--w-bg)_35%,transparent)]" />
      </div>
      <div className="absolute inset-0 z-[3] bg-gradient-to-t from-[var(--w-bg)] via-transparent to-[color-mix(in_srgb,var(--w-bg)_45%,transparent)]" />
      {LEAVES.map((leaf) => (
        <span
          key={`${leaf.left}-${leaf.top}`}
          className="sg-leaf z-[4]"
          style={{
            left: leaf.left,
            top: leaf.top,
            width: leaf.size,
            height: leaf.size * 1.35,
            animationDelay: leaf.delay,
            ["--r" as string]: leaf.rot,
          }}
        />
      ))}
      <p className="sg-said absolute inset-x-0 top-[12vh] z-[5] m-0 text-center font-[family-name:var(--font-serif)] text-[clamp(1.5rem,3.5vw,2.6rem)] italic">
        {day.ui.introKicker}
      </p>
      <div className="absolute inset-x-0 bottom-[8vh] z-[5] px-6 text-center">
        <p className="sg-line sg-glow m-0 text-[0.68rem] tracking-[0.34em] text-[var(--w-accent)] uppercase" style={{ animationDelay: "6.8s" }}>
          {day.place}
        </p>
        <p className="sg-name m-0 mt-3 font-[family-name:var(--font-serif)] text-[clamp(3rem,9vw,6.4rem)] leading-[0.86]" style={{ animationDelay: "8.4s" }}>
          {day.first}
        </p>
        <p className="sg-name m-0 font-[family-name:var(--font-serif)] text-[clamp(3rem,9vw,6.4rem)] leading-[0.86] text-[var(--w-accent)]" style={{ animationDelay: "10.2s" }}>
          {day.second}
        </p>
        <p className="sg-line m-0 mt-4 font-[family-name:var(--font-serif)] text-2xl italic" style={{ animationDelay: "12.4s" }}>
          {day.time}
        </p>
        <p className="sg-line m-0 mt-1 text-sm tracking-[0.16em] uppercase" style={{ animationDelay: "13.8s" }}>
          {day.dateLabel}
        </p>
        <p className="sg-line m-0 mt-1 text-sm text-[var(--w-accent)]" style={{ animationDelay: "15s" }}>
          {day.venue}
        </p>
      </div>
      <div className="absolute top-5 left-5 z-[6] flex items-center gap-3">
        <p className="m-0 border border-[color-mix(in_srgb,var(--w-accent)_40%,transparent)] bg-black/35 px-3 py-1.5 text-[0.65rem] tracking-[0.24em] text-[var(--w-accent)] uppercase">
          Welcome
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          setLeaving(true);
          window.setTimeout(() => finish.current(), 240);
        }}
        className="absolute top-5 right-5 z-[6] cursor-pointer border border-[color-mix(in_srgb,var(--w-accent)_45%,transparent)] bg-black/40 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase"
      >
        {day.ui.skip}
      </button>
      <p className="absolute inset-x-0 bottom-4 z-[6] m-0 px-6 text-center text-[0.65rem] tracking-[0.2em] text-[color-mix(in_srgb,var(--w-ink)_70%,transparent)] uppercase">
        A short welcome · then the invitation
      </p>
    </section>
  );
}

function useFadeIndex(live: boolean, total: number, intervalMs = 4200) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!live || total < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [live, total, intervalMs]);
  return index;
}

function HeroFade({ slides, live }: { slides: Photo[]; live: boolean }) {
  const total = Math.min(4, slides.length);
  const index = useFadeIndex(live, total, 4500);

  return (
    <div className="absolute inset-0 opacity-45" aria-hidden>
      {slides.slice(0, 4).map((photo, i) => (
        <img
          key={photo.src}
          src={photo.src}
          alt=""
          className={`sg-fade-slide sg-mobile-cover absolute inset-0 ${i === index ? "is-active" : ""}`}
          style={{ objectPosition: photo.focus ?? "center 28%" }}
        />
      ))}
    </div>
  );
}

function CoupleFade({ slides, live }: { slides: Photo[]; live: boolean }) {
  const total = Math.min(5, slides.length);
  const index = useFadeIndex(live, total, 4200);

  return (
    <div className="sg-frame sg-fade-frame relative aspect-[4/5] w-full overflow-hidden">
      {slides.slice(0, 5).map((photo, i) => (
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt ?? ""}
          className={`sg-fade-slide sg-mobile-cover absolute inset-0 ${i === index ? "is-active" : ""}`}
          style={{ objectPosition: photo.focus ?? "center 28%" }}
        />
      ))}
    </div>
  );
}

function Grove({
  day,
  gather,
  coupleSlides,
  heroSlides,
  hashtag,
  live,
}: {
  day: WeddingDay;
  gather: { src: string; focus: string; label: string; note: string; contain?: boolean }[];
  coupleSlides: Photo[];
  heroSlides: Photo[];
  hashtag: string | null;
  live: boolean;
}) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="relative grid min-h-[100dvh] items-end overflow-hidden bg-[var(--w-bg)] px-5 pb-12 pt-20 text-[var(--w-ink)] sm:px-6 md:px-14 md:py-16">
        <HeroFade slides={heroSlides} live={live} />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--w-surface)] via-[color-mix(in_srgb,var(--w-bg)_70%,transparent)] to-[color-mix(in_srgb,var(--w-bg)_35%,transparent)]" />
        {LEAVES.slice(0, 5).map((leaf) => (
          <span
            key={`hero-${leaf.left}`}
            className="sg-leaf z-[1] hidden md:block"
            style={{
              left: leaf.left,
              top: leaf.top,
              width: leaf.size,
              height: leaf.size * 1.35,
              animationDelay: leaf.delay,
              ["--r" as string]: leaf.rot,
            }}
          />
        ))}
        <div className="relative z-[2] w-full max-w-4xl">
          <p className="sg-glow m-0 text-[0.68rem] tracking-[0.36em] text-[var(--w-accent)] uppercase">{day.place}</p>
          <h1 className="m-0 mt-3 font-[family-name:var(--font-serif)] text-[clamp(2.8rem,14vw,7rem)] leading-[0.88] font-medium md:mt-4 md:leading-[0.84]">
            {day.first}
            <span className="block text-[var(--w-accent)]">{day.second}</span>
          </h1>
          <p className="m-0 mt-5 max-w-xl font-[family-name:var(--font-serif)] text-[clamp(1.15rem,4.5vw,1.5rem)] italic md:mt-6 md:text-2xl">
            {day.dateLabel} · {day.time}
          </p>
          <p className="m-0 mt-2 text-[color-mix(in_srgb,var(--w-ink)_85%,transparent)]">{day.venue}</p>
          {hashtag ? <p className="m-0 mt-3 text-sm tracking-[0.18em] text-[var(--w-accent)] uppercase">{hashtag}</p> : null}
        </div>
      </section>

      <div className="overflow-hidden bg-[var(--w-accent-alt)] py-2.5 text-[var(--w-ink)]">
        <p className="sg-vine m-0 w-max text-sm tracking-[0.2em] uppercase">
          {`${hashtag ? `${hashtag} · ` : ""}Rooted · Rising · Celebrating · ${day.couple} · Gather close · `.repeat(6)}
        </p>
      </div>

      <section className="mx-auto grid max-w-5xl gap-10 bg-[var(--w-ink)] px-6 py-16 text-[var(--w-bg)] md:grid-cols-[0.95fr_1.05fr] md:items-center md:px-10">
        <Rise live={live}>
          <CoupleFade slides={coupleSlides} live={live} />
        </Rise>
        <Rise live={live}>
          <p className="sg-unfurl m-0 font-[family-name:var(--font-serif)] text-[clamp(1.7rem,3vw,2.5rem)] leading-snug italic">
            {day.arrival}
          </p>
          <div className="mt-8 grid gap-5">
            {day.letter.map((paragraph, index) => (
              <p
                key={paragraph}
                className={`${index % 2 ? "sg-unfurl-r" : "sg-unfurl"} m-0 text-lg leading-relaxed text-[color-mix(in_srgb,var(--w-bg)_85%,transparent)]`}
                style={{ animationDelay: `${0.12 * index}s` }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Rise>
      </section>

      {gather.map((room, index) => (
        <section key={room.label} className={`relative min-h-[100dvh] overflow-hidden md:min-h-[90vh] ${index % 2 ? "bg-[var(--w-surface)]" : "bg-[var(--w-bg)]"}`}>
          <img
            src={room.src}
            alt=""
            className={`absolute inset-0 opacity-90 ${room.contain ? "size-full object-contain object-top md:object-center" : "sg-breathe sg-mobile-cover"}`}
            style={{ objectPosition: room.contain ? undefined : room.focus, animationDuration: room.contain ? undefined : `${16 + (index % 3) * 3}s` }}
          />
          <div
            className={`absolute inset-0 ${
              index % 2
                ? "bg-gradient-to-t from-[color-mix(in_srgb,var(--w-surface)_92%,transparent)] via-[color-mix(in_srgb,var(--w-surface)_40%,transparent)] to-transparent md:bg-gradient-to-r md:from-[color-mix(in_srgb,var(--w-surface)_88%,transparent)] md:via-[color-mix(in_srgb,var(--w-surface)_35%,transparent)] md:to-transparent"
                : "bg-gradient-to-t from-[color-mix(in_srgb,var(--w-bg)_92%,transparent)] via-[color-mix(in_srgb,var(--w-bg)_30%,transparent)] to-transparent"
            }`}
          />
          <div className={`relative flex min-h-[100dvh] items-end px-5 py-12 text-[var(--w-ink)] md:min-h-[90vh] md:px-14 md:py-14 ${index % 2 ? "justify-start" : "justify-end"}`}>
            <Rise live={live}>
              <div className="max-w-xl">
                <p className="sg-stamp m-0 inline-block rounded-full border border-[color-mix(in_srgb,var(--w-accent)_60%,transparent)] bg-[var(--w-accent)] px-3 py-1 text-[0.68rem] font-medium tracking-[0.2em] text-[var(--w-on-accent)] uppercase">
                  {room.label}
                </p>
                <p className={`${index % 2 ? "sg-unfurl" : "sg-unfurl-r"} m-0 mt-4 font-[family-name:var(--font-serif)] text-[clamp(2rem,4vw,3.3rem)] leading-[1.05]`}>
                  {room.note}
                </p>
              </div>
            </Rise>
          </div>
        </section>
      ))}

      <section className="bg-[var(--w-ink)] px-6 py-20 text-[var(--w-bg)] md:px-14">
        <Rise live={live}>
          <p className="m-0 text-[0.68rem] tracking-[0.32em] text-[var(--w-accent-alt)] uppercase">The day</p>
        </Rise>
        <ol className="m-0 mt-10 grid list-none gap-10 p-0 md:grid-cols-2">
          {day.hours.map((hour, index) => (
            <li key={`${hour.time}-${hour.title}`}>
              <Rise live={live}>
                <p className="sg-stamp m-0 font-[family-name:var(--font-serif)] text-6xl text-[var(--w-accent-alt)]" style={{ animationDelay: `${index * 0.08}s` }}>
                  {hour.time}
                </p>
                <h2 className="sg-unfurl m-0 mt-2 font-[family-name:var(--font-serif)] text-3xl font-medium">{hour.title}</h2>
                <p className="m-0 mt-2 max-w-md text-lg text-[color-mix(in_srgb,var(--w-bg)_75%,transparent)]">{hour.detail}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid items-center gap-10 bg-[var(--w-surface-alt)] px-6 py-20 text-[var(--w-ink)] md:grid-cols-2 md:px-14">
        <Rise live={live}>
          <div className="sg-frame">
            <img src={day.images.dress.src} alt={day.images.dress.alt ?? ""} className="sg-photo aspect-[4/5] w-full object-cover" />
          </div>
        </Rise>
        <Rise live={live}>
          <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[var(--w-accent)] uppercase">What to wear</p>
          <p className="sg-unfurl m-0 mt-4 font-[family-name:var(--font-serif)] text-3xl leading-snug">{day.dress}</p>
          <ul className="m-0 mt-8 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-t border-[color-mix(in_srgb,var(--w-accent)_25%,transparent)] py-4">
                <p className="m-0 font-[family-name:var(--font-serif)] text-2xl">{stay.name}</p>
                <p className="m-0 mt-1 text-[color-mix(in_srgb,var(--w-ink)_80%,transparent)]">{stay.detail}</p>
              </li>
            ))}
          </ul>
          <p className="m-0 mt-10 font-[family-name:var(--font-script)] text-5xl text-[var(--w-accent)]">{day.ui.rsvpTitle}</p>
          <Reply day={day} />
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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setOn(true);
    }, { threshold: 0.16 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [live]);
  return <div ref={ref} className={`sg-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply({ day }: { day: WeddingDay }) {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) {
    return (
      <p className="m-0 mt-8 font-[family-name:var(--font-serif)] text-3xl">
        {day.ui.rsvpSuccess.replace("{name}", sent)}
      </p>
    );
  }
  return (
    <form className="mt-8 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">
        Your name
        <input name="name" required placeholder="Your name" className="min-h-12 border border-[color-mix(in_srgb,var(--w-accent)_40%,transparent)] bg-transparent px-3 text-base" />
      </label>
      <label className="grid gap-1 text-sm">
        Arriving
        <select name="when" defaultValue="For the ceremony" className="min-h-12 border border-[color-mix(in_srgb,var(--w-accent)_40%,transparent)] bg-[var(--w-bg)] px-3 text-base text-[var(--w-ink)]">
          <option>For the ceremony</option>
          <option>For the reception</option>
          <option>Both</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        A note
        <textarea name="note" rows={3} placeholder="A seat, a diet, a song" className="border border-[color-mix(in_srgb,var(--w-accent)_40%,transparent)] bg-transparent px-3 py-2 text-base" />
      </label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[var(--w-accent)] px-5 text-base text-[var(--w-on-accent)]">
        {day.ui.rsvpCta}
      </button>
    </form>
  );
}
