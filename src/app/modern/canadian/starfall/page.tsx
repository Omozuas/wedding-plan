import type { Metadata } from "next";
import { Starfall } from "@/templates/modern/canadian/starfall";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Starfall. Fireworks over Lake Rosseau, 3 October.",
};

export default function StarfallPage() {
  return <Starfall />;
}
