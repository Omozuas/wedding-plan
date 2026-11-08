import type { Metadata } from "next";
import { Legacy } from "@/templates/classic/afroamerican/legacy";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Legacy. Four o'clock at the Boathouse, Cedar Point.",
};

export default function LegacyPage() {
  return <Legacy />;
}
