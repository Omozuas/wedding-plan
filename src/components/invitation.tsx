"use client";

import { ClassicInvite } from "@/templates/classic/invite";
import { GenZInvite } from "@/templates/genz/invite";
import { HarbourInvite } from "@/templates/harbour/invite";
import { ModernInvite } from "@/templates/modern/invite";

const templates = [
  { id: "classic", label: "Classic" },
  { id: "harbour", label: "Harbour" },
  { id: "modern", label: "Modern" },
  { id: "genz", label: "Gen Z" },
] as const;

export type TemplateId = (typeof templates)[number]["id"];

export function Invitation({
  onClose,
  template,
}: {
  onClose: () => void;
  template: TemplateId;
}) {
  return (
    <>
      {template === "modern" ? (
        <ModernInvite onClose={onClose} />
      ) : template === "genz" ? (
        <GenZInvite onClose={onClose} />
      ) : template === "harbour" ? (
        <HarbourInvite onClose={onClose} />
      ) : (
        <ClassicInvite onClose={onClose} />
      )}
    </>
  );
}
