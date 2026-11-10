"use client";

import { useEffect, useRef, useState } from "react";

/** Floating play / pause for site music (HTML audio — reliable across browsers). */
export function SpotifyPlayButton({
  src,
  label = "Song",
  autoPlay = false,
}: {
  src: string;
  label?: string;
  autoPlay?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onReady = () => setReady(true);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("canplay", onReady);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    if (audio.readyState >= 2) setReady(true);

    const tryPlay = () => {
      const p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(() => setPlaying(true)).catch(() => {
          /* browser blocked autoplay — wait for gesture */
        });
      }
    };

    if (autoPlay) {
      audio.load();
      tryPlay();
      const unlock = () => {
        tryPlay();
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
        window.removeEventListener("touchstart", unlock);
      };
      window.addEventListener("pointerdown", unlock);
      window.addEventListener("keydown", unlock);
      window.addEventListener("touchstart", unlock);

      return () => {
        audio.removeEventListener("canplay", onReady);
        audio.removeEventListener("play", onPlay);
        audio.removeEventListener("pause", onPause);
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
        window.removeEventListener("touchstart", unlock);
      };
    }

    return () => {
      audio.removeEventListener("canplay", onReady);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [autoPlay, src]);

  function toggle() {
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
    <>
      <audio ref={audioRef} src={src} loop preload="auto" playsInline />
      <button
        type="button"
        onClick={toggle}
        disabled={!ready}
        aria-pressed={playing}
        aria-label={playing ? "Pause song" : "Play song"}
        className="fixed right-4 bottom-4 z-[60] flex min-h-12 items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--w-accent)_50%,transparent)] bg-[var(--w-bg)]/90 px-4 py-2 text-[0.72rem] tracking-[0.18em] text-[var(--w-ink)] uppercase shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md disabled:opacity-50"
      >
        <span className="grid size-7 place-items-center rounded-full bg-[var(--w-accent)] text-[var(--w-on-accent)]">
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
          {playing ? "Pause" : "Play"} · {label}
        </span>
      </button>
    </>
  );
}
