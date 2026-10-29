import type { Metadata } from "next";
import { Kindling } from "@/templates/genz/canadian/kindling";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Kindling. Four o'clock at the Boathouse, Cedar Point.",
};

export default function KindlingPage() {
  return <Kindling />;
}
