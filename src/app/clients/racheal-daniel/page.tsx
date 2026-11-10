import type { Metadata } from "next";
import { themeVars } from "@/content";
import { Sage } from "@/templates/hubble/afroamerican/sage";
import { SpotifyPlayButton } from "@/components/spotify-play-button";
import { rachealDanielDay } from "@/clients/racheal-daniel-day";

export const metadata: Metadata = {
  title: "Daniel & Racheal",
  description: "Thursday 1 October 2026 · Twelve noon · Suzy Hall, Ikeja",
};

export default function RachealDanielPage() {
  const songLabel =
    typeof rachealDanielDay.extras.songLabel === "string"
      ? rachealDanielDay.extras.songLabel
      : "iseoluwa · Fireboy";
  const musicSrc =
    typeof rachealDanielDay.extras.musicSrc === "string"
      ? rachealDanielDay.extras.musicSrc
      : "/music/iseoluwa-preview.mp3";

  return (
    <div style={themeVars(rachealDanielDay.colors)}>
      <Sage day={rachealDanielDay} />
      <SpotifyPlayButton src={musicSrc} label={songLabel} autoPlay />
    </div>
  );
}
