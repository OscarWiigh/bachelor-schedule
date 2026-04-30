export function toTripLocal(isoUtc: string, timezone: string): Date {
  // Returns a Date whose UTC fields equal the local time in `timezone`
  const utc = new Date(isoUtc);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(utc);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return new Date(
    `${get("year")}-${get("month")}-${get("day")}T${get("hour") === "24" ? "00" : get("hour")}:${get("minute")}:${get("second")}`
  );
}

export function formatTripTime(isoUtc: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(isoUtc));
}

export function formatTripDate(isoUtc: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(isoUtc));
}

export function nowInTripTz(timezone: string): Date {
  return toTripLocal(new Date().toISOString(), timezone);
}
