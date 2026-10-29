import type { Metadata } from "next";
import { Vela } from "@/templates/genz/spanish/vela";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Vela. Four o'clock at the Boathouse, Cedar Point.",
};

export default function VelaPage() {
  return <Vela />;
}
