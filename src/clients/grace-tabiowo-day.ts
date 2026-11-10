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

/** Mrs Grace Ayo Tabiowo — 80th birthday client pack. */
export const graceTabiowoDay = {
  id: "client-grace-tabiowo",
  template: "Ivory",
  name: "Mrs Grace Ayo Tabiowo",
  shortName: "Mummy Grace",
  age: 80,
  headline: "A life preserved by God’s Grace",
  message:
    "Join us as we celebrate the testimony of God’s faithfulness in the life of Mummy Grace Ayo Tabiowo at 80.",
  words: ["Warm", "Confident", "Neat"],
  about: "Neat and beautiful — wonderfully herself.",
  milestone: "80 years of divine preservation and unfailing grace.",
  dateLabel: "Saturday, 5 December 2026",
  shortDate: "5 December",
  dateISO: "2026-12-05T10:00:00+01:00",
  place: "Lagos",
  dress: "White and gold",
  guestNote: "Guests are to come with their access card.",
  celebrationType: "Dinner celebration",
  feel: "Elegant and intimate",
  hours: [
    {
      time: "10:00",
      title: "Thanksgiving Mass",
      detail:
        "Our Lady of Fatima Catholic Church, 12 Adetayo Sode Street near Nepa installation, Aguda, Surulere, Lagos.",
    },
    {
      time: "12:00",
      title: "Reception",
      detail:
        "Multipurpose Hall, Sickle Cell Foundation Nigeria, National Sickle Cell Center, Ishaga Road opposite LASUTH, Idi-Araba, Lagos.",
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
  /** Image 1 featured first (per form). */
  photos: [
    {
      src: "/photos/grace-tabiowo/photo-1.jpg",
      focus: "center 18%",
      alt: "Mrs Grace Ayo Tabiowo in champagne lace and gele",
    },
    {
      src: "/photos/grace-tabiowo/photo-2.jpg",
      focus: "center 16%",
      alt: "Mrs Grace in lilac and purple gele",
    },
    {
      src: "/photos/grace-tabiowo/photo-3.jpg",
      focus: "center 20%",
      alt: "Mrs Grace in cream and rose-gold lace",
    },
    {
      src: "/photos/grace-tabiowo/photo-4.jpg",
      focus: "center 18%",
      alt: "A joyful portrait of Mummy Grace",
    },
    {
      src: "/photos/grace-tabiowo/photo-5.jpg",
      focus: "center 18%",
      alt: "Celebrating Grace",
    },
    {
      src: "/photos/grace-tabiowo/photo-6.jpg",
      focus: "center 18%",
      alt: "Grace, beautifully hers",
    },
    {
      src: "/photos/grace-tabiowo/photo-7.jpg",
      focus: "center 18%",
      alt: "A moment to remember",
    },
    {
      src: "/photos/grace-tabiowo/photo-8.jpg",
      focus: "center 18%",
      alt: "Eighty years of grace",
    },
  ] satisfies BirthdayPhoto[],
  musicSrc: "/music/birthday-celebrate.mp3",
  songLabel: "Birthday celebrate",
  rsvpPhone: "08023265378",
  introScenes: [
    {
      kicker: "Scroll to begin",
      title: "A birthday,",
      accent: "beautifully yours",
      body: "A little corner of the internet for Mummy Grace — eighty years of light, laughter, and love.",
    },
    {
      kicker: "The celebration",
      title: "Eighty years",
      accent: "and counting",
      body: "Warm. Confident. Neat. The kind of presence that makes a room feel like home.",
    },
    {
      kicker: "Wonderfully her",
      title: "Neat and",
      accent: "beautiful",
      body: "Every gele, every smile, every quiet strength — this is Grace, fully herself.",
    },
    {
      kicker: "Our headline",
      title: "A life preserved",
      accent: "by God’s Grace",
      body: "Join us as we celebrate the testimony of God’s faithfulness in her life at 80.",
    },
    {
      kicker: "The milestone",
      title: "Divine preservation",
      accent: "& unfailing grace",
      body: "Saturday, 5 December 2026 · Thanksgiving Mass at 10am · Reception at 12pm · Lagos",
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

export type GraceTabiowoDay = typeof graceTabiowoDay;
