"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { themeVars } from "@/content";
import { secondlineDay as day } from "./secondline-day";

const RIBBONS = [
  { color: "#7b2dff", delay: "0s", top: "12%", height: 18 },
  { color: "#ffd24a", delay: "0.35s", top: "28%", height: 14 },
  { color: "#1f9d55", delay: "0.7s", top: "44%", height: 20 },
  { color: "#ff5a8a", delay: "1.05s", top: "60%", height: 16 },
  { color: "#7b2dff", delay: "1.4s", top: "76%", height: 12 },
];

const STEPS = [
  { src: day.images.bouquet.src, focus: "center", delay: "0.4s", tilt: "-6deg" },
  { src: day.images.walk.src, focus: "center 40%", delay: "2.8s", tilt: "5deg" },
  { src: day.images.kiss.src, focus: "center 36%", delay: "5.2s", tilt: "-4deg" },
  { src: day.images.rings.src, focus: "center", delay: "7.6s", tilt: "3deg" },
];

const ROOMS = [
  { src: day.images.bouquet.src, focus: "center", kicker: "The flowers", line: day.dock[1], note: day.letter[0] },
  { src: day.images.couple.src, focus: "center 32%", kicker: "The two of them", line: `${day.first} and ${day.second}`, note: day.letter[1] },
  { src: day.images.walk.src, focus: "center 40%", kicker: "The water", line: day.dock[0], note: day.letter[2] },
  { src: day.images.rings.src, focus: "center", kicker: "The rings", line: day.dock[2], note: "Held up once, where the late light can find them." },
  { src: day.images.dress.src, focus: "center", kicker: "Supper", line: day.hours[2].detail, note: day.letter[3] },
  { src: day.images.kiss.src, focus: "center 40%", kicker: "After", line: day.dock[3], note: day.dress },
];

