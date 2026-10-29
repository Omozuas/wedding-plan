import type { Metadata } from "next";
import { Jaleo } from "@/templates/genz/spanish/jaleo";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Jaleo. Four o'clock at the Boathouse, Cedar Point.",
};

export default function JaleoPage() {
  return <Jaleo />;
}
