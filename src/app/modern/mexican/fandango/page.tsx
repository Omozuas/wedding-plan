import type { Metadata } from "next";
import { Fandango } from "@/templates/modern/mexican/fandango";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Fandango. Four o'clock at the Boathouse, Cedar Point.",
};

export default function FandangoPage() {
  return <Fandango />;
}
