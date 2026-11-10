export type BirthdayPhoto = {
  src: string;
  focus?: string;
  alt?: string;
};

export type BirthdayHour = {
  time: string;
  title: string;
  detail: string;
};

export type BirthdayColors = {
  bg: string;
  ink: string;
  muted: string;
  accent: string;
  accentAlt: string;
  surface: string;
  surfaceAlt: string;
  onAccent: string;
};

/** Ivory demo pack — selectable birthday template. */
export const ivoryDay = {
  id: "birthday-ivory",
  template: "Ivory",
  name: "Evelyn Hart",
  shortName: "Evelyn",
  age: 80,
  headline: "A life gathered in light",
  message: "Join us as we celebrate eighty years of warmth, wisdom, and quiet joy.",
  words: ["Warm", "Graceful", "Steady"],
  about: "Elegant and luminous — wonderfully herself.",
  milestone: "Eighty years of love, laughter, and gentle strength.",
  dateLabel: "Saturday, 14 November 2026",
  shortDate: "14 November",
  dateISO: "2026-11-14T16:00:00+01:00",
  place: "Lagos",
  dress: "Cream and gold",
  guestNote: "Please bring your invitation card.",
  celebrationType: "Dinner celebration",
  feel: "Elegant and intimate",
  hours: [
    {
      time: "4:00",
      title: "Thanksgiving",
      detail: "A quiet hour of gratitude before the evening begins.",
    },
    {
      time: "6:00",
      title: "Reception",
      detail: "Supper, speeches, and dancing until the lanterns rise.",
    },
  ] satisfies BirthdayHour[],
  colors: {
    bg: "#0f0c08",
    ink: "#f7f0e4",
    muted: "rgba(247,240,228,0.78)",
    accent: "#d4b57a",
    accentAlt: "#8a6a3a",
    surface: "#1a1510",
    surfaceAlt: "#2a2218",
    onAccent: "#0f0c08",
  } satisfies BirthdayColors,
  photos: [
    { src: "/photos/couple.jpg", focus: "center 22%", alt: "Evelyn in soft light" },
    { src: "/photos/bouquet.jpg", focus: "center 30%", alt: "Florals for the evening" },
    { src: "/photos/walk.jpg", focus: "center 28%", alt: "A walk before supper" },
    { src: "/photos/kiss.jpg", focus: "center 30%", alt: "A cherished moment" },
    { src: "/photos/rings.jpg", focus: "center 40%", alt: "Details of the day" },
    { src: "/photos/florals.jpg", focus: "center 35%", alt: "Gold and cream florals" },
  ] satisfies BirthdayPhoto[],
  musicSrc: "/music/birthday-celebrate.mp3",
  songLabel: "Birthday celebrate",
  rsvpPhone: "00000000000",
  introScenes: [
    {
      kicker: "Scroll to begin",
      title: "A birthday,",
      accent: "beautifully yours",
      body: "An intimate welcome for eighty years of light.",
    },
    {
      kicker: "The celebration",
      title: "Eighty years",
      accent: "and counting",
      body: "Warm. Graceful. Steady. The kind of presence that gathers a room.",
    },
    {
      kicker: "The evening",
      title: "Come celebrate",
      accent: "with us",
      body: "Saturday, 14 November 2026 · Thanksgiving at 4pm · Reception at 6pm.",
    },
  ],
  ui: {
    introKicker: "A birthday, beautifully yours",
    openHint: "Tap open, then scroll the welcome",
    welcome: "Welcome",
    welcomeFoot: "Keep scrolling · the celebration is next",
    skip: "Skip intro",
    rsvpTitle: "Will you be there?",
    rsvpCta: "Send RSVP",
    rsvpSuccess: "Thank you, {name}. We will look for you.",
  },
};

export type BirthdayDay = typeof ivoryDay;
