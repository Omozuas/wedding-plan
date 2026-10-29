import type { Metadata } from "next";
import { Compas } from "@/templates/modern/spanish/compas";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Compás. Four o'clock at the Boathouse, Cedar Point.",
};

export default function CompasPage() {
  return <Compas />;
}
