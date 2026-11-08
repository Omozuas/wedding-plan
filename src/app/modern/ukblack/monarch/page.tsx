import type { Metadata } from "next";
import { Monarch } from "@/templates/modern/ukblack/monarch";

export const metadata: Metadata = {
  title: "Claire & Thomas",
  description: "Monarch. Four o'clock at the Boathouse, Cedar Point.",
};

export default function MonarchPage() {
  return <Monarch />;
}
