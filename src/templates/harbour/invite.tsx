"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType, type FormEvent, type ReactNode } from "react";
import { saveTheDateIcs, wedding } from "@/data/wedding";

function useCountdown(target: string) {
  const [parts, setParts] = useState({ days: "00", hours: "00", minutes: "00" });

  useEffect(() => {
    function tick() {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      const days = Math.floor(diff / 86_400_000);
      const hours = Math.floor((diff % 86_400_000) / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);
      setParts({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
      });
    }
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [target]);

  return parts;
}

const heroSlides = ["/photos/bg-2.jpg", "/photos/hero-1.jpg", "/photos/hero-2.jpg"];

type FadeVariant = "piece" | "section";

function motionStyle(progress: number, variant: FadeVariant): CSSProperties {
  if (variant === "section") {
    return { transform: `translateY(${(1 - progress) * 18}px)` };
  }
  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * 24}px)`,
  };
}

const revealers = new Set<() => void>();
let revealFrame = 0;
let revealListening = false;

function ensureRevealLoop() {
  if (revealListening) return;
  revealListening = true;
  const run = () => {
    revealFrame = 0;
    revealers.forEach((update) => update());
  };
  const onScroll = () => {
    if (revealFrame) return;
    revealFrame = requestAnimationFrame(run);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

function measureReveal(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const start = window.innerHeight * 0.94;
  const end = window.innerHeight * 0.62;
  return Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
}

function useElementFade(variant: FadeVariant) {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(1);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const update = () => {
      const next = measureReveal(element);
      setProgress((current) => (Math.abs(current - next) < 0.012 ? current : next));
    };

    update();
    ensureRevealLoop();
    revealers.add(update);
    return () => {
      revealers.delete(update);
    };
  }, []);

  return { ref, style: motionStyle(progress, variant) };
}

function Reveal({
  as: Tag = "div",
  variant = "piece",
  className,
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  variant?: FadeVariant;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Record<string, unknown>) {
  const motion = useElementFade(variant);
  return (
    <Tag ref={motion.ref} className={className} style={{ ...motion.style, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

function useHeroScroll() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      const rect = element.getBoundingClientRect();
      const traveled = Math.min(Math.max(-rect.top, 0), rect.height);
      setProgress(traveled / rect.height);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, progress };
}

function heroPiece(progress: number, lag = 0): CSSProperties {
  const travel = Math.min(1, Math.max(0, (progress - lag) / 0.55));
  return {
    opacity: 1 - travel,
    transform: `translate3d(0, ${travel * -42}px, 0)`,
  };
}

function GoldDivider({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      className={
        compact
          ? "h-auto w-[clamp(140px,38%,280px)] opacity-85"
          : "mx-auto mb-[1.4rem] h-auto w-[min(240px,62%)]"
      }
      viewBox="0 0 280 32"
      aria-hidden="true"
    >
      <path d="M6 16h104M170 16h104" fill="none" stroke="#c9a96e" strokeWidth="0.8" />
      <path
        d="M140 16c-6-7-14-8-18-1 5 1 11 2 18 1zm0 0c6-7 14-8 18-1-5 1-11 2-18 1z"
        fill="none"
        stroke="#c9a96e"
        strokeWidth="0.8"
      />
      <path
        d="M132 16c2-5 6-7 8-7s6 2 8 7M148 16c-2 5-6 7-8 7s-6-2-8-7"
        fill="none"
        stroke="#c9a96e"
        strokeWidth="0.7"
      />
      <circle cx="140" cy="16" r="1.2" fill="#c9a96e" />
    </svg>
  );
}

function LeafFrame() {
  const cx = 100;
  const cy = 148;
  const rx = 70;
  const ry = 108;
  const leaves = Array.from({ length: 22 }, (_, index) => {
    const angle = (index / 22) * Math.PI * 2;
    return {
      index,
      x: cx + Math.cos(angle) * rx,
      y: cy + Math.sin(angle) * ry,
      rot: (angle * 180) / Math.PI,
    };
  });

  return (
    <svg className="hidden" viewBox="0 0 200 296" aria-hidden="true">
      <ellipse cx={cx} cy={cy} rx="62" ry="98" fill="none" stroke="#a56b45" strokeWidth="1.4" />
      <ellipse cx={cx} cy={cy} rx="56" ry="91" fill="none" stroke="#c4a27a" strokeWidth="0.6" opacity="0.7" />
      {leaves.map((leaf) => (
        <g key={leaf.index} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rot})`}>
          <ellipse cx="12" cy="0" rx="12" ry="4.4" fill="#1d5538" />
          <ellipse cx="8" cy="-3.2" rx="8" ry="2.8" fill="#2d6b46" transform="rotate(-26 8 -3.2)" />
          <ellipse cx="9" cy="3" rx="7" ry="2.4" fill="#173f2a" transform="rotate(22 9 3)" />
          <circle cx="18" cy="0.4" r="1.35" fill="#c9a96e" />
        </g>
      ))}
    </svg>
  );
}

