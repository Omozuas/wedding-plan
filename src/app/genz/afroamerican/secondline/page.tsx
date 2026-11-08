import type { Metadata } from "next";
import { Secondline } from "@/templates/genz/afroamerican/secondline";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Secondline. Four o'clock at the Boathouse, Cedar Point.",
};

export default function SecondlinePage() {
  return <Secondline />;
}
