import type { Metadata } from "next";
import { Skyburst } from "@/templates/genz/afroamerican/skyburst";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Skyburst. Four o'clock at the Boathouse, Cedar Point.",
};

export default function SkyburstPage() {
  return <Skyburst />;
}
