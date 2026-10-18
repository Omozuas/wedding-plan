"use client";

import { useEffect, useRef, useState } from "react";
import { Envelope } from "@/components/envelope";
import { SoundButton } from "@/components/sound-button";
import { ClassicInvite } from "@/templates/classic/invite";
import { ClassicScrollSequence } from "./sequence";

const introMs = 1450;

export function ClassicNigerianDemo() {
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
    }, reduce ? 180 : introMs);
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
    <div className="classic-cinema">
      {phase !== "sealed" && <ClassicInvite onClose={closeInvite} afterHero={<ClassicScrollSequence />} />}
      {phase !== "open" && <Envelope opening={phase === "opening"} onOpen={openInvite} />}
      <div className={`classic-cinema-frame ${phase === "open" ? "is-seated" : ""}`} aria-hidden="true">
        <span className="classic-cinema-bar classic-cinema-bar-top" />
        <span className="classic-cinema-bar classic-cinema-bar-bottom" />
        <span className="classic-cinema-spot" />
        <span className="classic-cinema-vignette" />
        <span className="classic-cinema-leak" />
        <span className="classic-cinema-grain" />
        <span className="classic-cinema-mote classic-cinema-mote-a" />
        <span className="classic-cinema-mote classic-cinema-mote-b" />
        <span className="classic-cinema-mote classic-cinema-mote-c" />
      </div>
      {phase !== "sealed" && <SoundButton playing={playing} onToggle={toggleSound} />}
    </div>
  );
}
