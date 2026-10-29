import type { Metadata } from "next";
import { Shutter } from "@/templates/genz/canadian/shutter";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Shutter. Four o'clock at the Boathouse, Cedar Point.",
};

export default function ShutterPage() {
  return <Shutter />;
}
