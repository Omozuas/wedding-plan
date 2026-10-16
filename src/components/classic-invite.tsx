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

function GoldDivider() {
  return (
    <svg className="gold-divider" viewBox="0 0 280 32" aria-hidden="true">
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
    <svg viewBox="0 0 200 296" aria-hidden="true">
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

function GoldRose() {
  return (
    <svg className="gold-rose" viewBox="0 0 120 140" aria-hidden="true">
      <path d="M78 128c-8-18 2-32 10-42" fill="none" stroke="#8d6418" strokeWidth="1.4" />
      <path d="M86 92c8 4 16 2 18-6" fill="none" stroke="#c9a24a" strokeWidth="1" />
      <ellipse cx="70" cy="108" rx="16" ry="7" fill="#c9a24a" transform="rotate(-30 70 108)" />
      <ellipse cx="58" cy="96" rx="14" ry="6" fill="#e0bc62" transform="rotate(20 58 96)" />
      <g transform="translate(62 48)">
        <ellipse cx="18" cy="22" rx="16" ry="10" fill="#f3dd9a" transform="rotate(-20 18 22)" />
        <ellipse cx="28" cy="16" rx="14" ry="9" fill="#e0bc62" transform="rotate(25 28 16)" />
        <ellipse cx="16" cy="12" rx="12" ry="8" fill="#c9a24a" transform="rotate(-40 16 12)" />
        <ellipse cx="24" cy="20" rx="8" ry="6" fill="#f8e7b5" />
      </g>
    </svg>
  );
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

function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <svg viewBox="0 0 80 16">
        <path
          d="M2 8h24M54 8h24M40 8c-4-6-8-6-10 0 2 6 6 6 10 0zm0 0c4-6 8-6 10 0-2 6-6 6-10 0z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        />
      </svg>
      <span />
    </div>
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
    <Reveal variant="section" className="attire-card">
      {rows.map(([label, value]) => (
        <Reveal className="attire-row" key={label}>
          <p>{label}</p>
          <strong>{value}</strong>
        </Reveal>
      ))}
      <Reveal className="attire-number">
        <p>Account Number</p>
        <div>{account}</div>
        <button type="button" onClick={copy}>
          {copied ? "Copied" : "Copy Account Number"}
        </button>
      </Reveal>
    </Reveal>
  );
}

export function ClassicInvite({
  onClose,
  layout,
}: {
  onClose: () => void;
  layout: "classic" | "harbour";
}) {
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
    <div className={layout === "harbour" ? "invite harbour" : "invite"}>
      <button className="back" type="button" onClick={onClose}>
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
          className="pointer-events-none absolute inset-0 bg-hero-veil md:bg-hero-veil-wide"
          style={{ opacity: 1 - heroScroll.progress * 0.35 }}
        />
        <div className="relative z-2 flex w-full max-w-[40rem] flex-col items-center text-center font-[family-name:var(--font-ui)] text-black">
          <p
            className="m-0 mb-[clamp(1rem,3vh,1.5rem)] text-[clamp(0.58rem,1.5vw,0.72rem)] leading-[1.9] font-medium tracking-[clamp(0.22em,1.4vw,0.55em)] uppercase"
            style={heroPiece(heroScroll.progress, 0)}
          >
            Together with
            <br />
            their families
          </p>
          <h1
            className="hero-names m-0 max-w-[min(9.2ch,100%)] font-[family-name:var(--font-script)] text-[clamp(3.35rem,12vw,7.5rem)] leading-[1.05] font-normal text-black"
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
            className="mt-[clamp(1.5rem,4vh,2.25rem)] cursor-pointer rounded-[2rem] border border-black/50 bg-white/20 px-[clamp(1.4rem,4vw,2.5rem)] py-3 text-[clamp(0.62rem,1.4vw,0.75rem)] font-medium tracking-[clamp(0.14em,0.8vw,0.3em)] text-black uppercase shadow-[0_4px_24px_rgba(0,0,0,0.12)] backdrop-blur-[12px]"
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

      <Reveal as="section" variant="section" className="countdown" id="countdown">
        <Reveal>
          <GoldDivider />
        </Reveal>
        <Reveal as="p" className="countdown-kicker">
          Until we say &apos;I do&apos;
        </Reveal>
        <Reveal as="h2">Countdown</Reveal>
        <div className="clock">
          {[
            [countdown.days, "Days"],
            [countdown.hours, "Hours"],
            [countdown.minutes, "Minutes"],
          ].map(([value, label]) => (
            <Reveal className="dial" key={label}>
              <LeafFrame />
              <div className="dial-copy">
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className="story">
        <Reveal>
          <GoldDivider />
        </Reveal>
        <Reveal as="p" className="note-kicker">
          A note from us
        </Reveal>
        <Reveal as="h2">Our Story</Reveal>
        {layout === "harbour" ? (
          <Reveal className="harbour-spread">
            <figure>
              <img src="/photos/story-4.jpg" alt="Adaeze and Emeka" />
              <figcaption>Adaeze &amp; Emeka</figcaption>
            </figure>
            <img className="harbour-detail" src="/photos/rings.jpg" alt="Wedding rings" />
          </Reveal>
        ) : (
          <Reveal className="gold-frame">
            <img src="/photos/story-2.jpg" alt="Couple in black formal wear" />
          </Reveal>
        )}
        <Reveal as="p" className="prose">
          {wedding.story}
        </Reveal>
      </Reveal>

      <Reveal as="section" variant="section" className="gallery">
        <Reveal as="p" className="note-kicker">
          Memories
        </Reveal>
        <Reveal as="h2">Gallery</Reveal>
        {layout === "harbour" ? (
          <div className="harbour-album">
            <Reveal as="img" src="/photos/story-2.jpg" alt="Adaeze and Emeka in formal black" />
            <Reveal as="img" src="/photos/florals.jpg" alt="Table flowers" />
            <Reveal as="img" src="/photos/bouquet.jpg" alt="Bouquet" />
          </div>
        ) : (
          <div className="memory-grid">
            <Reveal as="img" src="/photos/story-2.jpg" alt="Couple standing together in formal black" />
            <Reveal as="img" src="/photos/story-4.jpg" alt="Couple in a close portrait" />
            <Reveal as="img" src="/photos/story-4.jpg" alt="Couple embracing" />
          </div>
        )}
      </Reveal>

      <Reveal as="section" variant="section" className="venue" id="venue">
        <div className="venue-sheet">
          <Reveal className="venue-divider">
            <GoldDivider />
          </Reveal>
          <Reveal as="p" className="venue-kicker">
            The Celebration
          </Reveal>
          <Reveal as="h2">{wedding.venue}</Reveal>
          <Reveal className="venue-photo">
            <img src="/photos/venue-1.jpg" alt="Wedding reception with white drapes and chandeliers" />
          </Reveal>
          {layout === "harbour" ? (
            <div className="harbour-pair">
              <Reveal as="img" src="/photos/kiss.jpg" alt="A close moment" />
              <Reveal as="img" src="/photos/couple.jpg" alt="The couple seated together" />
            </div>
          ) : null}
          <div className="venue-facts">
            <Reveal as="a" className="venue-row" href={wedding.mapsUrl} target="_blank" rel="noreferrer">
              <span className="venue-icon">
                <PinIcon />
              </span>
              <p>{wedding.address}</p>
            </Reveal>
            <Reveal className="venue-row">
              <span className="venue-icon">
                <CalendarIcon />
              </span>
              <p>{wedding.dateLabel}</p>
            </Reveal>
            <Reveal className="venue-row">
              <span className="venue-icon">
                <ClockIcon />
              </span>
              <p>{wedding.starts}</p>
            </Reveal>
          </div>
          <Reveal className="venue-actions">
            <a className="venue-go" href={wedding.mapsUrl} target="_blank" rel="noreferrer">
              How to get there
            </a>
            <button className="venue-cal" type="button" onClick={saveTheDateIcs}>
              Add to Calendar
            </button>
          </Reveal>
        </div>
        <GoldRose />
      </Reveal>

      <Reveal as="section" variant="section" className="schedule">
        <div className="schedule-sheet">
          <Reveal className="venue-divider">
            <GoldDivider />
          </Reveal>
          <Reveal as="p" className="venue-kicker">
            Schedule
          </Reveal>
          <Reveal as="h2">Program of the Day</Reveal>
          <Reveal as="p" className="schedule-lede">
            Join us through every moment of our celebration
          </Reveal>
          <ol>
            <span className="schedule-line" aria-hidden="true" />
            {wedding.schedule.map((item) => (
              <Reveal as="li" key={item.title}>
                <div className="schedule-dot" aria-hidden="true">
                  <span />
                </div>
                <div className="schedule-card">
                  <p>{item.title}</p>
                  <span>{item.time}</span>
                  <em>{item.detail}</em>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
        <GoldRose />
      </Reveal>

      <Reveal as="section" variant="section" className="attire">
        <div className="attire-sheet">
          <Reveal className="venue-divider">
            <GoldDivider />
          </Reveal>
          <Reveal as="p" className="venue-kicker">
            Attire
          </Reveal>
          <Reveal as="h2">Aso-Ebi</Reveal>
          <Reveal as="p" className="attire-lede">
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

      <Reveal as="section" variant="section" className="gifts">
        <div className="attire-sheet">
          <Reveal className="venue-divider">
            <GoldDivider />
          </Reveal>
          <Reveal as="p" className="venue-kicker">
            With gratitude
          </Reveal>
          <Reveal as="h2">Gift &amp; Bank Info</Reveal>
          <Reveal as="p" className="gift-lede">
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
        <GoldRose />
      </Reveal>

      <Reveal as="section" variant="section" className="hotels">
        <div className="hotel-sheet">
          <Reveal className="venue-divider">
            <GoldDivider />
          </Reveal>
          <Reveal as="p" className="venue-kicker">
            Where to stay
          </Reveal>
          <Reveal as="h2">Accommodation</Reveal>
          <Reveal as="p" className="hotel-lede">
            We&apos;ve compiled some options for you to stay nearby
          </Reveal>
          <div className="hotel-list">
            {wedding.hotels.map((hotel) => (
              <Reveal
                as="a"
                key={hotel.name}
                className="hotel-card"
                href={hotel.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="hotel-icon" aria-hidden="true">
                  <HotelIcon />
                </span>
                <span>
                  <strong>{hotel.name}</strong>
                  <em>{hotel.detail}</em>
                </span>
              </Reveal>
            ))}
          </div>
        </div>
        <GoldRose />
      </Reveal>

      <Reveal as="section" variant="section" className="faq">
        <div className="faq-sheet">
          <Reveal className="venue-divider">
            <GoldDivider />
          </Reveal>
          <Reveal as="p" className="venue-kicker">
            Have questions?
          </Reveal>
          <Reveal as="h2">Frequently Asked Questions</Reveal>
          <div className="faq-list">
            {wedding.faqs.map((item, index) => {
              const open = openFaq === index;
              return (
                <Reveal key={item.q} className={open ? "faq-item open" : "faq-item"}>
                  <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : index)}>
                    <span>{item.q}</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {open && <p>{item.a}</p>}
                </Reveal>
              );
            })}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className="rsvp">
        <div className="rsvp-sheet">
          <Reveal className="venue-divider">
            <GoldDivider />
          </Reveal>
          <Reveal as="p" className="venue-kicker">
            Kindly respond
          </Reveal>
          <Reveal as="h2">Confirm Your Attendance</Reveal>
          <Reveal as="p" className="rsvp-lede">
            Please let us know if you can make it
          </Reveal>
          <Reveal variant="section" className="rsvp-card">
            {sent ? (
              <Reveal as="p" className="thanks">
                Thank you. Your reply has been noted for this preview.
              </Reveal>
            ) : (
              <form onSubmit={submitRsvp}>
                <Reveal as="label">
                  <span>Full name</span>
                  <input name="name" required placeholder="Your name" autoComplete="name" />
                </Reveal>
                <Reveal as="label">
                  <span>Phone number</span>
                  <input name="phone" required placeholder="Your phone number" autoComplete="tel" />
                </Reveal>
                <Reveal as="label">
                  <span>Will you be attending?</span>
                  <select name="attending" required defaultValue="">
                    <option value="" disabled>
                      Yes, with pleasure / Sorry, can&apos;t make it
                    </option>
                    <option value="yes">Yes, with pleasure</option>
                    <option value="no">Sorry, can&apos;t make it</option>
                  </select>
                </Reveal>
                <Reveal as="label">
                  <span>Bringing additional guests?</span>
                  <input
                    name="guests"
                    type="number"
                    min={0}
                    max={8}
                    value={guests}
                    onChange={(event) => setGuests(Math.min(8, Math.max(0, Number(event.target.value) || 0)))}
                  />
                </Reveal>
                <Reveal as="button" type="submit">
                  Send my RSVP
                </Reveal>
              </form>
            )}
            <Reveal as="p" className="sample">
              Sample. Your questions come from the RSVP form you set up.
            </Reveal>
          </Reveal>
        </div>
      </Reveal>

      <Reveal as="footer" variant="section">
        <Reveal as="p" className="script-name">
          {wedding.couple}
        </Reveal>
        <Reveal as="p" className="footer-date">
          {wedding.shortDate}
        </Reveal>
        <Reveal as="p" className="made">
          Made with love by <a href="https://invytelle.com">Invytelle</a>
        </Reveal>
      </Reveal>
      <a className="template-cta" href="https://invytelle.com/dashboard">
        Use this template →
      </a>
    </div>
  );
}
