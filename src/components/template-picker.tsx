"use client";

import Link from "next/link";

const families: {
  href: string;
  family: string;
  name: string;
  line: string;
  note: string;
  photo: string;
  delay: string;
}[] = [
  {
    href: "/classic/nigerian",
    family: "Classic",
    name: "Eko",
    line: "Nigerian classic",
    note: "Script, navy, and a wax seal",
    photo: "/photos/story-4.jpg",
    delay: "0.05s",
  },
  {
    href: "/hubble/nigerian",
    family: "Hubble",
    name: "Victoria",
    line: "Nigerian harbour",
    note: "Editorial type and a harbour evening",
    photo: "/photos/story-2.jpg",
    delay: "0.16s",
  },
  {
    href: "/modern/nigerian",
    family: "Modern",
    name: "Marina",
    line: "Nigerian modern",
    note: "Black, cream, and a moving portrait",
    photo: "/photos/story-4.jpg",
    delay: "0.28s",
  },
  {
    href: "/genz/nigerian",
    family: "Gen Z",
    name: "Owambe",
    line: "Nigerian story",
    note: "A story you tap through",
    photo: "/photos/story-2.jpg",
    delay: "0.4s",
  },
];

function Actions({ href, tone }: { href: string; tone: "navy" | "gold" | "cream" | "story" }) {
  const ghost =
    tone === "navy"
      ? "border border-[#16356e] bg-transparent text-[#16356e]"
      : tone === "gold"
        ? "border border-[#e6d3a4] bg-transparent text-[#e6d3a4]"
        : tone === "story"
          ? "border border-white/20 bg-white/10 text-white"
          : "border border-white/25 bg-transparent text-white";
  const solid =
    tone === "navy"
      ? "border-0 bg-[#16356e] text-[#f7f3ea]"
      : tone === "gold"
        ? "border-0 bg-[#e6d3a4] text-[#0c2348]"
        : tone === "story"
          ? "border-0 bg-[#e4c36a] text-[#111]"
          : "border-0 bg-white text-[#121212]";

  return (
    <div className="grid grid-cols-2 gap-2">
      <Link
        href={href}
        className={`rounded-full px-3 py-3 text-center font-[family-name:var(--font-ui)] text-[0.72rem] font-medium tracking-[0.08em] uppercase no-underline ${ghost}`}
      >
        View demo
      </Link>
      <Link
        href={href}
        className={`rounded-full px-3 py-3 text-center font-[family-name:var(--font-ui)] text-[0.72rem] font-semibold tracking-[0.08em] uppercase no-underline ${solid}`}
      >
        Use template
      </Link>
    </div>
  );
}