export function Secondline() {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-x-clip bg-[#12081a] text-[#f6efe8]" style={themeVars(day.colors)}>
      <style>{`
        .sl-sky { opacity: 1; transition: opacity 1.1s ease; }
        .sl-sky.is-leaving { opacity: 0; }
        .sl-ribbon { position: absolute; left: -20%; width: 140%; border-radius: 999px; transform: translateX(-100%) rotate(-4deg); animation: sl-ribbon 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; box-shadow: 0 8px 24px rgba(0,0,0,0.25); }
        .sl-card { position: absolute; inset: 12% 18%; opacity: 0; animation: sl-march 2.4s cubic-bezier(0.45, 0, 0.2, 1) both; border: 8px solid #f6efe8; box-shadow: 0 24px 50px rgba(0,0,0,0.4); }
        .sl-bounce { animation: sl-bounce 0.9s ease-in-out infinite alternate; }
        .sl-umbrella { position: absolute; width: 84px; height: 48px; border-radius: 84px 84px 8px 8px; opacity: 0; animation: sl-umbrella 4s ease both; }
        .sl-name { opacity: 0; animation: sl-name 0.95s cubic-bezier(0.16, 0.84, 0.3, 1) both; }
        .sl-rise { opacity: 0; transform: translateY(28px) rotate(-1deg); }
        .sl-rise.is-in { animation: sl-name 0.9s cubic-bezier(0.16, 0.84, 0.3, 1) forwards; }
        .sl-band { animation: sl-band 12s linear infinite; }
        .sl-step { animation: sl-step 1.2s ease-in-out infinite alternate; }
        .sl-glow { animation: sl-glow 5s ease-in-out infinite alternate; }
        .sl-photo { clip-path: inset(0 0 0 0 round 1.5rem); transition: clip-path 0.7s ease, transform 0.7s ease; }
        .sl-photo.is-in { clip-path: inset(0 0 0 0 round 1.5rem); transform: none; }
        @keyframes sl-ribbon { to { transform: translateX(0) rotate(-4deg); } }
        @keyframes sl-march { 0% { opacity: 0; transform: translateX(-18vw) rotate(var(--tilt)) scale(0.92); } 22% { opacity: 1; transform: translateX(0) rotate(var(--tilt)) scale(1); } 72% { opacity: 1; transform: translateX(0) rotate(var(--tilt)) scale(1); } 100% { opacity: 0; transform: translateX(18vw) rotate(calc(var(--tilt) * -1)) scale(0.94); } }
        @keyframes sl-bounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }
        @keyframes sl-umbrella { 0% { opacity: 0; transform: translateY(40px) scale(0.7); } 25% { opacity: 1; transform: translateY(0) scale(1); } 75% { opacity: 1; } 100% { opacity: 0; transform: translateY(-30px) scale(1.05); } }
        @keyframes sl-name { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @keyframes sl-band { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes sl-step { from { transform: translateY(0) rotate(-2deg); } to { transform: translateY(-8px) rotate(2deg); } }
        @keyframes sl-glow { from { filter: drop-shadow(0 0 0 rgba(255, 210, 74, 0)); } to { filter: drop-shadow(0 0 18px rgba(255, 210, 74, 0.45)); } }
        @media (prefers-reduced-motion: reduce) {
          .sl-ribbon, .sl-card, .sl-umbrella { display: none; }
          .sl-name, .sl-rise, .sl-band, .sl-bounce, .sl-step, .sl-glow { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
      {!open && <Parade onDone={() => setOpen(true)} />}
      <Street live={open} />
    </div>
  );
}

function Parade({ onDone }: { onDone: () => void }) {
  const finish = useRef(onDone);
  const [leaving, setLeaving] = useState(false);
  finish.current = onDone;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => (reduce ? finish.current() : setLeaving(true)), reduce ? 400 : 20200);
    const done = window.setTimeout(() => finish.current(), reduce ? 400 : 21400);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <section className={`sl-sky fixed inset-0 z-50 overflow-hidden bg-[#1a0a24] text-[#f6efe8] ${leaving ? "is-leaving" : ""}`} aria-label="A second-line parade of ribbons and photos marches in">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(123,45,255,0.35),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,210,74,0.2),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(31,157,85,0.25),transparent_45%)]" />
      {RIBBONS.map((ribbon) => (
        <span
          key={ribbon.top}
          className="sl-ribbon z-[1]"
          style={{ top: ribbon.top, height: ribbon.height, background: ribbon.color, animationDelay: ribbon.delay }}
        />
      ))}
      <div className="absolute inset-0 z-[2]">
        {STEPS.map((step) => (
          <img
            key={step.src}
            src={step.src}
            alt=""
            className="sl-card object-cover"
            style={{ objectPosition: step.focus, animationDelay: step.delay, ["--tilt" as string]: step.tilt }}
          />
        ))}
        <img src={day.images.couple.src} alt="" className="sl-name absolute inset-[12%_18%] border-[8px] border-[#f6efe8] object-cover object-[center_30%] shadow-[0_24px_50px_rgba(0,0,0,0.4)]" style={{ animationDelay: "10.4s" }} />
      </div>
      <span className="sl-umbrella sl-bounce left-[12%] top-[18%] z-[3] bg-[linear-gradient(90deg,#7b2dff_0_33%,#ffd24a_33%_66%,#1f9d55_66%)]" style={{ animationDelay: "1.2s" }} />
      <span className="sl-umbrella sl-bounce right-[14%] top-[24%] z-[3] bg-[linear-gradient(90deg,#ff5a8a_0_33%,#7b2dff_33%_66%,#ffd24a_66%)]" style={{ animationDelay: "2.4s" }} />
      <span className="sl-umbrella sl-bounce left-[20%] bottom-[28%] z-[3] bg-[linear-gradient(90deg,#1f9d55_0_33%,#ffd24a_33%_66%,#7b2dff_66%)]" style={{ animationDelay: "3.6s" }} />
      <div className="absolute inset-x-0 bottom-[7vh] z-[4] px-6 text-center">
        <p className="sl-name m-0 text-[0.68rem] tracking-[0.28em] text-[#ffd24a] uppercase" style={{ animationDelay: "12s" }}>Step with us</p>
        <p className="sl-name sl-glow m-0 mt-2 font-[family-name:var(--font-display)] text-[clamp(2.6rem,9vw,5.8rem)] leading-none font-extrabold tracking-[-0.06em]" style={{ animationDelay: "13s" }}>{day.first}</p>
        <p className="sl-name m-0 font-[family-name:var(--font-display)] text-[clamp(2.6rem,9vw,5.8rem)] leading-none font-extrabold tracking-[-0.06em] text-[#7b2dff]" style={{ animationDelay: "14.2s" }}>{day.second}</p>
        <p className="sl-name m-0 mt-4 font-[family-name:var(--font-serif)] text-2xl italic" style={{ animationDelay: "15.8s" }}>{day.time} · {day.shortDate}</p>
        <p className="sl-name m-0 mt-1 text-sm tracking-[0.14em] text-[#1f9d55] uppercase" style={{ animationDelay: "17.2s" }}>{day.venue}</p>
      </div>
      <button type="button" onClick={() => { setLeaving(true); window.setTimeout(() => finish.current(), 240); }} className="absolute top-5 right-5 z-[5] cursor-pointer border border-[#ffd24a]/50 bg-black/45 px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase">Skip</button>
    </section>
  );
}

function Street({ live }: { live: boolean }) {
  return (
    <div inert={live ? undefined : true} aria-hidden={live ? undefined : true}>
      <section className="px-6 pt-16 pb-8">
        <p className="sl-step m-0 inline-block text-[0.68rem] tracking-[0.32em] text-[#ffd24a] uppercase">{day.place}</p>
        <h1 className="m-0 mt-4 max-w-[9ch] font-[family-name:var(--font-display)] text-[clamp(3.4rem,11vw,6.6rem)] leading-[0.84] font-extrabold tracking-[-0.06em]">
          {day.first}
          <span className="block text-[#7b2dff]">{day.second}</span>
        </h1>
        <p className="m-0 mt-4 font-[family-name:var(--font-serif)] text-2xl italic">{day.dateLabel}</p>
        <p className="m-0 text-[#1f9d55]">{day.time} · {day.venue}</p>
      </section>
      <div className="overflow-hidden bg-[#7b2dff] py-3">
        <p className="sl-band m-0 w-max font-[family-name:var(--font-display)] text-sm font-extrabold tracking-[0.18em] text-[#ffd24a] uppercase">{`Second line · Brass · Joy · Family · ${day.couple} · `.repeat(8)}</p>
      </div>
      <section className="mx-auto max-w-3xl px-6 py-12">
        <Rise live={live}>
          <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(1.7rem,3vw,2.4rem)] leading-snug italic">{day.arrival}</p>
          <p className="m-0 mt-4 text-lg text-[#f6efe8]/75">{day.address}</p>
        </Rise>
      </section>
      {ROOMS.map((room, index) => (
        <section key={room.kicker} className="relative min-h-[90vh]">
          <img src={room.src} alt="" className="absolute inset-0 size-full object-cover" style={{ objectPosition: room.focus }} />
          <div className={`absolute inset-0 ${index % 2 ? "bg-gradient-to-r from-[#12081a]/90 via-[#12081a]/40 to-transparent" : "bg-gradient-to-t from-[#12081a] via-[#12081a]/30 to-[#7b2dff]/25"}`} />
          <div className="relative flex min-h-[90vh] items-end px-6 py-14 md:px-14">
            <Rise live={live}>
              <p className="m-0 text-[0.68rem] tracking-[0.28em] text-[#ffd24a] uppercase">{room.kicker}</p>
              <p className="m-0 mt-3 max-w-xl font-[family-name:var(--font-serif)] text-[clamp(2rem,4vw,3.2rem)] leading-snug">{room.line}</p>
              <p className="m-0 mt-4 max-w-lg text-lg leading-relaxed text-[#f6efe8]/80">{room.note}</p>
            </Rise>
          </div>
        </section>
      ))}
      <section className="px-6 py-16 md:px-14">
        <p className="m-0 text-xs tracking-[0.28em] text-[#ffd24a] uppercase">While the band plays</p>
        <ol className="m-0 mt-8 list-none p-0">
          {day.hours.map((hour) => (
            <li key={hour.time} className="grid gap-2 border-t border-[#7b2dff]/40 py-6 md:grid-cols-[8rem_1fr]">
              <Rise live={live}>
                <p className="m-0 font-[family-name:var(--font-display)] text-4xl font-extrabold text-[#ffd24a]">{hour.time}</p>
                <h2 className="m-0 font-[family-name:var(--font-display)] text-2xl font-extrabold">{hour.title}</h2>
                <p className="m-0 max-w-md text-[#f6efe8]/75">{hour.detail}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </section>
      <section className="grid gap-8 px-6 pb-16 md:grid-cols-2 md:px-14">
        <Rise live={live}>
          <p className="m-0 text-xs tracking-[0.24em] text-[#ffd24a] uppercase">Where to stay</p>
          <ul className="m-0 mt-4 list-none p-0">
            {day.stays.map((stay) => (
              <li key={stay.name} className="border-l-4 border-[#1f9d55] py-3 pl-4">
                <p className="m-0 font-[family-name:var(--font-display)] text-xl font-extrabold">{stay.name}</p>
                <p className="m-0 mt-1 text-[#f6efe8]/75">{stay.detail}</p>
              </li>
            ))}
          </ul>
        </Rise>
        <Rise live={live}>
          <p className="sl-glow m-0 font-[family-name:var(--font-script)] text-5xl text-[#ffd24a]">Fall in with us</p>
          <Reply />
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
    const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) setOn(true); }, { threshold: 0.16 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [live]);
  return <div ref={ref} className={`sl-rise min-w-0 ${on ? "is-in" : ""}`}>{children}</div>;
}

function Reply() {
  const [sent, setSent] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(String(new FormData(event.currentTarget).get("name") || "").trim());
  }
  if (sent) return <p className="m-0 mt-8 font-[family-name:var(--font-serif)] text-3xl italic">The parade will find you, {sent}.</p>;
  return (
    <form className="mt-8 grid max-w-md gap-3" onSubmit={submit}>
      <label className="grid gap-1 text-sm">Your name<input name="name" required placeholder="Your name" className="min-h-12 border border-[#7b2dff]/50 bg-transparent px-3 text-base" /></label>
      <label className="grid gap-1 text-sm">Arriving
        <select name="when" defaultValue="Saturday" className="min-h-12 border border-[#7b2dff]/50 bg-[#1a0a24] px-3 text-base text-[#f6efe8]">
          <option>Friday</option><option>Saturday</option><option>Already dancing</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">A note<textarea name="note" rows={3} placeholder="A seat, a song, a diet" className="border border-[#7b2dff]/50 bg-transparent px-3 py-2 text-base" /></label>
      <button type="submit" className="min-h-12 cursor-pointer border-0 bg-[#ffd24a] px-5 text-base text-[#12081a]">I am with you</button>
    </form>
  );
}
