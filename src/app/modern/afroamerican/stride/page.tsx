import type { Metadata } from "next";
import { Stride } from "@/templates/modern/afroamerican/stride";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Stride. Four o'clock at the Boathouse, Cedar Point.",
};

export default function StridePage() {
  return <Stride />;
}
