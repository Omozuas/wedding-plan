import type { Metadata } from "next";
import { Goldhour } from "@/templates/hubble/canadian/goldhour";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Goldhour. The Boathouse at Cedar Point.",
};

export default function GoldhourPage() {
  return <Goldhour />;
}
