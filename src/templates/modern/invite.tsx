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

const heroSlides = ["/photos/story-4.jpg", "/photos/story-2.jpg"];

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

const band = "relative mx-auto w-full max-w-5xl px-6 py-16 text-left md:px-10 md:py-20";
const kickerClass =
  "m-0 font-[family-name:var(--font-ui)] text-[0.68rem] font-medium tracking-[0.32em] text-[#9a7b45] uppercase";
const headingClass =
  "m-0 mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,8vw,4.6rem)] leading-[0.88] font-extrabold tracking-[-0.05em] text-[#121212]";
const noteClass =
  "mt-4 max-w-xl font-[family-name:var(--font-ui)] text-base leading-relaxed text-[#5c564e]";
const pillClass =
  "inline-flex cursor-pointer items-center rounded-full border-0 bg-[#121212] px-5 py-3 font-[family-name:var(--font-ui)] text-[0.72rem] tracking-[0.18em] text-white uppercase no-underline transition duration-300 hover:bg-[#2a2a2a]";
const fieldLabelClass =
  "m-0 font-[family-name:var(--font-ui)] text-[0.62rem] tracking-[0.22em] text-[#9a7b45] uppercase";
const fieldValueClass =
  "mt-1 block font-[family-name:var(--font-display)] text-2xl font-bold tracking-[-0.04em] text-[#121212]";

function Rule() {
  return <span className="my-5 block h-px w-12 bg-[#e6d3a4]" aria-hidden="true" />;
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
    <Reveal variant="section" className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <Reveal className="rounded-2xl bg-white px-5 py-4 text-[#121212]" key={label}>
          <p className={fieldLabelClass}>{label}</p>
          <strong className={fieldValueClass}>{value}</strong>
        </Reveal>
      ))}
      <Reveal className="rounded-2xl border border-[#e6d3a4] bg-[#121212] px-5 py-4 text-white sm:col-span-2">
        <p className="m-0 font-[family-name:var(--font-ui)] text-[0.62rem] tracking-[0.22em] text-[#e6d3a4] uppercase">Account number</p>
        <strong className="mt-1 block font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-[-0.05em]">{account}</strong>
        <button className="mt-4 cursor-pointer rounded-full border-0 bg-white px-4 py-2 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.16em] text-[#121212] uppercase" type="button" onClick={copy}>
          {copied ? "Copied" : "Copy number"}
        </button>
      </Reveal>
    </Reveal>
  );
}

