"use client";

import { useState } from "react";
import { ClassicInvite } from "@/components/classic-invite";
import { GenZInvite } from "@/components/genz-invite";
import { ModernInvite } from "@/components/modern-invite";

const templates = [
  { id: "classic", label: "Classic" },
  { id: "harbour", label: "Harbour" },
  { id: "modern", label: "Modern" },
  { id: "genz", label: "Gen Z" },
] as const;

type TemplateId = (typeof templates)[number]["id"];

export function Invitation({ onClose }: { onClose: () => void }) {
  const [template, setTemplate] = useState<TemplateId>("modern");

  return (
    <>
      <div className="design-switch" role="group" aria-label="Design template">
        {templates.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={template === item.id}
            onClick={() => setTemplate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {template === "modern" ? (
        <ModernInvite onClose={onClose} />
      ) : template === "genz" ? (
        <GenZInvite onClose={onClose} />
      ) : (
        <ClassicInvite onClose={onClose} layout={template} />
      )}
    </>
  );
}
