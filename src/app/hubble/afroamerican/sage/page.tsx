import type { Metadata } from "next";
import { Sage } from "@/templates/hubble/afroamerican/sage";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Sage. Four o'clock at the Boathouse, Cedar Point.",
};

export default function SagePage() {
  return <Sage />;
}
