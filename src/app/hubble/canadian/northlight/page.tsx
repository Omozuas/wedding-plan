import type { Metadata } from "next";
import { Northlight } from "@/templates/hubble/canadian/northlight";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Northlight. Lake Rosseau, 3 October.",
};

export default function NorthlightPage() {
  return <Northlight />;
}
