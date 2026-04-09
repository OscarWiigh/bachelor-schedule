import type { Activity } from "@/lib/types";
import {
  getWeekendBounds,
  getWeekendDays,
  isNowInWeekend,
  pragueCalendarDayKey,
} from "@/lib/prague-time";

export type TimelineRow =
  | { kind: "header"; key: string; label: string }
  | { kind: "now" }
  | { kind: "activity"; activity: Activity };

function getNowInsertionIndex(sorted: Activity[], now: Date): number {
  const { start, end } = getWeekendBounds();
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
  now: Date,
): TimelineRow[] {
  const sorted = [...activities].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  const showNow = isNowInWeekend(now);
  const insertIdx = showNow ? getNowInsertionIndex(sorted, now) : -1;

  const rows: TimelineRow[] = [];
  let globalIdx = 0;

  for (const { key, label } of getWeekendDays()) {
    rows.push({ kind: "header", key, label });
    const dayActs = sorted.filter(
      (a) => pragueCalendarDayKey(new Date(a.start)) === key,
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
