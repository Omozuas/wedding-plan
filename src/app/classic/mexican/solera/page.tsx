import type { Metadata } from "next";
import { Solera } from "@/templates/classic/mexican/solera";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Solera. Four o'clock at the Boathouse, Cedar Point.",
};

export default function SoleraPage() {
  return <Solera />;
}
