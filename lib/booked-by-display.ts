const PLACEHOLDERS = new Set(["—", "–", "-", "n/a", "na"]);

/** Whether to show a "Booked by" row (non-empty, not a common placeholder). */
export function hasBookedByForDisplay(value: string): boolean {
  const t = value.trim();
  if (!t) return false;
  if (PLACEHOLDERS.has(t.toLowerCase())) return false;
  return true;
}
