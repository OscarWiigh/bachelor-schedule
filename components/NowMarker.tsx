"use client";

import { forwardRef } from "react";

export const NowMarker = forwardRef<HTMLDivElement>(function NowMarker(_, ref) {
  return (
    <div
      ref={ref}
      className="scroll-mt-32 py-2"
      role="status"
      aria-live="polite"
      aria-label="Current time in Prague"
    >
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500 to-orange-500/80" />
        <span className="shrink-0 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-950">
          Now
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-orange-500 to-orange-500/80" />
      </div>
    </div>
  );
});
