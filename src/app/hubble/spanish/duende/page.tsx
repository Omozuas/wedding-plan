import type { Metadata } from "next";
import { Duende } from "@/templates/hubble/spanish/duende";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Duende. Four o'clock at the Boathouse, Cedar Point.",
};

export default function DuendePage() {
  return <Duende />;
}
