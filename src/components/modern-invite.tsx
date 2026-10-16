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

function Rule() {
  return <span className="paper-rule" aria-hidden="true" />;
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
    <Reveal variant="section" className="paper-account">
      {rows.map(([label, value]) => (
        <Reveal className="paper-field" key={label}>
          <p>{label}</p>
          <strong>{value}</strong>
        </Reveal>
      ))}
      <Reveal className="paper-field">
        <p>Account number</p>
        <strong>{account}</strong>
        <button type="button" onClick={copy}>
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

  return (
    <div className="invite modern">
      <button className="back" type="button" onClick={onClose}>
        Close
      </button>

      <section className="paper-hero">
        <div className="modern-slides" aria-hidden="true">
          {heroSlides.map((src, index) => (
            <img key={src} src={src} alt="" className={index === slide ? "is-shown" : ""} />
          ))}
          <span className="modern-shade" />
        </div>
        <div className="modern-hero-copy">
          <Reveal as="p" className="paper-kicker">
            Together with their families
          </Reveal>
          <Reveal as="h1" className="paper-names">
            Adaeze &amp; Emeka
          </Reveal>
          <Reveal as="p" className="paper-date">
            {wedding.dateLabel}
            <span>{wedding.venue}</span>
          </Reveal>
          <Reveal as="button" className="paper-link" type="button" onClick={saveTheDateIcs}>
            Save the date
          </Reveal>
        </div>
      </section>

      <Reveal as="section" variant="section" className="paper-block" id="countdown">
        <Reveal as="p" className="paper-kicker">
          Until we say I do
        </Reveal>
        <div className="paper-count">
          {[
            [countdown.days, "Days"],
            [countdown.hours, "Hours"],
            [countdown.minutes, "Minutes"],
          ].map(([value, label]) => (
            <Reveal key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className="paper-block paper-story">
        <Reveal as="p" className="paper-kicker">
          A note from us
        </Reveal>
        <Reveal as="h2">Our story</Reveal>
        <Reveal as="blockquote">{wedding.story}</Reveal>
        <div className="modern-story-photos">
          <Reveal as="img" src="/photos/story-4.jpg" alt="Adaeze and Emeka" />
          <Reveal as="img" src="/photos/story-2.jpg" alt="The couple in formal black" />
          <Reveal as="img" src="/photos/rings.jpg" alt="Wedding rings" />
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className="paper-block">
        <Reveal as="p" className="paper-kicker">
          Memories
        </Reveal>
        <Reveal as="h2">Gallery</Reveal>
        <div className="modern-mosaic">
          <Reveal as="img" src="/photos/venue-1.jpg" alt="The reception room" />
          <Reveal as="img" src="/photos/florals.jpg" alt="Table flowers" />
          <Reveal as="img" src="/photos/walk.jpg" alt="Walking in together" />
          <Reveal as="img" src="/photos/bouquet.jpg" alt="Bouquet" />
          <Reveal as="img" src="/photos/kiss.jpg" alt="A close moment" />
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className="paper-block" id="venue">
        <Reveal as="p" className="paper-kicker">
          The celebration
        </Reveal>
        <Reveal as="h2">{wedding.venue}</Reveal>
        <Reveal className="modern-venue-photo">
          <img src="/photos/venue-1.jpg" alt="Wedding reception with white drapes and chandeliers" />
          <span>Eko Hotels &amp; Suites</span>
        </Reveal>
        <Reveal as="p" className="paper-note">
          {wedding.address}
        </Reveal>
        <Reveal as="p" className="paper-note">
          {wedding.dateLabel}
          <br />
          {wedding.starts}
        </Reveal>
        <div className="paper-actions">
          <a href={wedding.mapsUrl} target="_blank" rel="noreferrer">
            How to get there
          </a>
          <button type="button" onClick={saveTheDateIcs}>
            Add to calendar
          </button>
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className="paper-block">
        <Reveal as="p" className="paper-kicker">
          Schedule
        </Reveal>
        <Reveal as="h2">Program of the day</Reveal>
        <Reveal as="p" className="paper-note">
          Join us through every moment of our celebration
        </Reveal>
        <ol className="paper-program">
          {wedding.schedule.map((item) => (
            <Reveal as="li" key={item.title}>
              <time>{item.time}</time>
              <strong>{item.title}</strong>
              <em>{item.detail}</em>
            </Reveal>
          ))}
        </ol>
      </Reveal>

      <Reveal as="section" variant="section" className="paper-block">
        <Reveal as="p" className="paper-kicker">
          Attire
        </Reveal>
        <Reveal as="h2">Aso-ebi</Reveal>
        <Reveal as="p" className="paper-note">
          We&apos;d love for you to celebrate in our colours.
        </Reveal>
        <Reveal className="paper-swatches" aria-hidden="true">
          <i className="swatch blue" />
          <i className="swatch gold" />
        </Reveal>
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

      <Reveal as="section" variant="section" className="paper-block">
        <Reveal as="p" className="paper-kicker">
          With gratitude
        </Reveal>
        <Reveal as="h2">A gift, if you wish</Reveal>
        <Reveal as="p" className="paper-note">
          {wedding.gift.note}
        </Reveal>
        <DetailCard
          account={wedding.gift.account}
          rows={[
            ["Bank", wedding.gift.bank],
            ["Account holder", wedding.gift.holder],
          ]}
        />
      </Reveal>

      <Reveal as="section" variant="section" className="paper-block">
        <Reveal as="p" className="paper-kicker">
          Where to stay
        </Reveal>
        <Reveal as="h2">Accommodation</Reveal>
        <Reveal as="p" className="paper-note">
          We&apos;ve compiled some options for you to stay nearby
        </Reveal>
        <div className="paper-stays">
          {wedding.hotels.map((hotel) => (
            <Reveal as="a" key={hotel.name} href={hotel.url} target="_blank" rel="noreferrer">
              <strong>{hotel.name}</strong>
              <em>{hotel.detail}</em>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className="paper-block">
        <Reveal as="p" className="paper-kicker">
          Have questions?
        </Reveal>
        <Reveal as="h2">Before you come</Reveal>
        <div className="paper-faq">
          {wedding.faqs.map((item, index) => {
            const open = openFaq === index;
            return (
              <Reveal key={item.q}>
                <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : index)}>
                  {item.q}
                </button>
                {open && <p>{item.a}</p>}
              </Reveal>
            );
          })}
        </div>
      </Reveal>

      <Reveal as="section" variant="section" className="paper-block paper-rsvp">
        <Reveal as="p" className="paper-kicker">
          Kindly respond
        </Reveal>
        <Reveal as="h2">Will you be there?</Reveal>
        <Reveal as="p" className="paper-note">
          Please let us know if you can make it
        </Reveal>
        {sent ? (
          <Reveal as="p" className="paper-thanks">
            Thank you. Your reply has been noted for this preview.
          </Reveal>
        ) : (
          <form onSubmit={submitRsvp}>
            <label>
              <span>Full name</span>
              <input name="name" required placeholder="Your name" autoComplete="name" />
            </label>
            <label>
              <span>Phone number</span>
              <input name="phone" required placeholder="Your phone number" autoComplete="tel" />
            </label>
            <label>
              <span>Will you be attending?</span>
              <select name="attending" required defaultValue="">
                <option value="" disabled>
                  Yes, with pleasure / Sorry, can&apos;t make it
                </option>
                <option value="yes">Yes, with pleasure</option>
                <option value="no">Sorry, can&apos;t make it</option>
              </select>
            </label>
            <label>
              <span>Additional guests</span>
              <input
                name="guests"
                type="number"
                min={0}
                max={8}
                value={guests}
                onChange={(event) => setGuests(Math.min(8, Math.max(0, Number(event.target.value) || 0)))}
              />
            </label>
            <button type="submit">Send my reply</button>
          </form>
        )}
        <p className="paper-sample">Sample. Your questions come from the RSVP form you set up.</p>
      </Reveal>

      <footer className="paper-end">
        <p>{wedding.couple}</p>
        <Rule />
        <span>{wedding.shortDate}</span>
        <small>
          Made with love by <a href="https://invytelle.com">Invytelle</a>
        </small>
      </footer>
      <a className="template-cta" href="https://invytelle.com/dashboard">
        Use this template →
      </a>
    </div>
  );
}

