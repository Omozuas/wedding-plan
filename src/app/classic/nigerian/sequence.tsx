"use client";

import { useEffect, useRef, useState } from "react";

const plates = [
  { text: "Adaeze and Emeka", src: "/photos/story-4.jpg", drift: 0, down: false },
  { text: "this evening", src: "/photos/story-2.jpg", drift: 0, down: false },
  { text: "From the shores of Lagos", src: "/photos/venue-1.jpg", drift: -1, down: true },
  { text: "to forever", src: "/photos/rings.jpg", drift: 1, down: true },
  { text: "hearts full of joy", src: "/photos/florals.jpg", drift: -1, down: true },
];

const closing = { text: "Your presence is our greatest gift", drift: 1, down: true };
const beats = plates.length + 1;

const filmLines = [
  { text: "You are welcome", from: [-48, 12, -8], hold: [-4, -16, -1], to: [34, -36, 7] },
  { text: "Victoria Island, Lagos", from: [46, 22, 8], hold: [6, 12, 1], to: [-40, 26, -8] },
  { text: "Saturday, the seventeenth", from: [0, 42, 5], hold: [0, -2, 0], to: [-28, -32, -6] },
  { text: "Evening gathers at Eko", from: [38, -34, 9], hold: [2, 8, 0], to: [-44, 20, -7] },
];

const videoEnd = 0.34;
const riseEnd = 0.46;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function scrubTime(local: number, duration: number) {
  const forward = 0.58;
  const replay = 0.74;
  if (local < forward) return (local / forward) * duration * 0.86;
  if (local < replay) {
    const t = (local - forward) / (replay - forward);
    return duration * 0.86 - t * duration * 0.24;
  }
  const t = (local - replay) / (1 - replay);
  return duration * 0.62 + t * duration * 0.38;
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function smoothstep(amount: number) {
  const t = clamp(amount);
  return t * t * (3 - 2 * t);
}

function filmLineMotion(index: number, progress: number) {
  const line = filmLines[index];
  const slot = riseEnd / filmLines.length;
  const lead = slot * 0.34;
  const start = Math.max(0, index * slot - (index === 0 ? 0 : lead));
  const end = Math.min(riseEnd, (index + 1) * slot + (index === filmLines.length - 1 ? 0 : lead));
  const local = (progress - start) / (end - start);
  const pose = (point: number[]) => `translate(-50%, -50%) translate3d(${point[0]}vw, ${point[1]}vh, 0) rotate(${point[2]}deg)`;
  if (local <= 0 || local >= 1) return { opacity: 0, transform: pose(local <= 0 ? line.from : line.to) };

  if (local < 0.34) {
    const t = smoothstep(local / 0.34);
    return {
      opacity: t,
      transform: pose([lerp(line.from[0], line.hold[0], t), lerp(line.from[1], line.hold[1], t), lerp(line.from[2], line.hold[2], t)]),
    };
  }
  if (local < 0.62) {
    const t = (local - 0.34) / 0.28;
    return {
      opacity: 1,
      transform: pose([
        line.hold[0] + Math.sin(t * Math.PI) * 2.4,
        line.hold[1] + Math.cos(t * Math.PI) * 1.8,
        line.hold[2] + Math.sin(t * Math.PI) * 1.4,
      ]),
    };
  }
  const t = smoothstep((local - 0.62) / 0.38);
  return {
    opacity: 1 - t,
    transform: pose([lerp(line.hold[0], line.to[0], t), lerp(line.hold[1], line.to[1], t), lerp(line.hold[2], line.to[2], t)]),
  };
}

function beatMotion(index: number, progress: number, drift: number, down: boolean) {
  const span = (1 - riseEnd) / beats;
  const start = riseEnd + index * span;
  const local = (progress - start) / span;
  if (local <= 0 || local >= 1) {
    return { opacity: 0, transform: `translate3d(${drift * 28}px, ${down ? 36 : 18}px, 0) scale(0.96)` };
  }
  const fade = local < 0.22 ? local / 0.22 : local > 0.72 ? (1 - local) / 0.28 : 1;
  const slide = (local - 0.5) * drift * 72;
  const drop = down ? (local - 0.2) * 64 : (1 - Math.min(local / 0.22, 1)) * 18;
  const scale = 0.96 + Math.min(local / 0.22, 1) * 0.04;
  return { opacity: fade, transform: `translate3d(${slide}px, ${drop}px, 0) scale(${scale})` };
}

export function ClassicScrollSequence() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const total = root.offsetHeight - window.innerHeight;
      const next = total <= 0 ? 0 : clamp(-root.getBoundingClientRect().top / total);
      setProgress((current) => (Math.abs(current - next) < 0.004 ? current : next));

      if (reduce || !Number.isFinite(video.duration) || video.duration === 0) return;
      if (next < videoEnd) {
        video.loop = false;
        if (!video.paused) video.pause();
        const time = scrubTime(next / videoEnd, video.duration);
        if (Math.abs(video.currentTime - time) > 0.04) video.currentTime = time;
        return;
      }
      if (next < 0.98) {
        video.loop = true;
        if (video.paused || video.ended) void video.play().catch(() => undefined);
        return;
      }
      video.loop = false;
      if (!video.paused) video.pause();
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    video.addEventListener("loadedmetadata", update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      video.removeEventListener("loadedmetadata", update);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const rise = clamp(progress / riseEnd);
  const videoOpacity = progress < riseEnd ? 1 : 1 - clamp((progress - riseEnd) / 0.08);

  return (
    <section ref={rootRef} className="relative h-[760vh] bg-black text-[#f6f1e6]" aria-label="A film of the day">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: videoOpacity,
            transform: `translate3d(0, ${-rise * 16}vh, 0) scale(${1.04 + rise * 0.04})`,
          }}
          src="/cinema/eko.mp4"
          poster="/photos/story-4.jpg"
          muted
          playsInline
          preload="auto"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/40"
          style={{ opacity: videoOpacity }}
        />
        <div className="pointer-events-none absolute inset-0 z-[2]">
          {filmLines.map((line, index) => (
            <p
              key={line.text}
              className="absolute top-1/2 left-1/2 m-0 max-w-[12ch] text-center font-[family-name:var(--font-serif)] text-[clamp(1.8rem,6vw,3rem)] leading-tight text-[#f6f1e6]"
              style={filmLineMotion(index, progress)}
            >
              {line.text}
            </p>
          ))}
        </div>
        <p
          className="pointer-events-none absolute bottom-16 left-1/2 z-[2] m-0 -translate-x-1/2 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.32em] text-[#e6d3a4] uppercase"
          style={{ opacity: progress < videoEnd ? 0.9 : 0 }}
        >
          Lagos, in motion
        </p>

        {plates.map((plate, index) => {
          const motion = beatMotion(index, progress, plate.drift, plate.down);
          return (
            <figure key={plate.text} className="absolute inset-0 m-0" style={{ opacity: motion.opacity, transform: motion.transform }}>
              <img src={plate.src} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/35" />
              <figcaption className="absolute inset-0 flex items-center justify-center px-8 text-center font-[family-name:var(--font-script)] text-[clamp(2.6rem,8vw,4.6rem)] leading-none text-[#f6f1e6]">
                {plate.text}
              </figcaption>
            </figure>
          );
        })}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-8">
          <p
            className="m-0 max-w-[16ch] text-center font-[family-name:var(--font-serif)] text-[clamp(1.6rem,4vw,2.4rem)] leading-snug text-[#f6f1e6]"
            style={beatMotion(plates.length, progress, closing.drift, closing.down)}
          >
            {closing.text}
          </p>
        </div>
      </div>
    </section>
  );
}
