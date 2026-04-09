import { PRAGUE_TZ, WEEKEND_END_ISO, WEEKEND_START_ISO } from "./config";

const pragueFormatter = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: PRAGUE_TZ, ...options });

export function formatPragueRange(start: Date, end: Date): string {
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const t = pragueFormatter(timeOpts);
  return `${t.format(start)}–${t.format(end)}`;
}

export function formatPragueDayHeader(date: Date): string {
  return pragueFormatter({
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(date);
}

/** Stable YYYY-MM-DD in Prague for grouping */
export function pragueCalendarDayKey(instant: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PRAGUE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);

  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

export function getWeekendBounds(): { start: Date; end: Date } {
  return {
    start: new Date(WEEKEND_START_ISO),
    end: new Date(WEEKEND_END_ISO),
  };
}

export function isNowInWeekend(now: Date): boolean {
  const { start, end } = getWeekendBounds();
  return now >= start && now <= end;
}

/** Fri → Sun Prague calendar days with sticky header labels */
export function getWeekendDays(): { key: string; label: string }[] {
  const { start, end } = getWeekendBounds();
  const firstInstantByKey = new Map<string, Date>();
  const cursor = new Date(start.getTime());
  while (cursor <= end) {
    const key = pragueCalendarDayKey(cursor);
    if (!firstInstantByKey.has(key)) {
      firstInstantByKey.set(key, new Date(cursor));
    }
    cursor.setTime(cursor.getTime() + 60 * 60 * 1000);
  }
  return Array.from(firstInstantByKey.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, instant]) => ({
      key,
      label: formatPragueDayHeader(instant),
    }));
}
