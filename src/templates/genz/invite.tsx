"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType, type FormEvent, type ReactNode } from "react";
import { saveTheDateIcs, wedding } from "@/data/wedding";

function useCountdown(target: string) {
  const [parts, setParts] = useState({ days: "00", hours: "00", minutes: "00" });

  useEffect(() => {
    function tick() {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      setParts({
        days: String(Math.floor(diff / 86_400_000)).padStart(2, "0"),
        hours: String(Math.floor((diff % 86_400_000) / 3_600_000)).padStart(2, "0"),
        minutes: String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, "0"),
      });
    }
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [target]);

  return parts;
}

const drops = [
  { time: "4:00 PM", title: "Vows", detail: "The serious part. Phones down." },
  { time: "6:00 PM", title: "Drinks", detail: "Champagne, canapés, and the group chat in real life." },
  { time: "8:00 PM", title: "Dinner", detail: "Four courses, speeches, then we eat again anyway." },
  { time: "11:00 PM", title: "Afters", detail: "Shoes off. That is the assignment." },
];

const stays = [
  { name: "Eko, on site", note: "From ₦95,000. Quote the wedding and sleep where the party is.", url: wedding.hotels[0].url },
  { name: "Nordic", note: "From ₦65,000. Five minutes away, harbour view included.", url: wedding.hotels[1].url },
  { name: "Lagos Continental", note: "From ₦60,000. Ten minutes out, rooftop pool if you need a reset.", url: wedding.hotels[2].url },
];

const frames = [
  { src: "/photos/venue-1.jpg", alt: "The reception room", sticker: "the room" },
  { src: "/photos/kiss.jpg", alt: "A close moment", sticker: "quiet one" },
  { src: "/photos/florals.jpg", alt: "Flowers for the tables", sticker: "tables" },
  { src: "/photos/walk.jpg", alt: "Walking in together", sticker: "walk in" },
  { src: "/photos/story-2.jpg", alt: "Adaeze and Emeka", sticker: "us" },
];

const shots = [
  "/photos/story-2.jpg",
  "/photos/story-4.jpg",
  "/photos/story-6.jpg",
  "/photos/venue-1.jpg",
  "/photos/florals.jpg",
  "/photos/rings.jpg",
  "/photos/walk.jpg",
  "/photos/kiss.jpg",
  "/photos/couple.jpg",
  "/photos/bouquet.jpg",
];

const questions = [
  { q: "Can I sleep at the venue?", a: "Yes. Eko rooms start at ₦95,000. Say Adaeze & Emeka when you book." },
  { q: "What time do I need to be seated?", a: "Vows are at 4:00 PM. Come early. Walking in during the vows is not the look." },
  { q: "What am I wearing?", a: "Royal blue and gold aso-oke. The set is ₦55,000." },
  { q: "Plus one?", a: "Yes. Put the extra heads on the form so we don't run out of chairs." },
  { q: "Where do I park?", a: "Eko Hotels, Victoria Island. Entrance is on Adetokunbo Ademola Street." },
];

const railTilts = ["rotate-[-7deg]", "rotate-[6deg]", "rotate-[-3deg]", "rotate-[8deg]", "rotate-[-5deg]"];
const bobDelays = ["", "motion-safe:[animation-delay:-0.7s]", "motion-safe:[animation-delay:-1.4s]", "motion-safe:[animation-delay:-2.1s]", "motion-safe:[animation-delay:-2.8s]"];

const band = "relative mx-auto w-[min(1080px,calc(100%-2.4rem))] bg-transparent !px-0 !py-[2.4rem] !text-left text-inherit";
const kicker = "m-0 mb-[0.8rem] text-[0.72rem] font-medium tracking-[0.2em] text-[#8eb0ff] uppercase";
const cardKicker = "m-0 mt-[0.7rem] text-[0.72rem] font-medium tracking-[0.2em] text-[rgba(246,243,236,0.75)] uppercase";
const displayTitle = "!m-0 !font-[family-name:var(--font-display)] !text-[clamp(2.8rem,15vw,7.4rem)] !leading-[0.86] !font-extrabold tracking-[-0.06em] text-[#f6f3ec]";
const sectionTitle = "!m-0 !font-[family-name:var(--font-display)] !text-[clamp(2.2rem,5vw,3.6rem)] !leading-[0.86] !font-extrabold tracking-[-0.06em] text-[#f6f3ec]";
const pill = "mt-[1.3rem] cursor-pointer rounded-full border-0 bg-[#f6f3ec] px-[1.3rem] py-[0.85rem] !font-bold tracking-[0.04em] text-[#07080d]";
const stackPhoto = "absolute rounded-[1.3rem] object-cover shadow-[0_18px_40px_rgba(0,0,0,0.35)]";

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
  const start = window.innerHeight * 0.94;
  const end = window.innerHeight * 0.62;
  const rect = element.getBoundingClientRect();
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