export function TemplatePicker() {
  return (
    <main className="min-h-dvh bg-[#efeae2] px-5 py-14 text-[#121212]">
      <div className="mx-auto max-w-[28rem]">
        <p className="m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.32em] text-[#9a7b45] uppercase">Adaeze &amp; Emeka</p>
        <h1 className="m-0 mt-3 max-w-[10ch] font-[family-name:var(--font-display)] text-[clamp(3rem,12vw,4.6rem)] leading-[0.88] font-extrabold tracking-[-0.05em]">
          Select a template
        </h1>
        <div className="mt-12 grid gap-12">
          {families.map((family) => (
            <section
              key={family.href}
              className="motion-reduce:animate-none"
              style={{ animation: `picker-in 0.8s ease ${family.delay} both` }}
            >
              <h2 className="m-0 font-[family-name:var(--font-ui)] text-[0.72rem] tracking-[0.28em] text-[#9a7b45] uppercase">{family.family}</h2>
              {family.href === "/classic/nigerian" && <ClassicCard family={family} />}
              {family.href === "/hubble/nigerian" && <HarbourCard family={family} />}
              {family.href === "/modern/nigerian" && <ModernCard family={family} />}
              {family.href === "/genz/nigerian" && <GenZCard family={family} />}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

type CardProps = {
  family: (typeof families)[number];
};

function CouplePhoto({ src, className }: { src: string; className: string }) {
  return (
    <img
      src={src}
      alt="Adaeze and Emeka"
      className={`motion-safe:animate-[picker-ken_16s_ease-in-out_infinite_alternate] motion-reduce:animate-none ${className}`}
    />
  );
}

function ClassicCard({ family }: CardProps) {
  return (
    <article className="mt-3 rounded-[1.6rem] bg-[#f7f3ea] px-5 pt-6 pb-5 shadow-[0_18px_40px_rgba(22,53,110,0.12)] ring-1 ring-[#16356e]/15">
      <div className="relative mx-auto w-[78%] overflow-hidden rounded-[8rem] border border-[#16356e]/25 bg-[#16356e]">
        <CouplePhoto src={family.photo} className="aspect-[3/4] w-full object-cover object-[center_18%]" />
        <span className="absolute bottom-4 left-1/2 grid size-14 -translate-x-1/2 place-items-center rounded-full border border-[#e6d3a4] bg-[#9a1b2e] font-[family-name:var(--font-script)] text-lg text-[#f7f3ea] shadow-[0_8px_18px_rgba(0,0,0,0.25)] motion-safe:animate-[picker-seal_2.8s_ease-in-out_infinite] motion-reduce:animate-none">
          A·E
        </span>
      </div>
      <h3 className="m-0 mt-5 text-center font-[family-name:var(--font-script)] text-6xl leading-none text-[#16356e]">{family.name}</h3>
      <p className="m-0 mt-2 text-center font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.22em] text-[#9a7b45] uppercase">{family.line}</p>
      <p className="m-0 mt-2 text-center font-[family-name:var(--font-serif)] text-lg text-[#16356e]/80">{family.note}</p>
      <div className="mt-5">
        <Actions href={family.href} tone="navy" />
      </div>
    </article>
  );
}

function HarbourCard({ family }: CardProps) {
  return (
    <article className="relative mt-3 overflow-hidden rounded-[1.4rem] bg-[#0c2348] text-[#f7f3ea] shadow-[0_18px_40px_rgba(12,35,72,0.28)]">
      <div className="relative h-72 overflow-hidden">
        <CouplePhoto src={family.photo} className="size-full object-cover object-[center_15%]" />
        <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(230,211,164,0.45),transparent)] motion-safe:animate-[picker-sweep_4.2s_ease-in-out_infinite] motion-reduce:animate-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c2348] via-[#0c2348]/15 to-transparent" />
      </div>
      <div className="px-5 pt-1 pb-5">
        <p className="m-0 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.28em] text-[#e6d3a4] uppercase">A letter from Lagos</p>
        <h3 className="m-0 mt-1 font-[family-name:var(--font-serif)] text-6xl leading-none font-medium">{family.name}</h3>
        <p className="m-0 mt-3 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.22em] text-[#e6d3a4] uppercase">{family.line}</p>
        <p className="m-0 mt-2 font-[family-name:var(--font-serif)] text-lg text-white/75">{family.note}</p>
        <div className="mt-5">
          <Actions href={family.href} tone="gold" />
        </div>
      </div>
    </article>
  );
}

function ModernCard({ family }: CardProps) {
  return (
    <article className="mt-3 rounded-[1.6rem] bg-[#121212] px-5 py-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
      <div className="relative">
        <span className="pointer-events-none absolute top-3 left-3 z-[1] size-5 border-t border-l border-[#e6d3a4]" />
        <span className="pointer-events-none absolute top-3 right-3 z-[1] size-5 border-t border-r border-[#e6d3a4]" />
        <span className="pointer-events-none absolute bottom-3 left-3 z-[1] size-5 border-b border-l border-[#e6d3a4]" />
        <span className="pointer-events-none absolute right-3 bottom-3 z-[1] size-5 border-r border-b border-[#e6d3a4]" />
        <div className="overflow-hidden">
          <CouplePhoto src={family.photo} className="aspect-[4/5] w-full object-cover object-[center_18%]" />
        </div>
      </div>
      <h3 className="m-0 mt-5 font-[family-name:var(--font-display)] text-5xl leading-none font-extrabold tracking-[-0.05em]">{family.name}</h3>
      <p className="m-0 mt-3 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.22em] text-[#e6d3a4] uppercase">{family.line}</p>
      <p className="m-0 mt-2 font-[family-name:var(--font-ui)] text-sm text-white/65">{family.note}</p>
      <div className="mt-5">
        <Actions href={family.href} tone="cream" />
      </div>
    </article>
  );
}

function GenZCard({ family }: CardProps) {
  return (
    <article className="mt-3 overflow-hidden rounded-[1.8rem] bg-[#07080d] p-3 text-[#f6f3ec] shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
      <div className="relative overflow-hidden rounded-[1.35rem]">
        <div className="absolute inset-x-3 top-3 z-[1] flex gap-1">
          {["0s", "2.6s", "5.2s"].map((delay) => (
            <span key={delay} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
              <span
                className="block h-full origin-left bg-white motion-reduce:animate-none"
                style={{ animation: `genz-bar 7.8s linear ${delay} infinite backwards` }}
              />
            </span>
          ))}
        </div>
        <CouplePhoto src={family.photo} className="aspect-[4/5] w-full object-cover object-[center_12%]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 pt-12 pb-4">
          <span className="inline-block rounded-full bg-[#e4c36a] px-3 py-1 font-[family-name:var(--font-display)] text-xs font-extrabold tracking-[-0.03em] text-[#111] motion-safe:animate-[genz-bob_3.2s_ease-in-out_infinite] motion-reduce:animate-none">
            tap in
          </span>
        </div>
      </div>
      <div className="px-2 pt-4 pb-2">
        <h3 className="m-0 font-[family-name:var(--font-display)] text-5xl leading-none font-extrabold tracking-[-0.05em]">{family.name}</h3>
        <p className="m-0 mt-3 font-[family-name:var(--font-ui)] text-[0.68rem] tracking-[0.22em] text-[#e6d3a4] uppercase">{family.line}</p>
        <p className="m-0 mt-2 font-[family-name:var(--font-ui)] text-sm text-white/65">{family.note}</p>
        <div className="mt-4">
          <Actions href={family.href} tone="story" />
        </div>
      </div>
    </article>
  );
}
