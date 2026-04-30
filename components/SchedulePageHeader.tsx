import type { Trip } from "@/lib/types";
import { formatTripDate } from "@/lib/trip-time";
import Link from "next/link";
import { MarkdownContent } from "@/components/MarkdownContent";

type Props = { trip: Trip };

export function SchedulePageHeader({ trip }: Props) {
  const dateRange = `${formatTripDate(trip.startDate, trip.timezone)} – ${formatTripDate(trip.endDate, trip.timezone)}`;

  return (
    <header className="shrink-0 border-b border-zinc-800/80 bg-zinc-950/90 px-4 pb-4 pt-4 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500/90">
            {dateRange}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-50">
            {trip.title}
          </h1>
          {trip.subtitle ? (
            <p className="mt-1 text-sm text-zinc-400">{trip.subtitle}</p>
          ) : null}
        </div>
        <Link
          href={`/${trip.id}/edit`}
          className="shrink-0 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-200 transition hover:border-orange-500/50 hover:text-orange-200"
        >
          Edit
        </Link>
      </div>

      {trip.goodToKnowMd ? (
        <aside
          className="mt-3 w-full rounded-2xl border border-sky-400/45 bg-sky-500/[0.16] px-3.5 py-3.5 shadow-sm ring-1 ring-inset ring-sky-300/20"
          aria-label="Good to know"
        >
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-sky-100">
            Good to know
          </p>
          <div className="mt-3 prose prose-invert prose-sm max-w-none prose-a:text-white prose-a:underline prose-a:decoration-sky-200/50 prose-a:decoration-2 prose-a:underline-offset-2 prose-strong:text-sky-200/90 prose-p:text-zinc-100">
            <MarkdownContent md={trip.goodToKnowMd} />
          </div>
        </aside>
      ) : null}
    </header>
  );
}
