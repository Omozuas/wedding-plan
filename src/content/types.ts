import type { CSSProperties } from "react";

export type Photo = {
  src: string;
  focus?: string;
  alt?: string;
  /** Optional media kind for album grids (defaults to image). */
  kind?: "image" | "video";
};

export type Hour = {
  time: string;
  title: string;
  detail: string;
};

export type Stay = {
  name: string;
  detail: string;
};

export type WeddingColors = {
  bg: string;
  ink: string;
  muted: string;
  accent: string;
  accentAlt?: string;
  surface: string;
  surfaceAlt?: string;
  onAccent: string;
};

/**
 * Photo pack for a template.
 * - 6 required named slots (couple → dress)
 * - `more`: optional extras for the album / extra rooms (up to 30)
 */
export type WeddingImages = {
  couple: Photo;
  walk: Photo;
  bouquet: Photo;
  rings: Photo;
  kiss: Photo;
  dress: Photo;
  /** Extra photos/videos for the album (and optional narrative rooms). */
  more?: Photo[];
};

export type WeddingUi = {
  introKicker: string;
  rsvpTitle: string;
  rsvpSuccess: string;
  rsvpCta: string;
  skip: string;
};

export type WeddingMeta = {
  id: string;
  family: "classic" | "hubble" | "modern" | "genz";
  style: string;
  name: string;
};

/** Full editable pack for a template demo. */
export type WeddingContent = {
  meta: WeddingMeta;
  couple: {
    display: string;
    bride: string;
    groom: string;
    first: string;
    second: string;
  };
  when: {
    dateLabel: string;
    shortDate: string;
    time: string;
  };
  where: {
    venue: string;
    place: string;
    address: string;
  };
  copy: {
    arrival: string;
    letter: string[];
    dock: string[];
    dress: string;
    stays: Stay[];
    hours: Hour[];
  };
  images: WeddingImages;
  colors: WeddingColors;
  ui: WeddingUi;
  extras?: Record<string, unknown>;
};

/**
 * Flat shape templates already read (day.first, day.venue, …)
 * plus theme fields users edit (images, colors, ui, extras, meta).
 */
export type WeddingDay = {
  couple: string;
  bride: string;
  groom: string;
  first: string;
  second: string;
  dateLabel: string;
  shortDate: string;
  time: string;
  venue: string;
  place: string;
  address: string;
  arrival: string;
  letter: string[];
  dock: string[];
  hours: Hour[];
  dress: string;
  stays: Stay[];
  meta: WeddingMeta;
  images: WeddingImages;
  colors: WeddingColors;
  ui: WeddingUi;
  extras: Record<string, unknown>;
  /** Optional Mirador (and similar) climb labels. */
  floors?: string[];
};

export const defaultImages: WeddingImages = {
  couple: { src: "/photos/couple.jpg", focus: "center 30%", alt: "The couple" },
  walk: { src: "/photos/walk.jpg", focus: "center 40%", alt: "Walking together" },
  bouquet: { src: "/photos/bouquet.jpg", focus: "center", alt: "The bouquet" },
  rings: { src: "/photos/rings.jpg", focus: "center", alt: "The rings" },
  kiss: { src: "/photos/kiss.jpg", focus: "center 36%", alt: "A kiss" },
  dress: { src: "/photos/dress.jpg", focus: "center", alt: "The dress" },
  more: [],
};

const MAX_MORE = 30;

/** Flatten named slots + extras into one list. */
export function photoList(images: WeddingImages): Photo[] {
  const named = [images.couple, images.walk, images.bouquet, images.rings, images.kiss, images.dress];
  const extras = (images.more ?? []).slice(0, MAX_MORE);
  return [...named, ...extras];
}

/** Merge user images onto defaults; clamp `more` to MAX_MORE. */
export function normalizeImages(partial?: Partial<WeddingImages>): WeddingImages {
  const more = [...(partial?.more ?? defaultImages.more ?? [])].slice(0, MAX_MORE);
  return {
    couple: partial?.couple ?? defaultImages.couple,
    walk: partial?.walk ?? defaultImages.walk,
    bouquet: partial?.bouquet ?? defaultImages.bouquet,
    rings: partial?.rings ?? defaultImages.rings,
    kiss: partial?.kiss ?? defaultImages.kiss,
    dress: partial?.dress ?? defaultImages.dress,
    more,
  };
}