function GoldRose(_props: { place?: "end" | "schedule" | "gifts" | "hotels" }) {
  return null;
}
function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="none" stroke="#C9A96E" strokeWidth="1.5" />
      <circle cx="12" cy="10" r="3" fill="none" stroke="#C9A96E" strokeWidth="1.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="#C9A96E" strokeWidth="1.5" />
      <path d="M16 2v4M8 2v4M3 10h18" fill="none" stroke="#C9A96E" strokeWidth="1.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="#C9A96E" strokeWidth="1.5" />
      <path d="M12 6v6l4 2" fill="none" stroke="#C9A96E" strokeWidth="1.5" />
    </svg>
  );
}

function HotelIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 22V6l9-4 9 4v16" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 22V14h6v8" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="7" y="8" width="2" height="2" fill="none" stroke="#C9A96E" strokeWidth="1.5" />
      <rect x="11" y="8" width="2" height="2" fill="none" stroke="#C9A96E" strokeWidth="1.5" />
      <rect x="15" y="8" width="2" height="2" fill="none" stroke="#C9A96E" strokeWidth="1.5" />
    </svg>
  );
}

function DetailCard({
  rows,
  account,
}: {
  rows: [string, string][];
  account: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
    try {
      await navigator.clipboard.writeText(account);
    } catch {
      const field = document.createElement("textarea");
      field.value = account;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
  }

  return (
    <Reveal variant="section" className="mt-[1.4rem] border-t border-[#d7c09a] bg-transparent pt-[0.4rem] text-left shadow-none">
      {rows.map(([label, value]) => (
        <Reveal className="m-0 grid grid-cols-[8.5rem_1fr] items-baseline gap-4 border-b border-[#e4dfcb] py-[0.9rem]" key={label}>
          <p className="mb-[0.4rem] font-[family-name:var(--font-ui)] text-[0.59rem] font-medium tracking-[0.26em] text-[#1c3f86] uppercase">{label}</p>
          <strong className="block font-[family-name:var(--font-serif)] text-[1.2rem] font-medium text-[#1a1410]">{value}</strong>
        </Reveal>
      ))}
      <Reveal className="block">
        <p className="mb-[0.6rem] font-[family-name:var(--font-ui)] text-[0.59rem] font-medium tracking-[0.26em] text-[#1c3f86] uppercase">Account Number</p>
        <div className="mb-[0.85rem] border-0 border-b border-[#1c3f86] bg-transparent pt-[0.2rem] pb-[0.7rem] font-[family-name:var(--font-serif)] text-[1.85rem] tracking-[0.12em] text-[#1a2744]">{account}</div>
        <button className="mt-[0.2rem] w-auto cursor-pointer border-0 border-b border-[#1c3f86] bg-transparent px-0 py-[0.35rem] font-[family-name:var(--font-ui)] text-[0.68rem] font-medium tracking-[0.18em] text-[#1c3f86] uppercase" type="button" onClick={copy}>
          {copied ? "Copied" : "Copy Account Number"}
        </button>
      </Reveal>
    </Reveal>
  );
}

export function HarbourInvite({ onClose }: { onClose: () => void }) {
  const countdown = useCountdown(wedding.ceremonyAt);
  const heroScroll = useHeroScroll();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [guests, setGuests] = useState(0);
  const [sent, setSent] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div className="bg-[#f4efe4]">
      <button className="fixed top-4 left-4 z-[5] cursor-pointer rounded-none border-0 bg-[#0d1730] px-3.5 py-2 text-[#f4efe4]" type="button" onClick={onClose}>
        ← Back
      </button>

      <section
        ref={heroScroll.ref}
        className="hero relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#f3e8d6] px-[clamp(1.25rem,5vw,3rem)] pt-[clamp(4.5rem,12vh,6rem)] pb-[clamp(3.5rem,10vh,5rem)]"
      >
        <div
          className="pointer-events-none absolute inset-0 will-change-transform"
          aria-hidden="true"
          style={{
            transform: `translate3d(0, ${heroScroll.progress * 14}%, 0) scale(${1.14 + heroScroll.progress * 0.06})`,
          }}
        >
          {heroSlides.map((src, index) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover object-[center_22%] transition-opacity duration-[1600ms] ease-in-out ${index === slide ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(11,26,58,0.82)_0%,rgba(11,26,58,0.28)_42%,rgba(11,26,58,0.08)_100%)]"
          style={{ opacity: 1 - heroScroll.progress * 0.35 }}
        />
        <div className="relative z-2 flex w-full max-w-[40rem] flex-col items-center text-center font-[family-name:var(--font-ui)] text-[#f7f3ea] [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]">
          <p
            className="m-0 mb-[clamp(1rem,3vh,1.5rem)] text-[clamp(0.58rem,1.5vw,0.72rem)] leading-[1.9] font-medium tracking-[clamp(0.22em,1.4vw,0.55em)] uppercase"
            style={heroPiece(heroScroll.progress, 0)}
          >
            Together with
            <br />
            their families
          </p>
          <h1
            className="hero-names m-0 max-w-[14ch] font-[family-name:var(--font-serif)] text-[clamp(3.35rem,12vw,7.5rem)] leading-[0.95] font-medium tracking-[-0.03em] text-[#f7f3ea]"
            style={heroPiece(heroScroll.progress, 0.04)}
          >
            Adaeze &amp; Emeka
          </h1>
          <div
            className="my-[clamp(1.25rem,3.5vh,2rem)] flex w-[clamp(6.5rem,18vw,10rem)] flex-col items-center gap-[3px]"
            aria-hidden="true"
            style={heroPiece(heroScroll.progress, 0.08)}
          >
            <span className="block h-px w-full bg-[#c9a96e] opacity-70" />
            <span className="block h-px w-3/5 bg-[#c9a96e]" />
          </div>
          <p
            className="m-0 max-w-full text-[clamp(0.58rem,1.5vw,0.78rem)] font-medium tracking-[clamp(0.12em,0.9vw,0.32em)] text-black uppercase"
            style={heroPiece(heroScroll.progress, 0.1)}
          >
            {wedding.dateLabel}
          </p>
          <p
            className="mt-[0.6rem] max-w-[22rem] text-[clamp(0.78rem,1.8vw,0.95rem)] leading-[1.45] tracking-[0.08em] text-black"
            style={heroPiece(heroScroll.progress, 0.12)}
          >
            {wedding.venue}
          </p>
          <button
            className="mt-[clamp(1.5rem,4vh,2.25rem)] cursor-pointer rounded-none border-0 bg-[#e6d3a4] px-[clamp(1.4rem,4vw,2.5rem)] py-3 text-[clamp(0.62rem,1.4vw,0.75rem)] font-medium tracking-[clamp(0.14em,0.8vw,0.3em)] text-[#0d1730] uppercase shadow-none [text-shadow:none]"
            type="button"
            style={heroPiece(heroScroll.progress, 0.16)}
            onClick={saveTheDateIcs}
          >
            Save the Date
          </button>
        </div>
        <a
          className="absolute bottom-10 left-1/2 z-2 -translate-x-1/2"
          href="#countdown"
          aria-label="Continue"
          style={{ opacity: 1 - Math.min(heroScroll.progress / 0.18, 1) }}
        >
          <span className="motion-safe:animate-bounce block h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-[#c9a96e]" />
        </a>
      </section>

      <Reveal as="section" variant="section" className="relative bg-[#f8e9d8] px-4 pt-[3.6rem] pb-[2.8rem] text-center" id="countdown">
        <Reveal>
          <GoldDivider />
        </Reveal>
        <Reveal as="p" className="mt-[0.35rem] mb-[0.4rem] font-[family-name:var(--font-ui)] text-[0.62rem] font-medium tracking-[0.42em] text-[#1c3f86] uppercase">
          Until we say &apos;I do&apos;
        </Reveal>
        <Reveal as="h2" className="mb-11 font-[family-name:var(--font-serif)] font-medium tracking-[-0.03em] text-[3.25rem] leading-[1.1] font-normal text-[#1a2744] max-md:text-[2.8rem]">
          Countdown
        </Reveal>
        <div className="flex flex-nowrap items-center justify-center gap-[clamp(0.35rem,2vw,1rem)]">
          {[
            [countdown.days, "Days"],
            [countdown.hours, "Hours"],
            [countdown.minutes, "Minutes"],
          ].map(([value, label]) => (
            <Reveal className="relative w-auto max-w-36 flex-1 border border-[#d7c09a] bg-[#fffdf8] px-[0.4rem] pt-[1.15rem] pb-4" key={label}>
              <LeafFrame />
              <div className="static flex flex-col items-center justify-center">
                <strong className="font-[family-name:var(--font-serif)] font-medium tracking-[-0.03em] text-[clamp(2.5rem,8vw,3.5rem)] leading-none font-normal text-[#1c3f86]">
                  {value}
                </strong>
                <span className="mt-[0.45rem] font-[family-name:var(--font-ui)] text-[clamp(0.48rem,1.6vw,0.68rem)] font-medium tracking-[0.2em] text-[#6d7384] uppercase">
                  {label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className="relative bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.05),transparent_32%),radial-gradient(circle_at_90%_100%,rgba(0,0,0,0.18),transparent_40%),#16356e] px-6 pt-[3.4rem] pb-[0.8rem] text-center text-[#f6f1e6]">
        <Reveal as="p" className="mt-[0.8rem] mb-[0.2rem] font-[family-name:var(--font-ui)] text-[0.62rem] font-medium tracking-[0.42em] text-[rgba(247,243,234,0.78)] uppercase before:mr-[0.65rem] before:inline-block before:h-px before:w-6 before:bg-[#b08a4f] before:align-middle before:content-['']">
          A note from us
        </Reveal>
        <Reveal as="h2" className="m-0 font-[family-name:var(--font-serif)] font-medium tracking-[-0.03em] text-[clamp(3rem,8vw,3.6rem)] leading-[0.95] font-normal text-[#f7f3ea]">
          Our Story
        </Reveal>
        <Reveal className="relative mx-auto mt-6 w-[min(540px,100%)]">
          <figure className="m-0 w-[74%] max-md:w-[82%]">
            <img className="block aspect-[3/4] w-full border border-[#e6d3a4] object-cover object-[center_18%]" src="/photos/story-4.jpg" alt="Adaeze and Emeka" />
            <figcaption className="mt-[0.6rem] font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.2em] text-[#b08a4f] uppercase">Adaeze &amp; Emeka</figcaption>
          </figure>
          <img className="absolute right-0 bottom-[2.4rem] aspect-square w-[44%] border-8 border-[#16356e] object-cover shadow-[0_0_0_1px_#e6d3a4]" src="/photos/rings.jpg" alt="Wedding rings" />
        </Reveal>
        <Reveal as="p" className="mx-auto mt-[2.2rem] max-w-[28rem] text-left font-[family-name:var(--font-ui)] text-base leading-[1.75] text-[#f3efe6]">
          {wedding.story}
        </Reveal>
      </Reveal>

      <Reveal as="section" variant="section" className="relative bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.05),transparent_32%),radial-gradient(circle_at_90%_100%,rgba(0,0,0,0.18),transparent_40%),#16356e] px-6 pt-[1.2rem] pb-[3.4rem] text-center text-[#f6f1e6]">
        <Reveal as="p" className="mt-[0.8rem] mb-[0.2rem] font-[family-name:var(--font-ui)] text-[0.62rem] font-medium tracking-[0.42em] text-[rgba(247,243,234,0.78)] uppercase before:mr-[0.65rem] before:inline-block before:h-px before:w-6 before:bg-[#b08a4f] before:align-middle before:content-['']">
          Memories
        </Reveal>
        <Reveal as="h2" className="m-0 font-[family-name:var(--font-serif)] font-medium tracking-[-0.03em] text-[clamp(3rem,8vw,3.6rem)] leading-[0.95] font-normal text-[#f7f3ea]">
          Gallery
        </Reveal>
        <div className="mx-auto mt-6 grid w-[min(680px,100%)] grid-cols-[1.35fr_1fr] gap-[0.45rem] max-md:grid-cols-1">
          <Reveal as="img" className="row-span-2 min-h-[360px] size-full object-cover object-[center_20%] max-md:row-span-1 max-md:min-h-[280px]" src="/photos/story-2.jpg" alt="Adaeze and Emeka in formal black" />
          <Reveal as="img" className="size-full min-h-[172px] object-cover" src="/photos/florals.jpg" alt="Table flowers" />
          <Reveal as="img" className="size-full min-h-[172px] object-cover" src="/photos/bouquet.jpg" alt="Bouquet" />
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className="relative overflow-hidden bg-[#f6f4ec] px-6 pt-[3.6rem] pb-[2.6rem] text-left text-[#1a2744]" id="venue">
        <div className="mx-auto max-w-[36rem]">
          <Reveal className="hidden">
            <GoldDivider compact />
          </Reveal>
          <Reveal as="p" className="m-0 mb-[0.4rem] font-[family-name:var(--font-ui)] text-[0.62rem] font-medium tracking-[0.42em] text-[#1c3f86] uppercase before:mr-[0.65rem] before:inline-block before:h-px before:w-6 before:bg-[#b08a4f] before:align-middle before:content-['']">
            The Celebration
          </Reveal>
          <Reveal as="h2" className="mb-2 font-[family-name:var(--font-serif)] font-medium tracking-[-0.03em] text-[clamp(2.4rem,8vw,3.75rem)] leading-[1.1] font-normal text-[#1a2744]">
            {wedding.venue}
          </Reveal>
          <Reveal className="-mx-6 mt-[1.2rem] mb-[1.6rem] aspect-video w-[calc(100%+3rem)] overflow-hidden max-md:-mx-4 max-md:w-[calc(100%+2rem)]">
            <img className="block size-full object-cover object-[center_42%]" src="/photos/venue-1.jpg" alt="Wedding reception with white drapes and chandeliers" />
          </Reveal>
          <div className="-mx-6 mb-[1.5rem] grid w-[calc(100%+3rem)] grid-cols-2 gap-[0.45rem] max-md:-mx-4 max-md:w-[calc(100%+2rem)]">
            <img className="h-[150px] w-full object-cover" src="/photos/kiss.jpg" alt="A close moment" />
            <img className="h-[150px] w-full object-cover" src="/photos/couple.jpg" alt="The couple seated together" />
          </div>
          <div className="mb-[1.4rem] flex flex-col border-t border-[#d7c09a]">
            <Reveal className="flex items-center gap-4 border-b border-[#e4dfcb] bg-transparent px-0 py-[0.95rem] text-left no-underline shadow-none">
              <span className="hidden">
                <PinIcon />
              </span>
              <p className="m-0 font-[family-name:var(--font-ui)] text-base leading-[1.35] text-[#1a2744]">{wedding.address}</p>
            </Reveal>
            <Reveal className="flex items-center gap-4 border-b border-[#e4dfcb] bg-transparent px-0 py-[0.95rem] text-left no-underline shadow-none">
              <span className="hidden">
                <CalendarIcon />
              </span>
              <p className="m-0 font-[family-name:var(--font-ui)] text-base leading-[1.35] text-[#1a2744]">{wedding.dateLabel}</p>
            </Reveal>
            <Reveal className="flex items-center gap-4 border-b border-[#e4dfcb] bg-transparent px-0 py-[0.95rem] text-left no-underline shadow-none">
              <span className="hidden">
                <ClockIcon />
              </span>
              <p className="m-0 font-[family-name:var(--font-ui)] text-base leading-[1.35] text-[#1a2744]">{wedding.starts}</p>
            </Reveal>
          </div>
          <Reveal className="grid grid-cols-1 gap-3">
            <button className="m-0 block w-full cursor-pointer rounded-none border-[1.5px] border-[#1c3f86] bg-transparent px-8 py-[0.95rem] text-center font-[family-name:var(--font-ui)] text-[0.72rem] font-medium tracking-[0.14em] text-[#1c3f86] uppercase" type="button" onClick={saveTheDateIcs}>
              Add to Calendar
            </button>
          </Reveal>
        </div>
        <GoldRose />
      </Reveal>

      <Reveal as="section" variant="section" className="relative overflow-hidden bg-[#f6f4ec] px-6 pt-[3.6rem] pb-[2.6rem] text-left text-[#1a2744]">
        <div className="mx-auto max-w-[34rem]">
          <Reveal className="hidden">
            <GoldDivider compact />
          </Reveal>
          <Reveal as="p" className="m-0 mb-[0.4rem] font-[family-name:var(--font-ui)] text-[0.62rem] font-medium tracking-[0.42em] text-[#1c3f86] uppercase before:mr-[0.65rem] before:inline-block before:h-px before:w-6 before:bg-[#b08a4f] before:align-middle before:content-['']">
            Schedule
          </Reveal>
          <Reveal as="h2" className="mb-[0.35rem] font-[family-name:var(--font-serif)] font-medium tracking-[-0.03em] text-[2.75rem] leading-[1.15] font-normal text-[#1a2744]">
            Program of the Day
          </Reveal>
          <Reveal as="p" className="m-0 font-[family-name:var(--font-ui)] text-[0.9rem] font-light text-[#6d7384]">
            Join us through every moment of our celebration
          </Reveal>
          <ol className="relative m-0 mt-[1.6rem] list-none border-b border-[#e4dfcb] p-0 text-left">
            <span className="hidden" aria-hidden="true" />
            {wedding.schedule.map((item) => (
              <Reveal as="li" className="m-0 block p-0" key={item.title}>
                <div className="hidden" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-[#1c3f86]" />
                </div>
                <div className="grid grid-cols-[6.4rem_1fr] items-baseline gap-x-4 border-t border-[#e4dfcb] bg-transparent px-0 py-[1.05rem]">
                  <span className="col-start-1 row-span-2 m-0 bg-transparent p-0 font-[family-name:var(--font-serif)] text-[1.35rem] font-medium text-[#1c3f86]">{item.time}</span>
                  <p className="col-start-2 m-0 font-[family-name:var(--font-serif)] text-[1.2rem] font-medium text-[#1a2744]">{item.title}</p>
                  <em className="col-start-2 m-0 block font-[family-name:var(--font-ui)] text-[0.85rem] font-light text-[#6d7384] not-italic">{item.detail}</em>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
        <GoldRose place="schedule" />
      </Reveal>

      <Reveal as="section" variant="section" className="relative overflow-hidden bg-[#f6f4ec] px-6 pt-[3.6rem] pb-[2.6rem] text-left text-[#1a2744]">
        <div className="mx-auto max-w-[36rem]">
          <Reveal className="hidden">
            <GoldDivider compact />
          </Reveal>
          <Reveal as="p" className="m-0 mb-[0.4rem] font-[family-name:var(--font-ui)] text-[0.62rem] font-medium tracking-[0.42em] text-[#1c3f86] uppercase before:mr-[0.65rem] before:inline-block before:h-px before:w-6 before:bg-[#b08a4f] before:align-middle before:content-['']">
            Attire
          </Reveal>
          <Reveal as="h2" className="mb-2 font-[family-name:var(--font-serif)] font-medium tracking-[-0.03em] text-[3.25rem] leading-[1.1] font-normal text-[#1a2744]">
            Aso-Ebi
          </Reveal>
          <Reveal as="p" className="m-0 font-[family-name:var(--font-ui)] text-[0.95rem] font-light text-[#6d7384]">
            We&apos;d love for you to celebrate in our colours.
          </Reveal>
          <DetailCard
            account={wedding.asoEbi.account}
            rows={[
              ["Colors", wedding.asoEbi.colors],
              ["Price", wedding.asoEbi.price],
              ["Bank", wedding.asoEbi.bank],
              ["Account Holder", wedding.asoEbi.holder],
            ]}
          />
        </div>
        <GoldRose />
      </Reveal>

      <Reveal as="section" variant="section" className="relative overflow-hidden bg-[#f6f4ec] px-6 pt-[3.6rem] pb-[2.6rem] text-left text-[#1a2744]">
        <div className="mx-auto max-w-[36rem]">
          <Reveal className="hidden">
            <GoldDivider compact />
          </Reveal>
          <Reveal as="p" className="m-0 mb-[0.4rem] font-[family-name:var(--font-ui)] text-[0.62rem] font-medium tracking-[0.42em] text-[#1c3f86] uppercase before:mr-[0.65rem] before:inline-block before:h-px before:w-6 before:bg-[#b08a4f] before:align-middle before:content-['']">
            With gratitude
          </Reveal>
          <Reveal as="h2" className="mb-[0.4rem] font-[family-name:var(--font-serif)] font-medium tracking-[-0.03em] text-[2.75rem] leading-[1.15] font-normal text-[#1a2744]">
            Gift &amp; Bank Info
          </Reveal>
          <Reveal as="p" className="m-0 font-[family-name:var(--font-ui)] text-[0.9rem] leading-[1.8] font-light text-[#6d7384]">
            {wedding.gift.note}
          </Reveal>
          <DetailCard
            account={wedding.gift.account}
            rows={[
              ["Bank", wedding.gift.bank],
              ["Account Holder", wedding.gift.holder],
            ]}
          />
        </div>
        <GoldRose place="gifts" />
      </Reveal>

      <Reveal as="section" variant="section" className="relative overflow-hidden bg-[#f6f4ec] px-6 pt-[3.6rem] pb-[2.6rem] text-left text-[#1a2744]">
        <div className="mx-auto max-w-[34rem]">
          <Reveal className="hidden">
            <GoldDivider compact />
          </Reveal>
          <Reveal as="p" className="m-0 mb-[0.4rem] font-[family-name:var(--font-ui)] text-[0.62rem] font-medium tracking-[0.42em] text-[#1c3f86] uppercase before:mr-[0.65rem] before:inline-block before:h-px before:w-6 before:bg-[#b08a4f] before:align-middle before:content-['']">
            Where to stay
          </Reveal>
          <Reveal as="h2" className="mb-[0.35rem] font-[family-name:var(--font-serif)] font-medium tracking-[-0.03em] text-[2.75rem] leading-[1.15] font-normal text-[#1a2744]">
            Accommodation
          </Reveal>
          <Reveal as="p" className="m-0 font-[family-name:var(--font-ui)] text-[0.9rem] font-light text-[#6d7384]">
            We&apos;ve compiled some options for you to stay nearby
          </Reveal>
          <div className="mt-[1.4rem] flex flex-col gap-0 border-b border-[#e4dfcb]">
            {wedding.hotels.map((hotel) => (
              <Reveal
                key={hotel.name}
                className="block border-t border-[#e4dfcb] bg-transparent px-0 py-[1.15rem] text-left no-underline shadow-none"
              >
                <span className="hidden" aria-hidden="true">
                  <HotelIcon />
                </span>
                <span>
                  <strong className="block font-[family-name:var(--font-serif)] text-[1.35rem] font-medium text-[#1a2744]">{hotel.name}</strong>
                  <em className="mt-[0.15rem] block font-[family-name:var(--font-ui)] text-[0.78rem] leading-[1.45] font-light text-[#6d7384] not-italic">{hotel.detail}</em>
                </span>
              </Reveal>
            ))}
          </div>
        </div>
        <GoldRose place="hotels" />
      </Reveal>

      <Reveal as="section" variant="section" className="relative bg-[#f6f4ec] px-6 pt-[3.6rem] pb-[2.6rem] text-left text-[#1a2744]">
        <div className="mx-auto max-w-[34rem]">
          <Reveal className="hidden">
            <GoldDivider compact />
          </Reveal>
          <Reveal as="p" className="m-0 mb-[0.4rem] font-[family-name:var(--font-ui)] text-[0.62rem] font-medium tracking-[0.42em] text-[#1c3f86] uppercase before:mr-[0.65rem] before:inline-block before:h-px before:w-6 before:bg-[#b08a4f] before:align-middle before:content-['']">
            Have questions?
          </Reveal>
          <Reveal as="h2" className="m-0 font-[family-name:var(--font-serif)] font-medium tracking-[-0.03em] text-[2.75rem] leading-[1.15] font-normal text-[#1a2744]">
            Frequently Asked Questions
          </Reveal>
          <div className="mt-[1.4rem] overflow-hidden border-t border-[#d7c09a] text-left">
            {wedding.faqs.map((item, index) => {
              const open = openFaq === index;
              return (
                <Reveal key={item.q} className="border-b border-[#e4dfcb] last:border-b-0">
                  <button className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-0 py-[1.1rem] text-left font-[family-name:var(--font-serif)] text-[1.28rem] font-medium text-[#1a2744]" type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : index)}>
                    <span>{item.q}</span>
                    <svg viewBox="0 0 24 24" className={`size-4 shrink-0 text-[#1c3f86] transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true">
                      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {open && <p className="bg-transparent px-0 pt-0 pb-[1.1rem] font-[family-name:var(--font-ui)] text-[0.85rem] leading-[1.65] font-light text-[#6d7384]">{item.a}</p>}
                </Reveal>
              );
            })}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className="relative overflow-hidden bg-[#f6f4ec] px-6 pt-[3.6rem] pb-[2.6rem] text-left text-[#1a2744]">
        <div className="mx-auto max-w-[34rem]">
          <Reveal className="hidden">
            <GoldDivider compact />
          </Reveal>
          <Reveal as="p" className="m-0 mb-[0.4rem] font-[family-name:var(--font-ui)] text-[0.62rem] font-medium tracking-[0.42em] text-[#1c3f86] uppercase before:mr-[0.65rem] before:inline-block before:h-px before:w-6 before:bg-[#b08a4f] before:align-middle before:content-['']">
            Kindly respond
          </Reveal>
          <Reveal as="h2" className="mb-[0.4rem] font-[family-name:var(--font-serif)] font-medium tracking-[-0.03em] text-[2.75rem] leading-[1.15] font-normal text-[#1a2744]">
            Confirm Your Attendance
          </Reveal>
          <Reveal as="p" className="mb-[2.4rem] font-[family-name:var(--font-ui)] text-[0.9rem] font-light text-[#6d7384]">
            Please let us know if you can make it
          </Reveal>
          <Reveal variant="section" className="bg-transparent px-0 pt-[0.4rem]">
            {sent ? (
              <Reveal as="p" className="m-0 font-[family-name:var(--font-ui)] text-base font-normal text-[#1a2744]">
                Thank you. Your reply has been noted for this preview.
              </Reveal>
            ) : (
              <form onSubmit={submitRsvp}>
                <Reveal as="label" className="mb-[0.9rem] block text-left text-base text-inherit">
                  <span className="mb-[0.3rem] block font-[family-name:var(--font-ui)] text-[0.7rem] tracking-[0.12em] text-[#6b7280] uppercase">Full name</span>
                  <input className="w-full border-0 border-b border-[#1c3f86] bg-transparent px-0 py-[0.7rem] font-[family-name:var(--font-ui)] text-[0.85rem] text-[#1a2744] placeholder:text-[#9ca3af]" name="name" required placeholder="Your name" autoComplete="name" />
                </Reveal>
                <Reveal as="label" className="mb-[0.9rem] block text-left text-base text-inherit">
                  <span className="mb-[0.3rem] block font-[family-name:var(--font-ui)] text-[0.7rem] tracking-[0.12em] text-[#6b7280] uppercase">Phone number</span>
                  <input className="w-full border-0 border-b border-[#1c3f86] bg-transparent px-0 py-[0.7rem] font-[family-name:var(--font-ui)] text-[0.85rem] text-[#1a2744] placeholder:text-[#9ca3af]" name="phone" required placeholder="Your phone number" autoComplete="tel" />
                </Reveal>
                <Reveal as="label" className="mb-[0.9rem] block text-left text-base text-inherit">
                  <span className="mb-[0.3rem] block font-[family-name:var(--font-ui)] text-[0.7rem] tracking-[0.12em] text-[#6b7280] uppercase">Will you be attending?</span>
                  <select className="w-full border-0 border-b border-[#1c3f86] bg-transparent px-0 py-[0.7rem] font-[family-name:var(--font-ui)] text-[0.85rem] text-[#1a2744] invalid:text-[#9ca3af]" name="attending" required defaultValue="">
                    <option value="" disabled>
                      Yes, with pleasure / Sorry, can&apos;t make it
                    </option>
                    <option value="yes">Yes, with pleasure</option>
                    <option value="no">Sorry, can&apos;t make it</option>
                  </select>
                </Reveal>
                <Reveal as="label" className="mb-[0.9rem] block text-left text-base text-inherit">
                  <span className="mb-[0.3rem] block font-[family-name:var(--font-ui)] text-[0.7rem] tracking-[0.12em] text-[#6b7280] uppercase">Bringing additional guests?</span>
                  <input
                    className="w-full border-0 border-b border-[#1c3f86] bg-transparent px-0 py-[0.7rem] font-[family-name:var(--font-ui)] text-[0.85rem] text-[#1a2744]"
                    name="guests"
                    type="number"
                    min={0}
                    max={8}
                    value={guests}
                    onChange={(event) => setGuests(Math.min(8, Math.max(0, Number(event.target.value) || 0)))}
                  />
                </Reveal>
                <Reveal as="button" className="mt-[1.6rem] w-full cursor-pointer rounded-none border-0 bg-[#0d1730] px-[0.85rem] py-[0.85rem] font-[family-name:var(--font-ui)] text-[0.85rem] font-medium tracking-[0.16em] text-white uppercase" type="submit">
                  Send my RSVP
                </Reveal>
              </form>
            )}
            <Reveal as="p" className="mt-[0.8rem] font-[family-name:var(--font-ui)] text-[0.7rem] text-[#9ca3af]">
              Sample. Your questions come from the RSVP form you set up.
            </Reveal>
          </Reveal>
        </div>
      </Reveal>

      <Reveal as="footer" variant="section" className="relative bg-[#0b1a3a] px-6 pt-[3.8rem] pb-[6.5rem] text-center text-[#e3d9b8]">
        <Reveal as="p" className="m-0 font-[family-name:var(--font-serif)] text-[clamp(2.6rem,7vw,3.6rem)] leading-[1.15] font-medium tracking-[-0.03em] text-[#f7f3ea] after:mx-auto after:mt-4 after:block after:h-px after:w-16 after:bg-[#e6d3a4] after:content-['']">
          {wedding.couple}
        </Reveal>
        <Reveal as="p" className="mt-2 font-[family-name:var(--font-ui)] text-[0.6rem] font-medium tracking-[0.3em] text-[rgba(227,217,184,0.8)] uppercase">
          {wedding.shortDate}
        </Reveal>
        <Reveal as="p" className="mt-10 font-[family-name:var(--font-ui)] text-[0.55rem] tracking-[0.25em] text-[rgba(227,217,184,0.467)] uppercase [&_a]:text-inherit [&_a]:no-underline">
          Made with love by Invytelle
        </Reveal>
      </Reveal>
    </div>
  );
}
