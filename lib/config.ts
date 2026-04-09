/**
 * Bachelor weekend in Europe/Prague — Fri Apr 11 → Sun Apr 13, 2026.
 * Boundaries are UTC instants (CEST = UTC+2). If you change dates or DST
 * differs, adjust these two strings (use a TZ converter for Prague local midnight).
 */
export const WEEKEND_START_ISO = "2026-04-10T22:00:00.000Z"; // Fri 00:00 Prague
export const WEEKEND_END_ISO = "2026-04-13T21:59:59.999Z"; // Sun 23:59:59.999 Prague

/** IANA timezone for all display and “now” logic */
export const PRAGUE_TZ = "Europe/Prague";

/** Shared AirBnB location (header + optional activity links) */
export const AIRBNB_MAPS_URL =
  "https://maps.app.goo.gl/zg3LYj7ovFvvzvXL7";
