import type { Activity, TimelineRow } from "@/lib/types";

function calendarDayKey(instant: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);

  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

function formatDayHeader(instant: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(instant);
}

function getTripDays(
  timezone: string,
  tripStart: string,
  tripEnd: string,
): { key: string; label: string }[] {
  const start = new Date(tripStart);
  const end = new Date(tripEnd);
  const firstInstantByKey = new Map<string, Date>();
  const cursor = new Date(start.getTime());
  while (cursor <= end) {
    const key = calendarDayKey(cursor, timezone);
    if (!firstInstantByKey.has(key)) {
      firstInstantByKey.set(key, new Date(cursor));
    }
    cursor.setTime(cursor.getTime() + 60 * 60 * 1000);
  }
  return Array.from(firstInstantByKey.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, instant]) => ({
      key,
      label: formatDayHeader(instant, timezone),
    }));
}

function getNowInsertionIndex(
  sorted: Activity[],
  now: Date,
  tripStart: string,
  tripEnd: string,
): number {
  const start = new Date(tripStart);
  const end = new Date(tripEnd);
  if (now < start || now > end) return -1;

  for (let i = 0; i < sorted.length; i++) {
    const s = new Date(sorted[i].start).getTime();
    const e = new Date(sorted[i].end).getTime();
    const t = now.getTime();
    if (t < s) return i;
    if (t >= s && t < e) return i;
  }
  return sorted.length;
}

export function buildTimelineRows(
  activities: Activity[],
  timezone: string,
  tripStart: string,
  tripEnd: string,
  now: Date,
): TimelineRow[] {
  const sorted = [...activities].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  const start = new Date(tripStart);
  const end = new Date(tripEnd);
  const showNow = now >= start && now <= end;
  const insertIdx = showNow ? getNowInsertionIndex(sorted, now, tripStart, tripEnd) : -1;

  const rows: TimelineRow[] = [];
  let globalIdx = 0;

  for (const { key, label } of getTripDays(timezone, tripStart, tripEnd)) {
    rows.push({ kind: "header", key, label });
    const dayActs = sorted.filter(
      (a) => calendarDayKey(new Date(a.start), timezone) === key,
    );
    for (const act of dayActs) {
      if (insertIdx === globalIdx) {
        rows.push({ kind: "now" });
      }
      rows.push({ kind: "activity", activity: act });
      globalIdx++;
    }
  }

  if (showNow && insertIdx === sorted.length) {
    rows.push({ kind: "now" });
  }

  return rows;
}
