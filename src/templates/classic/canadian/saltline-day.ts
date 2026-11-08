import { defaultImages, themeVars, type WeddingColors, type WeddingImages, type WeddingUi } from "@/content";
import { palettes } from "@/content/palettes";

/** Saltline keeps a custom beat/hour shape; theme fields still editable. */
export const saltlineDay = {
  name: "Saltline",
  couple: "Elise & Jonah",
  bride: "Elise Moreau",
  groom: "Jonah Hale",
  first: "Elise",
  second: "Jonah",
  dateLabel: "Saturday, 12 September 2026",
  shortDate: "12 September",
  time: "The 4:40 sailing",
  place: "Bowen Island",
  region: "Howe Sound",
  venue: "Orchard House, Snug Cove",
  ferry: "Horseshoe Bay to Snug Cove",
  address: "The path past the general store",
  beats: [
    {
      src: defaultImages.walk.src,
      kicker: "The ramp",
      line: "The ramp knocks once. Salt is already on your sleeve, and someone puts a glass in your hand before the road.",
    },
    {
      src: defaultImages.dress.src,
      kicker: "The house",
      line: "Jars line the path. You hear the strings before the orchard opens, and the long table is already bright.",
    },
    {
      src: defaultImages.kiss.src,
      kicker: "The turn",
      line: "She turns under the last light. The water behind her is the same colour as the coat on your arm.",
    },
  ],
  hours: [
    { at: "4:40", title: "The sailing", line: "Upper deck. Bowen is a dark green line getting closer." },
    { at: "5:20", title: "The cove", line: "You step off. The store, then the bend, then the trees." },
    { at: "6:00", title: "The vows", line: "Under the orchard. The light is low and warm on the grass." },
    { at: "8:00", title: "Supper", line: "Inside the house. Your place is the chair by the window." },
    { at: "10:00", title: "The water", line: "Lanterns down the path. The last ferry can wait." },
  ],
  arrivals: ["On the 4:40", "A later sailing", "Already on the island"],
  meta: {
    id: "canadian-saltline",
    family: "classic" as const,
    style: "canadian",
    name: "Saltline",
  },
  images: {
    ...defaultImages,
    walk: { src: "/photos/walk.jpg", focus: "center 30%", alt: "On the path" },
    dress: { src: "/photos/dress.jpg", focus: "center", alt: "The house path" },
      more: [
        // Optional: add up to 4 more (10 total with the 6 above)
        // { src: "/photos/hero-1.jpg", focus: "center", alt: "Extra 1" },
        // { src: "/photos/hero-2.jpg", focus: "center", alt: "Extra 2" },
        // { src: "/photos/hero-3.jpg", focus: "center", alt: "Extra 3" },
        // { src: "/photos/hero-4.jpg", focus: "center", alt: "Extra 4" },
      ],
    kiss: { src: "/photos/kiss.jpg", focus: "center 36%", alt: "The turn" },
  } satisfies WeddingImages,
  colors: palettes.saltline satisfies WeddingColors,
  ui: {
    introKicker: "The sailing",
    rsvpTitle: "Save my place",
    rsvpSuccess: "We will look for you, {name}.",
    rsvpCta: "I am coming",
    skip: "Skip",
  } satisfies WeddingUi,
  themeStyle: themeVars(palettes.saltline),
};
