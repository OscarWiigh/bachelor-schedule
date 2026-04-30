import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const AIRBNB_MAPS_URL = "https://maps.app.goo.gl/zg3LYj7ovFvvzvXL7";

function mapsSearch(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const ACTIVITIES = [
  {
    id: "fri-flight",
    title: "Flight",
    start: "2026-04-10T07:40:00.000Z",
    end: "2026-04-10T09:30:00.000Z",
    category: "transport",
    bookedBy: "Oscar",
    mapUrl: mapsSearch("Václav Havel Airport Prague PRG"),
  },
  {
    id: "fri-bags",
    title: "Leave bag",
    start: "2026-04-10T10:00:00.000Z",
    end: "2026-04-10T11:00:00.000Z",
    category: "lodging",
    bookedBy: "",
    mapUrl: AIRBNB_MAPS_URL,
  },
  {
    id: "fri-fleku",
    title: "Dinner at U Fleků",
    start: "2026-04-10T11:30:00.000Z",
    end: "2026-04-10T13:30:00.000Z",
    category: "food",
    bookedBy: "Filip",
    mapUrl: mapsSearch("U Fleků Prague"),
  },
  {
    id: "fri-hemingway",
    title: "Drinks at Hemingway Bar",
    start: "2026-04-10T16:00:00.000Z",
    end: "2026-04-10T17:00:00.000Z",
    category: "drinks",
    bookedBy: "Filip",
    mapUrl: mapsSearch("Hemingway Bar Prague"),
  },
  {
    id: "fri-kotrba",
    title: "Dinner at U Mateje Kotrby",
    start: "2026-04-10T17:00:00.000Z",
    end: "2026-04-10T19:30:00.000Z",
    category: "food",
    bookedBy: "Oscar",
    mapUrl: mapsSearch("U Mateje Kotrby Prague"),
  },
  {
    id: "fri-chill",
    title: "Chill bar vibes",
    start: "2026-04-10T19:30:00.000Z",
    end: "2026-04-11T00:00:00.000Z",
    category: "drinks",
    bookedBy: "",
  },
];

async function main() {
  // Upsert the bachelor trip
  await prisma.trip.upsert({
    where: { id: "bachelor" },
    update: {},
    create: {
      id: "bachelor",
      title: "Bachelor Schedule",
      subtitle: "Prague weekend",
      timezone: "Europe/Prague",
      startDate: new Date("2026-04-09T22:00:00.000Z"),
      endDate: new Date("2026-04-12T21:59:59.999Z"),
      goodToKnowMd: "**Oscar** – [+46 70 147 66 88](tel:+46701476688)\n\n**Filip** – [+46 70 748 45 83](tel:+46707484583)\n\n**Main door code:** 9517#",
    },
  });

  // Replace all activities for the bachelor trip
  await prisma.activity.deleteMany({ where: { tripId: "bachelor" } });
  await prisma.activity.createMany({
    data: ACTIVITIES.map((a) => ({
      id: a.id,
      tripId: "bachelor",
      title: a.title,
      startAt: new Date(a.start),
      endAt: new Date(a.end),
      category: a.category,
      bookedBy: a.bookedBy,
      mapUrl: a.mapUrl ?? null,
    })),
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    void prisma.$disconnect();
    process.exit(1);
  });
