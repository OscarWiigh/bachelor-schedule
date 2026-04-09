import type { Activity } from "@/lib/types";
import { AIRBNB_MAPS_URL } from "@/lib/config";

function mapsSearch(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Friday–Sunday — Europe/Prague, 10–12 Apr 2026 (CEST = UTC+2). Stored as UTC ISO.
 */
export const ACTIVITIES = [
  {
    id: "fri-flight",
    title: "Flight",
    start: "2026-04-10T07:40:00.000Z", // Fri 09:40 Prague
    end: "2026-04-10T09:30:00.000Z", // 11:30 Prague
    category: "transport",
    bookedBy: "Oscar",
    mapUrl: mapsSearch("Václav Havel Airport Prague PRG"),
  },
  {
    id: "fri-bags",
    title: "Leave bag",
    start: "2026-04-10T10:00:00.000Z", // 12:00
    end: "2026-04-10T11:00:00.000Z", // 13:00
    category: "lodging",
    bookedBy: "",
    mapUrl: AIRBNB_MAPS_URL,
  },
  {
    id: "fri-fleku",
    title: "Dinner at U Fleků",
    start: "2026-04-10T11:30:00.000Z", // 13:30
    end: "2026-04-10T13:30:00.000Z", // 15:30
    category: "food",
    bookedBy: "Filip",
    mapUrl: mapsSearch("U Fleků Prague"),
  },
  {
    id: "fri-hemingway",
    title: "Drinks at Hemingway Bar",
    start: "2026-04-10T16:00:00.000Z", // 18:00
    end: "2026-04-10T17:00:00.000Z", // 19:00
    category: "drinks",
    bookedBy: "Filip",
    mapUrl: mapsSearch("Hemingway Bar Prague"),
  },
  {
    id: "fri-kotrba",
    title: "Dinner at U Mateje Kotrby",
    start: "2026-04-10T17:00:00.000Z", // 19:00
    end: "2026-04-10T19:30:00.000Z", // 21:30
    category: "food",
    bookedBy: "Oscar",
    mapUrl: mapsSearch("U Mateje Kotrby Prague"),
  },
  {
    id: "fri-chill",
    title: "Chill bar vibes",
    start: "2026-04-10T19:30:00.000Z", // 21:30
    end: "2026-04-11T00:00:00.000Z", // 02:00 Sat Prague
    category: "drinks",
    bookedBy: "",
  },
].sort(
  (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
) as Activity[];
