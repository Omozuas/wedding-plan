import type { Metadata } from "next";
import { Plunge } from "@/templates/genz/canadian/plunge";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Plunge. Down the dock at Cedar Point, 3 October.",
};

export default function PlungePage() {
  return <Plunge />;
}
