import type { Metadata } from "next";
import { Saltline } from "@/templates/classic/canadian/saltline";

export const metadata: Metadata = {
  title: "Elise & Jonah",
  description: "Saltline. The 4:40 sailing to Bowen Island.",
};

export default function SaltlinePage() {
  return <Saltline />;
}
