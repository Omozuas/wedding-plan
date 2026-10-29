import type { Metadata } from "next";
import { Talavera } from "@/templates/genz/mexican/talavera";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Talavera. Four o'clock at the Boathouse, Cedar Point.",
};

export default function TalaveraPage() {
  return <Talavera />;
}
