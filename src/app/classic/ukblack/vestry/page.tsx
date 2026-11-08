import type { Metadata } from "next";
import { Vestry } from "@/templates/classic/ukblack/vestry";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Vestry. Four o'clock at the Boathouse, Cedar Point.",
};

export default function VestryPage() {
  return <Vestry />;
}
