# Editable wedding content packs

Each template’s `*-day.ts` file is where users change names, copy, photos, and colours.

## Shared helpers

- `src/content/types.ts` — `WeddingDay` / `WeddingContent`, `defineDay`, `themeVars`, `toContent`
- `src/content/palettes.ts` — default colour tokens per template
- `src/content/catalog.ts` — all packs keyed by `meta.id`

## Images — how many and where

**6 required + up to 4 optional = 10 max.**

### Required (6 named slots)

| Slot | What it is | Default file |
|------|------------|--------------|
| `couple` | Main portrait (hero / intro end) | `/photos/couple.jpg` |
| `walk` | Walking / approach | `/photos/walk.jpg` |
| `bouquet` | Flowers | `/photos/bouquet.jpg` |
| `rings` | Rings detail | `/photos/rings.jpg` |
| `kiss` | Kiss / close moment | `/photos/kiss.jpg` |
| `dress` | Dress / supper / detail | `/photos/dress.jpg` |

### Optional extras (up to 4 more)

Add them under `more` in the same `images` block:

```ts
more: [
  { src: "/photos/hero-1.jpg", focus: "center", alt: "Extra 1" },
  { src: "/photos/hero-2.jpg", focus: "center", alt: "Extra 2" },
  // up to 4 total in `more`
],
```

Use `photoList(day.images)` in code to get all photos in order (6–10).

1. Put files in `public/photos/`.
2. Edit that template’s `*-day.ts` → `images` block.
3. Change `src` paths; keep `more` length ≤ 4.

## Other fields to edit

| Field | Purpose |
|-------|---------|
| couple / first / second / bride / groom | Names |
| dateLabel / shortDate / time | When |
| venue / place / address | Where |
| arrival / letter / dock / hours / dress / stays | Copy |
| `colors.*` | bg, ink, muted, accent, accentAlt, surface, surfaceAlt, onAccent |
| `ui.*` | introKicker, rsvpTitle, rsvpSuccess, rsvpCta, skip |
| `extras.*` | Template-only labels (e.g. Bassline poster words) |

## CSS variables

Templates call `themeVars(day.colors)` on the root. Tokens:

`--w-bg` `--w-ink` `--w-muted` `--w-accent` `--w-accent-alt` `--w-surface` `--w-surface-alt` `--w-on-accent`

## Nested API shape

```ts
import { toContent } from "@/content";
import { vestryDay } from "@/templates/classic/ukblack/vestry-day";

const pack = toContent(vestryDay);
```
