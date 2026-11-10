import type { Metadata } from "next";
import { Ivory } from "@/templates/birthday/ivory";

export const metadata: Metadata = {
  title: "Ivory · Birthday",
  description: "Ivory birthday template — elegant scroll welcome and celebration.",
};

export default function IvoryPage() {
  return <Ivory />;
}
