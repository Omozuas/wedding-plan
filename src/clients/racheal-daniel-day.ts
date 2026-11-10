import { defineDay } from "@/content";

/** Daniel & Racheal — Sage client site (sky blue / deep blue). */
export const rachealDanielDay = defineDay(
  {
    id: "client-racheal-daniel",
    family: "hubble",
    style: "client",
    name: "Sage",
  },
  {
    couple: "Daniel & Racheal",
    bride: "Racheal",
    groom: "Daniel",
    first: "Daniel",
    second: "Racheal",
    dateLabel: "Thursday, 1 October 2026",
    shortDate: "1 October",
    time: "Twelve noon",
    venue: "Suzy Hall, Ikeja",
    place: "Ikeja, Lagos",
    address: "Suzy Hall, Ikeja, Lagos",
    arrival: "A love written in the stars. Two hearts. One future.",
    letter: [
      "Some love stories begin with a grand gesture. Theirs began with two hearts finding something special in each other.",
      "When Daniel met Racheal, he did not know that a simple moment would become the beginning of a beautiful journey. There was something about her warmth, her smile, and the way she made ordinary moments feel special that drew him closer.",
      "For Racheal, Daniel became more than someone she loved. He became her friend, her safe place, and the person she wanted beside her through life’s unexpected turns.",
      "Together they chose each other, learned together, laughed through the little things, and stood together when life was not so easy. Now they begin the next chapter — shared dreams, whispered promises, and a love that continues to grow.",
    ],
    dock: [
      "Two hearts finding something special in each other.",
      "Warmth, a smile, and ordinary moments made luminous.",
      "A friend, a safe place, and a promise chosen daily.",
      "The most beautiful chapters are yet to come.",
    ],
    hours: [
      {
        time: "12:00",
        title: "The ceremony",
        detail: "A white wedding at Suzy Hall, Ikeja. Guests gather as they say yes.",
      },
      {
        time: "12:00",
        title: "The reception",
        detail: "Same hall, same afternoon — celebration continues under one roof.",
      },
      {
        time: "After",
        title: "The gathering",
        detail: "Sky blue and deep blue. Joy, family, and #Foreverstarttoday.",
      },
      {
        time: "Evening",
        title: "The night",
        detail: "Stay for the music, the laughter, and the last dance.",
      },
    ],
    dress: "White wedding. Sky blue and deep blue welcome. Soft, elegant, and ready to celebrate. #Foreverstarttoday",
    stays: [
      { name: "Suzy Hall, Ikeja", detail: "Ceremony and reception in one place. Arrive ready for noon." },
      { name: "Around Ikeja", detail: "Hotels and guest houses nearby if you are travelling in." },
      { name: "Hashtag", detail: "Share the day with #Foreverstarttoday." },
    ],
  },
  {
    colors: {
      bg: "#071428",
      ink: "#e8f4ff",
      muted: "rgba(232,244,255,0.8)",
      accent: "#7ec8ff",
      accentAlt: "#1a4f9c",
      surface: "#0b1c38",
      surfaceAlt: "#12305a",
      onAccent: "#071428",
    },
    images: {
      couple: {
        src: "/photos/racheal-daniel/photo-5.jpg",
        focus: "center 28%",
        alt: "Daniel and Racheal on their wedding day",
      },
      walk: {
        src: "/photos/racheal-daniel/photo-2.jpg",
        focus: "center 40%",
        alt: "Daniel and Racheal outdoors",
      },
      bouquet: {
        src: "/photos/racheal-daniel/photo-9.jpg",
        focus: "center 30%",
        alt: "Racheal with her bouquet",
      },
      rings: {
        src: "/photos/racheal-daniel/photo-8.jpg",
        focus: "center 25%",
        alt: "Daniel in white tuxedo",
      },
      kiss: {
        src: "/photos/racheal-daniel/photo-11.jpg",
        focus: "center 35%",
        alt: "Daniel and Racheal’s first dance",
      },
      dress: {
        src: "/photos/racheal-daniel/photo-3.jpg",
        focus: "center 30%",
        alt: "Daniel and Racheal under the arches",
      },
      more: [
        {
          src: "/photos/racheal-daniel/photo-6.jpg",
          focus: "center 30%",
          alt: "Daniel and Racheal in traditional green",
        },
        {
          src: "/photos/racheal-daniel/photo-10.jpg",
          focus: "center 25%",
          alt: "Racheal with her bouquet raised",
        },
        {
          src: "/photos/racheal-daniel/photo-12.jpg",
          focus: "center top",
          alt: "Racheal in emerald gele",
        },
        {
          src: "/photos/racheal-daniel/photo-4.jpg",
          focus: "center 40%",
          alt: "A quiet forehead kiss",
        },
      ],
    },
    ui: {
      introKicker: "Gather close",
      rsvpTitle: "Save our place",
      rsvpSuccess: "We will look for you, {name}.",
      rsvpCta: "I will be there",
      skip: "Skip",
    },
    extras: {
      hashtag: "#Foreverstarttoday",
      ceremonyType: "White wedding",
      songLabel: "Romantic piano",
      musicSrc: "/music/romantic-instrumental.mp3",
    },
  },
);
