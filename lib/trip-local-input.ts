function makeDateTimeParts(timezone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function partsToMap(d: Date, formatter: Intl.DateTimeFormat): Map<string, string> {
  const m = new Map<string, string>();
  for (const p of formatter.formatToParts(d)) {
    if (p.type !== "literal") m.set(p.type, p.value);
  }
  return m;
}

/** Trip local wall clock as yyyy-mm-dd and HH:mm (24h) from a UTC instant */
export function utcIsoToTripDateTime(iso: string, timezone: string): { date: string; time: string } {
  const formatter = makeDateTimeParts(timezone);
  const d = new Date(iso);
  const m = partsToMap(d, formatter);
  const y = m.get("year")!;
  const mo = m.get("month")!;
  const day = m.get("day")!;
  let h = m.get("hour")!;
  let min = m.get("minute")!;
  if (h.length === 1) h = `0${h}`;
  if (min.length === 1) min = `0${min}`;
  return { date: `${y}-${mo}-${day}`, time: `${h}:${min}` };
}

/**
 * Interpret yyyy-mm-dd and HH:mm as trip local civil time → UTC ISO string.
 * Steps by minute around the target calendar day (handles DST).
 */
export function tripDateTimeToUtcIso(dateStr: string, timeStr: string, timezone: string): string {
  const formatter = makeDateTimeParts(timezone);
  const [Y, M, D] = dateStr.split("-").map(Number);
  const [hRaw, mRaw] = timeStr.split(":");
  const h = Number(hRaw);
  const min = Number(mRaw);
  if (
    !Number.isFinite(Y) ||
    !Number.isFinite(M) ||
    !Number.isFinite(D) ||
    !Number.isFinite(h) ||
    !Number.isFinite(min)
  ) {
    throw new Error("Invalid date or time");
  }

  const start = Date.UTC(Y, M - 1, D - 1, 0, 0, 0);
  const end = Date.UTC(Y, M - 1, D + 2, 23, 59, 59);

  for (let t = start; t <= end; t += 60_000) {
    const d = new Date(t);
    const m = partsToMap(d, formatter);
    const py = Number(m.get("year"));
    const pm = Number(m.get("month"));
    const pd = Number(m.get("day"));
    let ph = Number(m.get("hour"));
    let pmin = Number(m.get("minute"));
    if (Number.isNaN(ph)) ph = 0;
    if (Number.isNaN(pmin)) pmin = 0;
    if (py === Y && pm === M && pd === D && ph === h && pmin === min) {
      return d.toISOString();
    }
  }

  throw new Error("Could not map trip local time (invalid or ambiguous)");
}
