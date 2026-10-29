import type { Metadata } from "next";
import { Paseo } from "@/templates/genz/mexican/paseo";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Paseo. Four o'clock at the Boathouse, Cedar Point.",
};

export default function PaseoPage() {
  return <Paseo />;
}
