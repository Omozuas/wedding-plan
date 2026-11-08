import type { Metadata } from "next";
import { Bassline } from "@/templates/genz/ukblack/bassline";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Bassline. Four o'clock at the Boathouse, Cedar Point.",
};

export default function BasslinePage() {
  return <Bassline />;
}
