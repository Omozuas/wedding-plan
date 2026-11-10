"use client";

import { useEffect, useRef, useState } from "react";
import { Ivory } from "@/templates/birthday/ivory";
import { graceTabiowoDay } from "@/clients/grace-tabiowo-day";

export function GraceTabiowoInvite() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(graceTabiowoDay.musicSrc);
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    const onReady = () => setReady(true);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("canplay", onReady);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.load();
    setReady(true);

    return () => {
      audio.pause();
      audio.removeEventListener("canplay", onReady);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audioRef.current = null;
    };
  }, []);

  function startMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().then(() => setPlaying(true)).catch(() => undefined);
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  return (
    <div style={{ ["--b-bg" as string]: graceTabiowoDay.colors.bg, ["--b-ink" as string]: graceTabiowoDay.colors.ink, ["--b-accent" as string]: graceTabiowoDay.colors.accent, ["--b-on-accent" as string]: graceTabiowoDay.colors.onAccent }}>
      <Ivory day={graceTabiowoDay} onBegin={startMusic} />
      <button
        type="button"
        onClick={toggleMusic}
        disabled={!ready}
        aria-pressed={playing}
        aria-label={playing ? "Pause song" : "Play song"}
        className="fixed right-4 bottom-5 z-[60] flex min-h-12 max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--b-accent)_50%,transparent)] bg-[var(--b-bg)]/90 px-4 py-2 text-[0.72rem] tracking-[0.18em] text-[var(--b-ink)] uppercase shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md disabled:opacity-50"
      >
        <span className="grid size-7 place-items-center rounded-full bg-[var(--b-accent)] text-[var(--b-on-accent)]">
          {playing ? (
            <span className="flex gap-0.5" aria-hidden>
              <span className="h-3 w-0.5 bg-current" />
              <span className="h-3 w-0.5 bg-current" />
            </span>
          ) : (
            <span className="ml-0.5 border-y-[5px] border-l-[8px] border-y-transparent border-l-current" aria-hidden />
          )}
        </span>
        <span>
          {playing ? "Pause" : "Play"} · {graceTabiowoDay.songLabel}
        </span>
      </button>
    </div>
  );
}
