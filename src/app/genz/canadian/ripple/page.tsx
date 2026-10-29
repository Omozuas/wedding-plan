import type { Metadata } from "next";
import { Ripple } from "@/templates/genz/canadian/ripple";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Ripple. The lake opens at Cedar Point, 3 October.",
};

export default function RipplePage() {
  return <Ripple />;
}
