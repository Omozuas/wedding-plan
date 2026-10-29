import type { Metadata } from "next";
import { Azahar } from "@/templates/classic/spanish/azahar";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Azahar. Four o'clock at the Boathouse, Cedar Point.",
};

export default function AzaharPage() {
  return <Azahar />;
}
