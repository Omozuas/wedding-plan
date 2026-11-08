import type { Metadata } from "next";
import { Ellington } from "@/templates/hubble/ukblack/ellington";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Ellington. Four o'clock at the Boathouse, Cedar Point.",
};

export default function EllingtonPage() {
  return <Ellington />;
}
