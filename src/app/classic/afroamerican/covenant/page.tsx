import type { Metadata } from "next";
import { Covenant } from "@/templates/classic/afroamerican/covenant";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Covenant. Four o'clock at the Boathouse, Cedar Point.",
};

export default function CovenantPage() {
  return <Covenant />;
}
