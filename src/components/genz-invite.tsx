"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
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

export function GenZInvite({ onClose }: { onClose: () => void }) {
  const countdown = useCountdown(wedding.ceremonyAt);
  const rootRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = root.querySelectorAll("[data-rise]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-in"));
      return;
    }
    const watcher = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
        });
      },
      { threshold: 0.16 },
    );
    nodes.forEach((node) => watcher.observe(node));
    return () => watcher.disconnect();
  }, []);

  return (
    <div className="genz" ref={rootRef}>
      <button className="genz-close" type="button" onClick={onClose}>
        Close
      </button>
      <div className="genz-marquee" aria-hidden="true">
        <p>
          {Array.from({ length: 8 }, () => "17.10.26 · VICTORIA ISLAND · PULL UP · ").join("")}
        </p>
      </div>

      <header className="genz-hero">
        <div data-rise>
          <p className="genz-chip">Lagos. Locked in.</p>
          <h1>
            Adaeze
            <span>&amp;</span>
            Emeka
          </h1>
          <p className="genz-lead">
            We are getting married. Saturday 17 October 2026, 4PM, Eko Hotels on the Island. If you are reading this, you are on the list.
          </p>
          <button type="button" onClick={saveTheDateIcs}>
            Save it
          </button>
        </div>
        <div className="genz-stack" data-rise>
          <img src="/photos/story-4.jpg" alt="" />
          <img src="/photos/story-2.jpg" alt="Adaeze and Emeka" />
          <img src="/photos/rings.jpg" alt="" />
          <span>main characters</span>
        </div>
      </header>

      <div className="genz-film" aria-hidden="true">
        <div>
          {[...shots, ...shots].map((src, index) => (
            <img key={`${src}-${index}`} src={src} alt="" />
          ))}
        </div>
      </div>

      <section className="genz-clock" id="countdown" data-rise>
        {[
          [countdown.days, "days"],
          [countdown.hours, "hrs"],
          [countdown.minutes, "mins"],
        ].map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="genz-note" data-rise>
        <div>
          <p>Not a speech</p>
          <h2>Lagos put us in the same room. We are not leaving.</h2>
        </div>
        <img src="/photos/story-6.jpg" alt="Adaeze and Emeka together" />
      </section>

      <section className="genz-bento" data-rise aria-label="Photos">
        <div className="genz-rail">
          <div>
            {[...frames, ...frames].map((frame, index) => (
              <figure key={`${frame.sticker}-${index}`}>
                <img src={frame.src} alt={index < frames.length ? frame.alt : ""} />
                <figcaption>{frame.sticker}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section>
        <p className="genz-label">The rundown</p>
        <ol className="genz-drops" data-rise>
          {drops.map((item) => (
            <li key={item.title}>
              <time>{item.time}</time>
              <strong>{item.title}</strong>
              <em>{item.detail}</em>
            </li>
          ))}
        </ol>
      </section>

      <section className="genz-fit" data-rise>
        <div>
          <p className="genz-label">The fit</p>
          <h2>Royal blue. Gold. That is the whole brief.</h2>
          <p>Aso-ebi is ₦55,000 a set. Send it to Adaeze Nwosu, UBA.</p>
          <button type="button" onClick={() => copy(wedding.asoEbi.account)}>
            {copied === wedding.asoEbi.account ? "Copied" : wedding.asoEbi.account}
          </button>
        </div>
        <img src="/photos/bouquet.jpg" alt="Bouquet" />
      </section>

      <section className="genz-gift">
        <p className="genz-label">If you insist</p>
        <h2>Showing up is the gift. Cash is also fine.</h2>
        <p>Access Bank · Adaeze &amp; Emeka Fund</p>
        <button type="button" onClick={() => copy(wedding.gift.account)}>
          {copied === wedding.gift.account ? "Copied" : wedding.gift.account}
        </button>
      </section>

      <section>
        <p className="genz-label">Crash here</p>
        <div className="genz-stays">
          {stays.map((stay) => (
            <a key={stay.name} href={stay.url} target="_blank" rel="noreferrer">
              <strong>{stay.name}</strong>
              <span>{stay.note}</span>
            </a>
          ))}
        </div>
        <a className="genz-map" href={wedding.mapsUrl} target="_blank" rel="noreferrer">
          Plot 1415 Adetokunbo Ademola, VI — open map
        </a>
      </section>

      <section className="genz-ask">
        <p className="genz-label">Real questions</p>
        {questions.map((item, index) => {
          const shown = open === index;
          return (
            <div key={item.q}>
              <button type="button" aria-expanded={shown} onClick={() => setOpen(shown ? null : index)}>
                {item.q}
              </button>
              {shown && <p>{item.a}</p>}
            </div>
          );
        })}
      </section>

      <section className="genz-rsvp">
        <p className="genz-label">Be honest</p>
        <h2>You in?</h2>
        {sent ? (
          <p className="genz-thanks">Noted. We will keep your seat warm.</p>
        ) : (
          <form onSubmit={submit}>
            <input name="name" required placeholder="Your name" autoComplete="name" />
            <input name="phone" required placeholder="Your number" autoComplete="tel" />
            <select name="attending" required defaultValue="">
              <option value="" disabled>
                In or out?
              </option>
              <option value="yes">I will be there</option>
              <option value="no">I can&apos;t make it</option>
            </select>
            <label>
              Extra people
              <input
                name="guests"
                type="number"
                min={0}
                max={8}
                value={guests}
                onChange={(event) => setGuests(Math.min(8, Math.max(0, Number(event.target.value) || 0)))}
              />
            </label>
            <button type="submit">Count me in</button>
          </form>
        )}
      </section>

      <footer className="genz-end">
        <p>Adaeze × Emeka</p>
        <span>17.10.26</span>
      </footer>
      <a className="template-cta" href="https://invytelle.com/dashboard">
        Use this template →
      </a>
    </div>
  );
}
