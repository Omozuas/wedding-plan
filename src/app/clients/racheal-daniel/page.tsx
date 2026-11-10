import type { Metadata } from "next";
import { RachealDanielInvite } from "./invite";

export const metadata: Metadata = {
  title: "Daniel & Racheal",
  description: "Thursday 1 October 2026 · Twelve noon · Suzy Hall, Ikeja",
};

export default function RachealDanielPage() {
  return <RachealDanielInvite />;
}
