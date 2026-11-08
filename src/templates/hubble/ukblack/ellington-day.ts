import { defineDay } from "@/content";
import { palettes } from "@/content/palettes";

export const ellingtonDay = defineDay(
  {
    id: "ukblack-ellington",
    family: "hubble",
    style: "ukblack",
    name: "Ellington",
  },
  {
  couple: "Claire & Thomas",
  bride: "Claire Beaumont",
  groom: "Thomas Reid",
  first: "Claire",
  second: "Thomas",
  dateLabel: "Saturday, 3 October 2026",
  shortDate: "3 October",
  time: "Four o'clock",
  venue: "The Boathouse at Cedar Point",
  place: "Lake Rosseau, Muskoka",
  address: "18 Cedar Point Road, Rosseau, Ontario",
  arrival: "The needle finds the groove. The afternoon is already playing.",
  letter: [
    "Come in quiet. The first note is the water against the boards.",
    "Claire Beaumont and Thomas Reid marry at four o'clock on Lake Rosseau, where the late ferry used to stop.",
    "The boathouse keeps the supper. The point keeps the maples. The bay keeps the hush after.",
    "18 Cedar Point Road, Rosseau. Stay near the water if you can.",
  ],
  dock: [
    "The boards still hold the afternoon.",
    "Maples along the point have gone gold.",
    "We marry where the late ferry used to stop.",
    "Then the lanterns come on, and the bay goes quiet.",
  ],
  hours: [
    { time: "4:00", title: "The vows", detail: "On the dock, while the light is still on the water." },
    { time: "5:30", title: "The fire", detail: "Cider, champagne, and the first sparks over the bay." },
    { time: "7:00", title: "Supper", detail: "Linen and cedar. One long table inside the boathouse." },
    { time: "9:00", title: "The lights", detail: "A string of bulbs from the dock into the trees." },
  ],
  dress: "A coat for the dock. Something soft for supper. Amber, pine, cream, and wool all belong here.",
  stays: [
    { name: "The Point cottage", detail: "On the property, a few steps from the dock. Two rooms are held." },
    { name: "Along the shore", detail: "Inns at Windermere, if you would rather the morning be quiet." },
    { name: "Port Carling", detail: "Rooms in the village if you come up on Friday." },
  ],
},
  {
    colors: palettes.ellington,
    images: {
      couple: { src: "/photos/couple.jpg", focus: "center 30%", alt: "The couple" },
      walk: { src: "/photos/walk.jpg", focus: "center 40%", alt: "Walking together" },
      bouquet: { src: "/photos/bouquet.jpg", focus: "center", alt: "The bouquet" },
      rings: { src: "/photos/rings.jpg", focus: "center", alt: "The rings" },
      kiss: { src: "/photos/kiss.jpg", focus: "center 36%", alt: "A kiss" },
      dress: { src: "/photos/dress.jpg", focus: "center", alt: "The dress" },
      more: [
        // Optional: add up to 4 more (10 total with the 6 above)
        // { src: "/photos/hero-1.jpg", focus: "center", alt: "Extra 1" },
        // { src: "/photos/hero-2.jpg", focus: "center", alt: "Extra 2" },
        // { src: "/photos/hero-3.jpg", focus: "center", alt: "Extra 3" },
        // { src: "/photos/hero-4.jpg", focus: "center", alt: "Extra 4" },
      ],
    },
    ui: {
          "introKicker": "Side A · The afternoon",
          "rsvpTitle": "Keep my place on the setlist",
          "rsvpSuccess": "We will look for you, {name}.",
          "rsvpCta": "I will be there"
    },
    extras: {
          "sideLabels": [
                "A1",
                "A2",
                "B1",
                "B2"
          ]
    },
  },
);
