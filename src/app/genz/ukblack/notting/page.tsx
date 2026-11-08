import type { Metadata } from "next";
import { Notting } from "@/templates/genz/ukblack/notting";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Notting. Four o'clock at the Boathouse, Cedar Point.",
};

export default function NottingPage() {
  return <Notting />;
}
