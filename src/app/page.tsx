"use client";

import { useEffect, useRef, useState } from "react";
import { Envelope } from "@/components/envelope";
import { Invitation } from "@/components/invitation";
import { SoundButton } from "@/components/sound-button";

export default function Home() {
  const [phase, setPhase] = useState<"sealed" | "opening" | "open">("sealed");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function audio() {
    if (!audioRef.current) {
      const track = new Audio("/music/wedding.mp3");
      track.loop = true;
      track.preload = "auto";
      audioRef.current = track;
    }
    return audioRef.current;
  }

  useEffect(() => {
    audio().load();
  }, []);

  useEffect(() => {
    if (phase !== "opening") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(() => {
      setPhase("open");
      window.scrollTo(0, 0);
    }, reduce ? 180 : 1450);
    return () => window.clearTimeout(id);
  }, [phase]);

  function openInvite() {
    const track = audio();
    track
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
    setPhase("opening");
  }

  function toggleSound() {
    const track = audio();
    if (!track.paused) {
      track.pause();
      setPlaying(false);
      return;
    }
    track
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }

  function closeInvite() {
    const track = audioRef.current;
    if (track) {
      track.pause();
      track.currentTime = 0;
    }
    setPlaying(false);
    setPhase("sealed");
    window.scrollTo(0, 0);
  }

  return (
    <>
      {phase !== "sealed" && <Invitation onClose={closeInvite} />}
      {phase !== "open" && <Envelope opening={phase === "opening"} onOpen={openInvite} />}
      {phase !== "sealed" && <SoundButton playing={playing} onToggle={toggleSound} />}
    </>
  );
}
