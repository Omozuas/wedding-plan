import type { Metadata } from "next";
import { Flurry } from "@/templates/modern/canadian/flurry";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Flurry. A burst of colour for Lake Rosseau, 3 October.",
};

export default function FlurryPage() {
  return <Flurry />;
}
