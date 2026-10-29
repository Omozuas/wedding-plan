import type { Metadata } from "next";
import { Mirador } from "@/templates/hubble/mexican/mirador";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Mirador. Four o'clock at the Boathouse, Cedar Point.",
};

export default function MiradorPage() {
  return <Mirador />;
}
