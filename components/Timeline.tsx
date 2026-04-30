"use client";

import { useTripActivities } from "@/components/ScheduleActivitiesProvider";
import { buildTimelineRows } from "@/lib/timeline-rows";
import type { Trip } from "@/lib/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityCard } from "./ActivityCard";
import { NowMarker } from "./NowMarker";
import Link from "next/link";

type Props = { trip: Trip };

export function Timeline({ trip }: Props) {
  const { activities, isLoading, error, refetch } = useTripActivities();
  const scrollRef = useRef<HTMLDivElement>(null);
  const nowRef = useRef<HTMLDivElement>(null);
  const topAnchorRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(() => new Date());
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const rows = useMemo(
    () => buildTimelineRows(activities, trip.timezone, trip.startDate, trip.endDate, now),
    [activities, trip.timezone, trip.startDate, trip.endDate, now],
  );

  const scrollToNow = useCallback(() => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    requestAnimationFrame(() => {
      if (now < start) {
        topAnchorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }
      if (now > end) {
        bottomAnchorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
        return;
      }
      nowRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }, [now, trip.startDate, trip.endDate]);

  useEffect(() => {
    if (isLoading || activities.length === 0) return;
    if (hasScrolledRef.current) return;
    hasScrolledRef.current = true;
    const t = window.setTimeout(scrollToNow, 150);
    return () => window.clearTimeout(t);
  }, [isLoading, activities.length, scrollToNow]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2"
      >
        <div ref={topAnchorRef} className="h-px w-full shrink-0" aria-hidden />
        {isLoading ? (
          <p className="py-8 text-center text-sm text-zinc-500">Loading schedule…</p>
        ) : null}
        {!isLoading && error && activities.length === 0 ? (
          <div className="mb-4 rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-3 text-sm text-red-200">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-2 text-xs font-semibold text-orange-400 underline underline-offset-2 hover:text-orange-300"
            >
              Try again
            </button>
          </div>
        ) : null}
        {!isLoading && !error && activities.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            No events yet. Use{" "}
            <Link
              href={`/${trip.id}/edit`}
              className="font-medium text-orange-400 underline underline-offset-2"
            >
              Edit
            </Link>{" "}
            to add some.
          </p>
        ) : null}
        {!isLoading && activities.length > 0
          ? rows.map((row) => {
          if (row.kind === "header") {
            return (
              <header
                key={`h-${row.key}`}
                className="sticky top-0 z-10 -mx-4 border-b border-orange-500/25 bg-zinc-950/95 px-4 py-4 backdrop-blur-md"
              >
                <h2 className="text-xl font-bold uppercase tracking-[0.12em] text-orange-400">
                  {row.label}
                </h2>
              </header>
            );
          }
          if (row.kind === "now") {
            return <NowMarker key="timeline-now" ref={nowRef} />;
          }
          return (
            <div key={row.activity.id} className="py-2">
              <ActivityCard activity={row.activity} timezone={trip.timezone} />
            </div>
          );
        })
          : null}
        <div
          ref={bottomAnchorRef}
          className="h-px w-full shrink-0"
          aria-hidden
        />
      </div>
    </div>
  );
}
