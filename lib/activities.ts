import { CATEGORY_IDS, type CategoryId } from "@/lib/categories";
import type { Activity } from "@/lib/types";

export function isCategoryId(x: unknown): x is CategoryId {
  return typeof x === "string" && (CATEGORY_IDS as readonly string[]).includes(x);
}

export function isActivity(x: unknown): x is Activity {
  if (x === null || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (
    typeof o.id !== "string" ||
    typeof o.title !== "string" ||
    typeof o.start !== "string" ||
    typeof o.end !== "string" ||
    !isCategoryId(o.category) ||
    typeof o.bookedBy !== "string" ||
    Number.isNaN(Date.parse(o.start)) ||
    Number.isNaN(Date.parse(o.end))
  ) {
    return false;
  }
  if (o.mapUrl !== undefined && o.mapUrl !== null) {
    if (typeof o.mapUrl !== "string") return false;
    const u = o.mapUrl.trim();
    if (u.length > 0 && !/^https?:\/\//i.test(u)) return false;
  }
  return true;
}

export function normalizeActivity(a: Activity): Activity {
  const mapUrl = a.mapUrl?.trim();
  return {
    ...a,
    mapUrl: mapUrl && mapUrl.length > 0 ? mapUrl : undefined,
  };
}

export function sortActivities(list: Activity[]): Activity[] {
  return [...list].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
}

export function newActivityId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function parseActivitiesPutBody(
  body: unknown,
): { ok: true; data: Activity[] } | { ok: false; error: string } {
  if (!Array.isArray(body)) {
    return { ok: false, error: "Body must be a JSON array of activities." };
  }
  const out: Activity[] = [];
  for (let i = 0; i < body.length; i++) {
    const item = body[i];
    if (!isActivity(item)) {
      return { ok: false, error: `Invalid activity at index ${i}.` };
    }
    out.push(normalizeActivity(item));
  }
  return { ok: true, data: sortActivities(out) };
}
