import type { Metadata } from "next";
import { GraceTabiowoInvite } from "./invite";

export const metadata: Metadata = {
  title: "Mrs Grace Ayo Tabiowo at 80",
  description: "Saturday 5 December 2026 · A life preserved by God’s Grace",
};

export default function GraceTabiowoPage() {
  return <GraceTabiowoInvite />;
}
