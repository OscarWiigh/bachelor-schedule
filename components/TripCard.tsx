import type { Trip } from "@/lib/types";
import { formatTripDate } from "@/lib/trip-time";
import Link from "next/link";

type Props = { trip: Trip };

export function TripCard({ trip }: Props) {
  const startFormatted = formatTripDate(trip.startDate, trip.timezone);
  const endFormatted = formatTripDate(trip.endDate, trip.timezone);

  return (
    <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/80">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/${trip.id}`}
            className="block font-semibold text-zinc-50 hover:text-orange-200 transition"
          >
            {trip.title}
          </Link>
          {trip.subtitle ? (
            <p className="mt-0.5 text-sm text-zinc-400">{trip.subtitle}</p>
          ) : null}
          <p className="mt-2 text-xs text-zinc-500 tabular-nums">
            {startFormatted} – {endFormatted}
          </p>
          <p className="mt-1 text-[11px] text-zinc-600">{trip.timezone}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-1.5 items-end">
          <Link
            href={`/${trip.id}`}
            className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200 transition hover:border-orange-500/50 hover:text-orange-200"
          >
            View
          </Link>
          <Link
            href={`/${trip.id}/edit`}
            className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