export function ModernInvite({ onClose }: { onClose: () => void }) {
  const countdown = useCountdown(wedding.ceremonyAt);
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

  const ticker = "Adaeze & Emeka  ·  17 October 2026  ·  Eko Hotels  ·  Victoria Island  ·  ";

  return (
    <div className="bg-[#f3f1ec] text-[#121212]">
      <button
        className="fixed top-[18px] left-[18px] z-30 cursor-pointer border-0 bg-transparent p-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.22em] text-white uppercase"
        type="button"
        onClick={onClose}
      >
        Close
      </button>

      <section className="relative min-h-[100dvh] overflow-hidden bg-[#0c0c0b]">
        <div className="absolute inset-0" aria-hidden="true">
          {heroSlides.map((src, index) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover object-[center_18%] transition-opacity duration-[1.8s] ease-out motion-safe:animate-[modern-live_16s_ease-in-out_infinite_alternate] motion-reduce:animate-none ${index === slide ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,8,0.82)_0%,rgba(8,8,8,0.12)_48%,rgba(8,8,8,0.35)_100%)]" />
        </div>
        <div className="relative z-[1] flex min-h-[100dvh] max-w-5xl flex-col justify-end px-6 pt-28 pb-28 md:px-10">
          <Reveal as="p" className="m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.34em] text-[#e6d3a4] uppercase">
            17 October 2026
          </Reveal>
          <Reveal
            as="h1"
            className="m-0 mt-3 max-w-[9ch] font-[family-name:var(--font-display)] text-[clamp(3.6rem,12vw,6.4rem)] leading-[0.86] font-extrabold tracking-[-0.06em] text-white"
          >
            Adaeze &amp; Emeka
          </Reveal>
          <Reveal as="p" className="mt-5 max-w-md font-[family-name:var(--font-ui)] text-sm leading-relaxed text-white/80">
            {wedding.dateLabel}
            <span className="mt-1 block">{wedding.venue}, Victoria Island</span>
          </Reveal>
          <Reveal as="button" className="mt-8 w-fit cursor-pointer rounded-full border-0 bg-white px-5 py-3 font-[family-name:var(--font-ui)] text-[0.72rem] tracking-[0.18em] text-[#121212] uppercase" type="button" onClick={saveTheDateIcs}>
            Save the date
          </Reveal>
        </div>
      </section>

      <div className="overflow-hidden border-y border-white/10 bg-[#121212] py-3">
        <p className="w-max font-[family-name:var(--font-ui)] text-[0.72rem] tracking-[0.28em] text-[#e6d3a4] uppercase motion-safe:animate-[genz-slide_26s_linear_infinite] motion-reduce:animate-none">
          {ticker + ticker}
        </p>
      </div>

      <Reveal as="section" variant="section" className={band} id="countdown">
        <Reveal as="p" className={kickerClass}>Until the vows</Reveal>
        <Reveal as="h2" className={headingClass}>17 October</Reveal>
        <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
          {[
            [countdown.days, "Days"],
            [countdown.hours, "Hours"],
            [countdown.minutes, "Minutes"],
          ].map(([value, label]) => (
            <Reveal key={label} className="rounded-3xl bg-[#121212] px-3 py-5 text-white">
              <strong className="block font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,3rem)] leading-none font-extrabold tracking-[-0.05em]">
                {value}
              </strong>
              <span className="mt-2 block font-[family-name:var(--font-ui)] text-[0.62rem] tracking-[0.2em] text-[#e6d3a4] uppercase">{label}</span>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className={`${band} pt-0`}>
        <Reveal as="p" className={kickerClass}>Adaeze &amp; Emeka</Reveal>
        <Reveal as="h2" className={headingClass}>Our story</Reveal>
        <Reveal as="blockquote" className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-[clamp(1.4rem,3vw,2rem)] leading-[1.25] font-bold tracking-[-0.04em] text-[#121212]">
          {wedding.story}
        </Reveal>
        <div className="mt-8 grid items-start gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="overflow-hidden rounded-[1.6rem]">
            <img src="/photos/story-4.jpg" alt="Adaeze and Emeka" className="aspect-[4/5] w-full object-cover object-[center_18%] motion-safe:animate-[modern-live_18s_ease-in-out_infinite_alternate] motion-reduce:animate-none" />
          </Reveal>
          <div className="grid gap-4">
            <Reveal className="overflow-hidden rounded-[1.6rem] md:mt-10">
              <img src="/photos/story-2.jpg" alt="Adaeze and Emeka dressed for the evening" className="aspect-square w-full object-cover motion-safe:animate-[modern-live_14s_ease-in-out_infinite_alternate] motion-reduce:animate-none" />
            </Reveal>
            <Reveal className="overflow-hidden rounded-[1.6rem]">
              <img src="/photos/rings.jpg" alt="Wedding rings" className="aspect-[5/3] w-full object-cover motion-safe:animate-[modern-live_20s_ease-in-out_infinite_alternate] motion-reduce:animate-none" />
            </Reveal>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className={`${band} bg-white`}>
        <Reveal as="p" className={kickerClass}>Frames</Reveal>
        <Reveal as="h2" className={headingClass}>Gallery</Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["/photos/venue-1.jpg", "The reception room", "col-span-2 aspect-[4/3]"],
            ["/photos/florals.jpg", "Table flowers", "aspect-square"],
            ["/photos/walk.jpg", "Walking in together", "aspect-square"],
            ["/photos/bouquet.jpg", "Bouquet", "aspect-[4/3]"],
            ["/photos/kiss.jpg", "A quiet moment", "aspect-[4/3]"],
          ].map(([src, alt, shape]) => (
            <Reveal key={src} className={`overflow-hidden rounded-[1.3rem] ${shape}`}>
              <img src={src} alt={alt} className="h-full w-full object-cover transition duration-700 ease-out hover:scale-105 motion-safe:animate-[modern-live_22s_ease-in-out_infinite_alternate] motion-reduce:animate-none" />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className={band} id="venue">
        <Reveal as="p" className={kickerClass}>Lagos</Reveal>
        <Reveal as="h2" className={headingClass}>{wedding.venue}</Reveal>
        <Reveal className="relative mt-8 overflow-hidden rounded-[1.8rem]">
          <img src="/photos/venue-1.jpg" alt="The reception room at Eko Hotels" className="h-[min(62vh,520px)] w-full object-cover object-[center_40%] motion-safe:animate-[modern-live_20s_ease-in-out_infinite_alternate] motion-reduce:animate-none" />
          <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.16em] text-[#121212] uppercase">
            Victoria Island
          </span>
        </Reveal>
        <Reveal as="p" className={noteClass}>{wedding.address}</Reveal>
        <Reveal as="p" className={noteClass}>
          {wedding.dateLabel}
          <span className="mt-1 block">{wedding.starts}</span>
        </Reveal>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className={pillClass} type="button" onClick={saveTheDateIcs}>Add to calendar</button>
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className={`${band} pt-0`}>
        <Reveal as="p" className={kickerClass}>The day</Reveal>
        <Reveal as="h2" className={headingClass}>From 4pm</Reveal>
        <Reveal as="p" className={noteClass}>Join us through every moment of the celebration.</Reveal>
        <ol className="mt-8 grid list-none gap-3 p-0 md:grid-cols-2">
          {wedding.schedule.map((item, index) => (
            <Reveal as="li" className="rounded-[1.4rem] bg-white p-5" key={item.title}>
              <time className="font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.2em] text-[#9a7b45] uppercase">{item.time}</time>
              <strong className="mt-2 block font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-[-0.04em]">
                <span className="mr-2 text-[#e6d3a4]">0{index + 1}</span>
                {item.title}
              </strong>
              <em className="mt-1 block font-[family-name:var(--font-ui)] text-sm text-[#5c564e] not-italic">{item.detail}</em>
            </Reveal>
          ))}
        </ol>
      </Reveal>

      <Reveal as="section" variant="section" className={`${band} bg-[#121212] text-white`}>
        <Reveal as="p" className="m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.32em] text-[#e6d3a4] uppercase">What to wear</Reveal>
        <Reveal as="h2" className="m-0 mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,8vw,4.6rem)] leading-[0.88] font-extrabold tracking-[-0.05em]">Aso-ebi</Reveal>
        <Reveal as="p" className="mt-4 max-w-xl font-[family-name:var(--font-ui)] text-base leading-relaxed text-white/70">
          We&apos;d love you in royal blue and gold.
        </Reveal>
        <div className="mt-8 grid max-w-xl grid-cols-2 gap-3">
          <Reveal className="flex h-36 items-end rounded-[1.4rem] bg-[#1c3f86] p-4 font-[family-name:var(--font-display)] text-xl font-extrabold tracking-[-0.04em]">Royal blue</Reveal>
          <Reveal className="flex h-36 items-end rounded-[1.4rem] bg-[linear-gradient(145deg,#f3e2bc,#b08a4f)] p-4 font-[family-name:var(--font-display)] text-xl font-extrabold tracking-[-0.04em] text-[#2a2112]">Gold</Reveal>
        </div>
        <DetailCard
          account={wedding.asoEbi.account}
          rows={[
            ["Colours", wedding.asoEbi.colors],
            ["Price", wedding.asoEbi.price],
            ["Bank", wedding.asoEbi.bank],
            ["Account holder", wedding.asoEbi.holder],
          ]}
        />
      </Reveal>

      <Reveal as="section" variant="section" className={band}>
        <Reveal as="p" className={kickerClass}>If you wish</Reveal>
        <Reveal as="h2" className={headingClass}>A gift</Reveal>
        <Reveal as="p" className={noteClass}>{wedding.gift.note}</Reveal>
        <DetailCard
          account={wedding.gift.account}
          rows={[
            ["Bank", wedding.gift.bank],
            ["Account holder", wedding.gift.holder],
          ]}
        />
      </Reveal>

      <Reveal as="section" variant="section" className={`${band} pt-0`}>
        <Reveal as="p" className={kickerClass}>Stay nearby</Reveal>
        <Reveal as="h2" className={headingClass}>Hotels</Reveal>
        <div className="mt-8 grid gap-3">
          {wedding.hotels.map((hotel) => (
            <Reveal
              className="block rounded-[1.4rem] bg-white px-5 py-5 text-inherit"
              key={hotel.name}
            >
              <strong className="block font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-[-0.04em]">{hotel.name}</strong>
              <em className="mt-2 block font-[family-name:var(--font-ui)] text-sm leading-relaxed text-[#5c564e] not-italic">{hotel.detail}</em>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className={`${band} pt-0`}>
        <Reveal as="p" className={kickerClass}>Before you come</Reveal>
        <Reveal as="h2" className={headingClass}>Questions</Reveal>
        <div className="mt-6 max-w-2xl">
          {wedding.faqs.map((item, index) => {
            const open = openFaq === index;
            return (
              <Reveal key={item.q}>
                <button
                  className="w-full cursor-pointer border-0 border-t border-[#121212]/15 bg-transparent py-4 text-left font-[family-name:var(--font-display)] text-xl font-bold tracking-[-0.03em] text-[#121212]"
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? null : index)}
                >
                  {item.q}
                </button>
                {open && <p className="m-0 pb-4 font-[family-name:var(--font-ui)] text-sm leading-relaxed text-[#5c564e]">{item.a}</p>}
              </Reveal>
            );
          })}
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className={band}>
        <Reveal as="p" className={kickerClass}>Rsvp</Reveal>
        <Reveal as="h2" className={headingClass}>Will you be there?</Reveal>
        <Reveal as="p" className={noteClass}>Please let us know if you can make it.</Reveal>
        {sent ? (
          <Reveal as="p" className="mt-6 font-[family-name:var(--font-ui)] text-sm text-[#5c564e]">
            Thank you. Your reply has been noted for this preview.
          </Reveal>
        ) : (
          <form className="mt-8 max-w-md" onSubmit={submitRsvp}>
            {[
              ["Full name", "name", "text", "Your name", "name"],
              ["Phone number", "phone", "tel", "Your phone number", "tel"],
            ].map(([label, name, type, placeholder, auto]) => (
              <label key={name} className="mb-5 block">
                <span className="mb-1 block font-[family-name:var(--font-ui)] text-[0.62rem] tracking-[0.2em] text-[#9a7b45] uppercase">{label}</span>
                <input
                  className="w-full border-0 border-b border-[#121212] bg-transparent py-2 font-[family-name:var(--font-display)] text-xl text-[#121212] outline-none"
                  name={name}
                  type={type}
                  required
                  placeholder={placeholder}
                  autoComplete={auto}
                />
              </label>
            ))}
            <label className="mb-5 block">
              <span className="mb-1 block font-[family-name:var(--font-ui)] text-[0.62rem] tracking-[0.2em] text-[#9a7b45] uppercase">Will you be attending?</span>
              <select className="w-full border-0 border-b border-[#121212] bg-transparent py-2 font-[family-name:var(--font-display)] text-xl text-[#121212] outline-none" name="attending" required defaultValue="">
                <option value="" disabled>Yes, with pleasure / Sorry, can&apos;t make it</option>
                <option value="yes">Yes, with pleasure</option>
                <option value="no">Sorry, can&apos;t make it</option>
              </select>
            </label>
            <label className="mb-5 block">
              <span className="mb-1 block font-[family-name:var(--font-ui)] text-[0.62rem] tracking-[0.2em] text-[#9a7b45] uppercase">Additional guests</span>
              <input
                className="w-full border-0 border-b border-[#121212] bg-transparent py-2 font-[family-name:var(--font-display)] text-xl text-[#121212] outline-none"
                name="guests"
                type="number"
                min={0}
                max={8}
                value={guests}
                onChange={(event) => setGuests(Math.min(8, Math.max(0, Number(event.target.value) || 0)))}
              />
            </label>
            <button className={pillClass} type="submit">Send my reply</button>
          </form>
        )}
        <p className="mt-4 max-w-md font-[family-name:var(--font-ui)] text-xs text-[#8a8176]">
          Sample. Your questions come from the RSVP form you set up.
        </p>
      </Reveal>

      <footer className="bg-[#121212] px-6 py-20 pb-32 text-white md:px-10">
        <p className="m-0 max-w-5xl font-[family-name:var(--font-display)] text-[clamp(3rem,10vw,6rem)] leading-[0.86] font-extrabold tracking-[-0.06em]">
          {wedding.couple}
        </p>
        <Rule />
        <span className="block font-[family-name:var(--font-ui)] text-[0.72rem] tracking-[0.24em] text-[#e6d3a4] uppercase">{wedding.shortDate}</span>
        <small className="mt-8 block font-[family-name:var(--font-ui)] text-[0.62rem] tracking-[0.2em] text-white/50 uppercase">
          Made with love by Invytelle
        </small>
      </footer>
    </div>
  );
}