export function isVideoPhoto(photo: Photo) {
  if (photo.kind === "video") return true;
  if (photo.kind === "image") return false;
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(photo.src);
}

export function themeVars(colors: WeddingColors): CSSProperties {
  return {
    ["--w-bg" as string]: colors.bg,
    ["--w-ink" as string]: colors.ink,
    ["--w-muted" as string]: colors.muted,
    ["--w-accent" as string]: colors.accent,
    ["--w-accent-alt" as string]: colors.accentAlt ?? colors.accent,
    ["--w-surface" as string]: colors.surface,
    ["--w-surface-alt" as string]: colors.surfaceAlt ?? colors.surface,
    ["--w-on-accent" as string]: colors.onAccent,
  };
}

type DayInput = {
  couple: string;
  bride: string;
  groom: string;
  first?: string;
  second?: string;
  dateLabel: string;
  shortDate?: string;
  time: string;
  venue: string;
  place: string;
  address: string;
  arrival: string;
  letter?: string[];
  dock?: string[];
  hours: Hour[];
  dress?: string;
  stays?: Stay[];
  /** Template-specific fields (e.g. Mirador floors) kept on the day object. */
  [key: string]: unknown;
};

export function defineDay(
  meta: WeddingMeta,
  day: DayInput,
  theme: {
    colors: WeddingColors;
    images?: Partial<WeddingImages>;
    ui?: Partial<WeddingUi>;
    extras?: Record<string, unknown>;
  },
): WeddingDay & Record<string, unknown> {
  const [firstGuess, secondGuess] = day.couple.split(/\s*&\s*/);
  const {
    couple,
    bride,
    groom,
    first,
    second,
    dateLabel,
    shortDate,
    time,
    venue,
    place,
    address,
    arrival,
    letter,
    dock,
    hours,
    dress,
    stays,
    floors,
    ...rest
  } = day;

  return {
    couple,
    bride,
    groom,
    first: (first as string | undefined) ?? firstGuess ?? "",
    second: (second as string | undefined) ?? secondGuess ?? "",
    dateLabel,
    shortDate: (shortDate as string | undefined) ?? dateLabel,
    time,
    venue,
    place,
    address,
    arrival,
    letter: (letter as string[] | undefined) ?? (dock as string[] | undefined) ?? [],
    dock: (dock as string[] | undefined) ?? (letter as string[] | undefined) ?? [],
    hours: hours as Hour[],
    dress: (dress as string | undefined) ?? "",
    stays: (stays as Stay[] | undefined) ?? [],
    floors: Array.isArray(floors) ? (floors as string[]) : undefined,
    meta,
    images: normalizeImages(theme.images),
    colors: theme.colors,
    ui: {
      introKicker: theme.ui?.introKicker ?? meta.name,
      rsvpTitle: theme.ui?.rsvpTitle ?? "Save my place",
      rsvpSuccess: theme.ui?.rsvpSuccess ?? "We will look for you, {name}.",
      rsvpCta: theme.ui?.rsvpCta ?? "I am coming",
      skip: theme.ui?.skip ?? "Skip",
    },
    extras: theme.extras ?? {},
    ...rest,
  };
}

export function toContent(day: WeddingDay): WeddingContent {
  return {
    meta: day.meta,
    couple: {
      display: day.couple,
      bride: day.bride,
      groom: day.groom,
      first: day.first,
      second: day.second,
    },
    when: {
      dateLabel: day.dateLabel,
      shortDate: day.shortDate,
      time: day.time,
    },
    where: {
      venue: day.venue,
      place: day.place,
      address: day.address,
    },
    copy: {
      arrival: day.arrival,
      letter: day.letter,
      dock: day.dock,
      dress: day.dress,
      stays: day.stays,
      hours: day.hours,
    },
    images: day.images,
    colors: day.colors,
    ui: day.ui,
    extras: day.extras,
  };
}
