"use client";

import { useState } from "react";

const frames = [
  { src: "/photos/story-4.jpg", delay: "0s" },
  { src: "/photos/walk.jpg", delay: "2.6s" },
  { src: "/photos/story-2.jpg", delay: "5.2s" },
];

export function GenZIntro({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      aria-label="Open the invitation"
      style={
        opening
          ? { transition: "opacity 1.1s ease 1.45s, scale 0.4s ease" }
          : { transition: "opacity 0.4s ease, scale 0.4s ease" }
      }
      className={`fixed inset-0 z-50 cursor-pointer overflow-hidden border-0 bg-[#07080d] p-0 text-left motion-reduce:transition-none ${pressed && !opening ? "scale-[0.985]" : ""} ${opening ? "opacity-0" : ""}`}
    >
      {frames.map((frame, index) => (
        <img
          key={frame.src}
          src={frame.src}
          alt=""
          style={{
            animation: `genz-story 7.8s linear ${frame.delay} infinite backwards, genz-drift 9s ease-in-out ${frame.delay} infinite`,
            animationPlayState: opening ? "paused" : "running",
            scale: opening ? 1.18 + index * 0.06 : undefined,
            transition: "scale 1.35s cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: `${index * 220}ms`,
          }}
          className="absolute inset-0 size-full object-cover object-[center_22%] opacity-0 motion-reduce:!animate-none first:motion-reduce:!opacity-100"
        />
      ))}
      <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,8,13,0.88)_0%,rgba(7,8,13,0.12)_42%,rgba(7,8,13,0.35)_100%)]" />

      <span className="absolute top-[4.6rem] right-5 left-5 z-10 flex gap-1.5">
        {frames.map((frame, index) => (
          <span
            key={frame.delay}
            style={opening ? { animation: `genz-bars-out 1.2s ease ${index * 0.16}s both` } : undefined}
            className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30"
          >
            <span
              style={{ animation: `genz-bar 7.8s linear ${frame.delay} infinite backwards` }}
              className="block h-full origin-left bg-white motion-reduce:!animate-none motion-reduce:!scale-x-100"
            />
          </span>
        ))}
      </span>

      <span
        className={`absolute top-[6.2rem] left-5 z-10 rounded-full bg-[#8eb0ff] px-3 py-1 font-[family-name:var(--font-display)] text-xs font-extrabold tracking-[-0.04em] text-[#07080d] motion-reduce:animate-none ${opening ? "motion-safe:animate-[genz-chip-out_1.4s_ease_0.4s_both]" : "motion-safe:animate-[genz-spring_0.6s_ease_backwards]"}`}
      >
        story
      </span>

      <span
        className={`absolute inset-x-4 bottom-16 z-10 rounded-[1.6rem] border border-white/15 bg-[#07080d]/55 px-5 py-5 text-white backdrop-blur-md motion-reduce:animate-none ${pressed && !opening ? "scale-[0.97]" : ""} ${opening ? "motion-safe:animate-[genz-exit_1.5s_ease_0.55s_both]" : "motion-safe:animate-[genz-spring_0.75s_ease_0.08s_backwards]"}`}
      >
        <span
          className={`block font-[family-name:var(--font-display)] text-[clamp(2.5rem,10vw,4rem)] leading-[0.84] font-extrabold tracking-[-0.06em] motion-reduce:animate-none ${opening ? "" : "motion-safe:animate-[genz-in_0.7s_ease_0.2s_backwards]"}`}
        >
          Adaeze
          <span className="block">
            <span className="text-[#e4c36a]">&amp; </span>
            Emeka
          </span>
        </span>
        <span
          className={`mt-3 flex items-end justify-between gap-3 motion-reduce:animate-none ${opening ? "" : "motion-safe:animate-[genz-in_0.7s_ease_0.34s_backwards]"}`}
        >
          <span className="font-[family-name:var(--font-ui)] text-sm leading-snug text-white/80">
            sat 17 oct · 4pm
            <span className="mt-1 block">eko hotels, victoria island</span>
          </span>
          <span
            style={pressed ? { animation: "genz-ripple 0.5s ease-out, genz-bob 3.2s ease-in-out infinite" } : undefined}
            className={`shrink-0 rotate-[-3deg] rounded-full bg-[#e4c36a] px-4 py-2 font-[family-name:var(--font-display)] text-sm font-extrabold tracking-[-0.04em] text-[#111] transition duration-200 motion-safe:animate-[genz-bob_3.2s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:transition-none ${pressed ? "scale-125" : ""}`}
          >
            tap in
          </span>
        </span>
      </span>
    </button>
  );
}
