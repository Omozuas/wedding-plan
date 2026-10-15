export const wedding = {
  couple: "Adaeze & Emeka",
  dateLabel: "Saturday, 17 October 2026",
  shortDate: "17/10/2026",
  ceremonyAt: "2026-10-17T16:00:00+01:00",
  venue: "Eko Hotels & Suites",
  address: "Plot 1415 Adetokunbo Ademola Street, Victoria Island, Lagos",
  addressShort: "Plot 1415 Adetokunbo Ademola St, Victoria Island",
  starts: "From 4:00 PM",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Eko+Hotels+%26+Suites+Victoria+Island+Lagos",
  story:
    "From the shores of Lagos to forever — with hearts full of joy and gratitude, we invite you to celebrate this union with us. Your presence is our greatest gift.",
  schedule: [
    { time: "4:00 PM", title: "Wedding Ceremony", detail: "Exchange of vows" },
    { time: "6:00 PM", title: "Cocktail Hour", detail: "Champagne & canapés" },
    { time: "8:00 PM", title: "Reception Dinner", detail: "Four-course dinner & speeches" },
    { time: "11:00 PM", title: "After Party", detail: "Dance the night away" },
  ],
  asoEbi: {
    colors: "Royal blue and gold aso-oke",
    price: "₦55,000 per set",
    bank: "UBA",
    holder: "Adaeze Nwosu",
    account: "2109876543",
  },
  gift: {
    note: "Your presence truly is our greatest joy. For those wishing to celebrate us with a gift, we are grateful.",
    bank: "Access Bank",
    holder: "Adaeze & Emeka Fund",
    account: "3456789012",
  },
  hotels: [
    {
      name: "Eko Hotels & Suites (On-site)",
      url: "https://ekohotels.com/",
      detail:
        "Plot 1415 Adetokunbo Ademola St, Victoria Island · 5-star · Stay right at the venue! Rooms from ₦95,000/night. Quote 'Adaeze & Emeka Wedding' for preferred rates.",
    },
    {
      name: "Nordic Hotel Lagos",
      url: "https://nordichotelsnigeria.com/nordic-hotel-lagos/",
      detail:
        "Plot 52A Kofo Abayomi Street, Victoria Island · 4-star · 5 min walk from Eko Hotels. Rooms from ₦65,000/night. Great harbour views.",
    },
    {
      name: "Lagos Continental Hotel",
      url: "https://lagoscontinentalhotel.com/",
      detail:
        "Plot 9A Ligali Ayorinde Street, Victoria Island · 4-star · 10 min drive. Rooms from ₦60,000/night. Business-friendly with a rooftop pool.",
    },
  ],
  faqs: [
    {
      q: "Is accommodation available at Eko Hotels?",
      a: "Yes. Rooms at the venue start from ₦95,000 a night. Quote 'Adaeze & Emeka Wedding' when you book.",
    },
    {
      q: "What time does the ceremony start?",
      a: "The wedding ceremony begins at 4:00 PM. Please arrive a little early so you are seated before the vows.",
    },
    {
      q: "Is there a dress code?",
      a: "We would love you in our colours: royal blue and gold aso-oke. Aso-ebi is ₦55,000 per set.",
    },
    {
      q: "Can I take a plus-one?",
      a: "Yes. Add the number of extra guests on the RSVP form so we can keep a place for them.",
    },
    {
      q: "Where can I park?",
      a: "Parking is available at Eko Hotels & Suites on Victoria Island. The hotel entrance is on Adetokunbo Ademola Street.",
    },
  ],
} as const;

export function saveTheDateIcs() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Adaeze and Emeka//Wedding//EN",
    "BEGIN:VEVENT",
    "DTSTART:20261017T150000Z",
    "DTEND:20261018T000000Z",
    "SUMMARY:Adaeze & Emeka Wedding",
    "LOCATION:Eko Hotels & Suites\\, Victoria Island\\, Lagos",
    "DESCRIPTION:Wedding ceremony from 4:00 PM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const file = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "adaeze-emeka-wedding.ics";
  link.click();
  URL.revokeObjectURL(url);
}