export function GenZInvite({ onClose }: { onClose: () => void }) {
  const countdown = useCountdown(wedding.ceremonyAt);
  const [open, setOpen] = useState<number | null>(0);
  const [guests, setGuests] = useState(0);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState("");

  async function copy(value: string) {
    setCopied(value);
    window.setTimeout(() => setCopied(""), 1400);
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const field = document.createElement("textarea");
      field.value = value;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-dvh bg-[#07080d] font-[family-name:var(--font-ui),sans-serif] text-[#f6f3ec]">
      <button className="fixed top-[18px] left-[18px] z-30 cursor-pointer border-0 bg-transparent !text-[0.72rem] tracking-[0.18em] text-[#f6f3ec] uppercase" type="button" onClick={onClose}>
        Close
      </button>
      <div className="mt-[5.6rem] overflow-hidden border-b border-[rgba(255,255,255,0.12)] py-[0.7rem]" aria-hidden="true">
        <p className="m-0 w-max text-[0.72rem] tracking-[0.28em] text-[#e4c36a] uppercase motion-safe:animate-[genz-slide_22s_linear_infinite] motion-reduce:animate-none">
          {Array.from({ length: 8 }, () => "17.10.26 · VICTORIA ISLAND · PULL UP · ").join("")}
        </p>
      </div>

      <header className="mx-auto grid w-[min(1080px,calc(100%-2.4rem))] grid-cols-[1.1fr_0.9fr] items-end gap-8 pt-[2.2rem] pb-4 max-[800px]:grid-cols-1">
        <div>
          <Reveal as="p" className={kicker}>
            Lagos. Locked in.
          </Reveal>
          <Reveal as="h1" className={displayTitle}>
            Adaeze
            <span className="my-[0.08em] block text-[0.42em] tracking-normal text-[#e4c36a]">&amp;</span>
            Emeka
          </Reveal>
          <Reveal as="p" className="m-0 mt-[1.2rem] max-w-[34rem] text-[1.05rem] leading-[1.55] text-[rgba(246,243,236,0.78)]">
            We are getting married. Saturday 17 October 2026, 4PM, Eko Hotels on the Island. If you are reading this, you are on the list.
          </Reveal>
          <Reveal as="button" className={pill} type="button" onClick={saveTheDateIcs}>
            Save it
          </Reveal>
        </div>
        <Reveal className="relative h-[440px] w-[min(340px,100%)] justify-self-end max-[800px]:h-[380px] max-[800px]:justify-self-start">
          <img className={`${stackPhoto} top-[18px] left-0 aspect-[3/4] w-[72%] rotate-[-8deg] motion-safe:animate-[genz-float_5.5s_ease-in-out_infinite] motion-reduce:animate-none`} src="/photos/story-4.jpg" alt="" />
          <img className={`${stackPhoto} top-0 right-0 z-[1] aspect-[3/4] w-[78%] rotate-[4deg] motion-safe:animate-[genz-float_6.2s_ease-in-out_infinite_reverse] motion-reduce:animate-none`} src="/photos/story-2.jpg" alt="Adaeze and Emeka" />
          <img className={`${stackPhoto} right-[8%] bottom-0 z-[2] aspect-square w-[38%] border-4 border-[#07080d] rotate-[-6deg] motion-safe:animate-[genz-pop_0.7s_ease_0.35s_both] motion-reduce:animate-none`} src="/photos/rings.jpg" alt="" />
          <span className="absolute bottom-[18%] left-[6%] z-[3] rounded-full bg-[#e4c36a] px-[0.7rem] py-[0.4rem] text-[0.68rem] font-bold tracking-[0.08em] text-[#111] uppercase rotate-[-8deg] motion-safe:animate-[genz-pop_0.6s_ease_0.55s_both] motion-reduce:animate-none">
            main characters
          </span>
        </Reveal>
      </header>

      <Reveal className="mt-[0.4rem] overflow-hidden" aria-hidden="true">
        <div className="flex w-max gap-[0.55rem] motion-safe:animate-[genz-slide_36s_linear_infinite] motion-reduce:animate-none">
          {[...shots, ...shots].map((src, index) => (
            <img key={`${src}-${index}`} className="h-[230px] w-[180px] rounded-[1rem] object-cover" src={src} alt="" />
          ))}
        </div>
      </Reveal>

      <section className={`${band} grid grid-cols-3 gap-[0.7rem]`} id="countdown">
        {[
          [countdown.days, "days"],
          [countdown.hours, "hrs"],
          [countdown.minutes, "mins"],
        ].map(([value, label]) => (
          <Reveal key={label} className="rounded-[1.2rem] bg-[#141824] px-4 pt-[1.1rem] pb-[0.9rem]">
            <strong className="block font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,3.4rem)] leading-none font-extrabold tracking-[-0.05em]">{value}</strong>
            <span className="text-[0.72rem] tracking-[0.16em] text-[#8eb0ff] uppercase">{label}</span>
          </Reveal>
        ))}
      </section>

      <section className={`${band} grid grid-cols-[1.2fr_0.8fr] items-center gap-[1.4rem] max-[800px]:grid-cols-1`}>
        <Reveal>
          <p className={kicker}>Not a speech</p>
          <h2 className={sectionTitle}>Lagos put us in the same room. We are not leaving.</h2>
        </Reveal>
        <Reveal as="img" className="block aspect-square w-full rounded-[1.4rem] object-cover" src="/photos/story-6.jpg" alt="Adaeze and Emeka together" />
      </section>

      <Reveal as="section" className="relative my-0 ml-[calc(50%-50vw)] mr-auto w-screen max-w-screen overflow-hidden bg-transparent !px-0 !py-[1.2rem] !text-left text-inherit" aria-label="Photos">
        <div className="overflow-hidden">
          <div className="flex w-max gap-[0.9rem] pt-[0.8rem] pb-[1.2rem] motion-safe:animate-[genz-rail_28s_linear_infinite] motion-reduce:animate-none">
            {[...frames, ...frames].map((frame, index) => (
              <figure key={`${frame.sticker}-${index}`} className={`relative m-0 w-[min(300px,78vw)] ${railTilts[index % 5]}`}>
                <img
                  className={`block h-[min(390px,92vw)] w-full rounded-[1.5rem] object-cover motion-safe:animate-[genz-bob_3.8s_ease-in-out_infinite] motion-reduce:animate-none ${bobDelays[index % 5]}`}
                  src={frame.src}
                  alt={index < frames.length ? frame.alt : ""}
                />
                <figcaption
                  className={`absolute left-[0.65rem] m-0 rounded-full px-[0.7rem] py-[0.32rem] font-[family-name:var(--font-display)] text-[0.82rem] font-extrabold tracking-[-0.04em] text-[#111] lowercase ${
                    index % 2 === 0 ? "top-[0.85rem] rotate-[7deg] bg-[#e4c36a]" : "bottom-[0.85rem] rotate-[-8deg] bg-[#f6f3ec]"
                  }`}
                >
                  {frame.sticker}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Reveal>

      <section className={band}>
        <Reveal as="p" className={kicker}>
          The rundown
        </Reveal>
        <ol className="m-0 grid list-none grid-cols-2 gap-[0.7rem] p-0 max-[800px]:grid-cols-1">
          {drops.map((item) => (
            <Reveal as="li" key={item.title} className="rounded-[1.2rem] bg-[#141824] px-4 pt-[1.1rem] pb-4">
              <time className="text-[0.75rem] tracking-[0.14em] text-[#e4c36a] uppercase">{item.time}</time>
              <strong className="mt-[0.35rem] block font-[family-name:var(--font-display)] text-[1.7rem] font-extrabold tracking-[-0.04em]">{item.title}</strong>
              <em className="mt-[0.3rem] block leading-[1.45] text-[rgba(246,243,236,0.7)] not-italic">{item.detail}</em>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className={`${band} flex items-end justify-between gap-4 rounded-[1.6rem] bg-[#10162a] max-[800px]:grid max-[800px]:grid-cols-1`}>
        <div>
          <Reveal as="p" className={cardKicker}>
            The fit
          </Reveal>
          <Reveal as="h2" className={sectionTitle}>Royal blue. Gold. That is the whole brief.</Reveal>
          <Reveal as="p" className="m-0 mt-[0.7rem] text-[rgba(246,243,236,0.75)]">Aso-ebi is ₦55,000 a set. Send it to Adaeze Nwosu, UBA.</Reveal>
          <Reveal as="button" className={pill} type="button" onClick={() => copy(wedding.asoEbi.account)}>
            {copied === wedding.asoEbi.account ? "Copied" : wedding.asoEbi.account}
          </Reveal>
        </div>
        <Reveal className="w-[min(220px,38%)] max-[800px]:w-[min(220px,70%)]">
          <img className="aspect-[4/5] w-full rounded-[1.2rem] object-cover rotate-[3deg]" src="/photos/bouquet.jpg" alt="Bouquet" />
        </Reveal>
      </section>

      <section className={`${band} flex items-end justify-between gap-4 rounded-[1.6rem] bg-[#17130c] max-[800px]:grid`}>
        <div>
          <Reveal as="p" className={cardKicker}>
            If you insist
          </Reveal>
          <Reveal as="h2" className={sectionTitle}>Showing up is the gift. Cash is also fine.</Reveal>
          <Reveal as="p" className="m-0 mt-[0.7rem] text-[rgba(246,243,236,0.75)]">Access Bank · Adaeze &amp; Emeka Fund</Reveal>
          <Reveal as="button" className={pill} type="button" onClick={() => copy(wedding.gift.account)}>
            {copied === wedding.gift.account ? "Copied" : wedding.gift.account}
          </Reveal>
        </div>
      </section>

      <section className={band}>
        <Reveal as="p" className={kicker}>
          Crash here
        </Reveal>
        <div className="grid gap-[0.7rem]">
          {stays.map((stay) => (
            <Reveal key={stay.name} className="block rounded-[1.1rem] bg-[#141824] px-[1.05rem] py-4 text-inherit">
              <strong className="block font-[family-name:var(--font-display)] text-[1.35rem] tracking-[-0.04em]">{stay.name}</strong>
              <span className="leading-[1.45] text-[rgba(246,243,236,0.72)]">{stay.note}</span>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-[0.7rem] block rounded-[1.1rem] border border-[rgba(255,255,255,0.16)] bg-transparent px-[1.05rem] py-4 leading-[1.45] text-[rgba(246,243,236,0.72)]">
          Plot 1415 Adetokunbo Ademola, Victoria Island
        </Reveal>
      </section>

      <section className={band}>
        <Reveal as="p" className={kicker}>
          Real questions
        </Reveal>
        {questions.map((item, index) => {
          const shown = open === index;
          return (
            <Reveal key={item.q} className="border-t border-[rgba(255,255,255,0.12)]">
              <button className="w-full cursor-pointer border-0 bg-transparent py-4 text-left !font-[family-name:var(--font-display)] !text-[1.25rem] !font-bold tracking-[-0.03em] text-[#f6f3ec]" type="button" aria-expanded={shown} onClick={() => setOpen(shown ? null : index)}>
                {item.q}
              </button>
              {shown && <p className="mb-4 leading-[1.5] text-[rgba(246,243,236,0.72)]">{item.a}</p>}
            </Reveal>
          );
        })}
      </section>

      <section className={band}>
        <Reveal as="p" className={kicker}>
          Be honest
        </Reveal>
        <Reveal as="h2" className={sectionTitle}>You in?</Reveal>
        {sent ? (
          <Reveal as="p" className="mb-4 leading-[1.5] text-[rgba(246,243,236,0.72)]">
            Noted. We will keep your seat warm.
          </Reveal>
        ) : (
          <Reveal as="form" className="mt-4 grid max-w-[28rem] gap-[0.7rem]" onSubmit={submit}>
            <input className="w-full rounded-[0.9rem] border-0 bg-[#141824] px-4 py-[0.9rem] !font-[family-name:var(--font-ui)] !text-base text-[#f6f3ec]" name="name" required placeholder="Your name" autoComplete="name" />
            <input className="w-full rounded-[0.9rem] border-0 bg-[#141824] px-4 py-[0.9rem] !font-[family-name:var(--font-ui)] !text-base text-[#f6f3ec]" name="phone" required placeholder="Your number" autoComplete="tel" />
            <select className="w-full rounded-[0.9rem] border-0 bg-[#141824] px-4 py-[0.9rem] !font-[family-name:var(--font-ui)] !text-base text-[#f6f3ec]" name="attending" required defaultValue="">
              <option value="" disabled>
                In or out?
              </option>
              <option value="yes">I will be there</option>
              <option value="no">I can&apos;t make it</option>
            </select>
            <label className="!m-0 grid !gap-[0.35rem] !text-[0.85rem] !tracking-normal !text-[rgba(246,243,236,0.7)] !normal-case">
              Extra people
              <input
                className="w-full rounded-[0.9rem] border-0 bg-[#141824] px-4 py-[0.9rem] !font-[family-name:var(--font-ui)] !text-base text-[#f6f3ec]"
                name="guests"
                type="number"
                min={0}
                max={8}
                value={guests}
                onChange={(event) => setGuests(Math.min(8, Math.max(0, Number(event.target.value) || 0)))}
              />
            </label>
            <button className={pill} type="submit">Count me in</button>
          </Reveal>
        )}
      </section>

      <footer className="mx-auto w-[min(1080px,calc(100%-2.4rem))] !bg-transparent !px-0 !pt-8 !pb-28 !text-left !text-[#f6f3ec]">
        <Reveal as="p" className="m-0 font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,3.2rem)] font-extrabold tracking-[-0.05em] text-[#f6f3ec]">Adaeze × Emeka</Reveal>
        <Reveal as="span" className="tracking-[0.18em] text-[#e4c36a]">17.10.26</Reveal>
      </footer>
    </div>
  );
}
