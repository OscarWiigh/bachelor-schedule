import { CATEGORIES } from "@/lib/categories";
import { hasBookedByForDisplay } from "@/lib/booked-by-display";
import { formatPragueRange } from "@/lib/prague-time";
import type { Activity } from "@/lib/types";

type Props = { activity: Activity };

export function ActivityCard({ activity }: Props) {
  const start = new Date(activity.start);
  const end = new Date(activity.end);
  const cat = CATEGORIES[activity.category];
  const mapUrl = activity.mapUrl?.trim();

  const shellClass = `rounded-2xl border border-zinc-800/80 border-l-4 bg-zinc-900/60 p-4 shadow-sm backdrop-blur-sm outline-none ring-offset-2 ring-offset-zinc-950 transition hover:brightness-[1.03] ${cat.cardAccentClass} ${cat.hoverRingClass} ${
    mapUrl ? "cursor-pointer active:scale-[0.995]" : ""
  }`;

  const body = (
    <>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-medium tabular-nums text-orange-200/90">
          {formatPragueRange(start, end)}
        </p>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ring-1 ${cat.chipClass}`}
        >
          <span aria-hidden>{cat.emoji}</span>
          {cat.label}
        </span>
      </div>
      <h3 className="mt-2 text-base font-semibold tracking-tight text-zinc-50">
        {activity.title}
      </h3>
      {hasBookedByForDisplay(activity.bookedBy) ? (
        <p className="mt-2 text-sm text-zinc-400">
          Booked by{" "}
          <span className="font-medium text-zinc-300">
            {activity.bookedBy.trim()}
          </span>
        </p>
      ) : null}
    </>
  );

  if (mapUrl) {
    return (
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${shellClass} block text-left no-underline`}
        aria-label={`Open link: ${activity.title}`}
      >
        {body}
      </a>
    );
  }

  return <article className={shellClass}>{body}</article>;
}
