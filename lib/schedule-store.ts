import { isActivity, normalizeActivity, sortActivities } from "@/lib/activities";
import { getRedis } from "@/lib/redis";
import type { Activity } from "@/lib/types";

const SCHEDULE_KEY = "bachelor-schedule:activities";

function parseStoredActivities(raw: unknown): Activity[] {
  if (!Array.isArray(raw)) {
    throw new Error("Stored schedule is not a JSON array.");
  }
  const out: Activity[] = [];
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    if (!isActivity(item)) {
      throw new Error(`Invalid stored activity at index ${i}.`);
    }
    out.push(normalizeActivity(item));
  }
  return sortActivities(out);
}

export async function readActivities(): Promise<Activity[]> {
  const blob = await getRedis().get(SCHEDULE_KEY);
  if (blob == null) {
    return [];
  }
  let parsed: unknown;
  try {
    parsed = typeof blob === "string" ? JSON.parse(blob) : blob;
  } catch {
    throw new Error("Stored schedule is not valid JSON.");
  }
  return parseStoredActivities(parsed);
}

export async function writeActivities(activities: Activity[]): Promise<void> {
  const sorted = sortActivities(activities);
  await getRedis().set(SCHEDULE_KEY, JSON.stringify(sorted));
}
