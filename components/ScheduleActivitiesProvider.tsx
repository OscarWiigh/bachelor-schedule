"use client";

import {
  isActivity,
  normalizeActivity,
  sortActivities,
} from "@/lib/activities";
import type { Activity } from "@/lib/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ScheduleContextValue = {
  activities: Activity[];
  setActivities: (next: Activity[]) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const ScheduleContext = createContext<ScheduleContextValue | null>(null);

async function fetchActivitiesFromApi(tripSlug: string): Promise<Activity[]> {
  const res = await fetch(`/api/trips/${tripSlug}/activities`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Could not load schedule.");
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    return [];
  }
  const valid = data.filter(isActivity).map(normalizeActivity);
  return sortActivities(valid);
}

type Props = {
  children: ReactNode;
  tripSlug: string;
  initialActivities?: Activity[];
};

export function ScheduleActivitiesProvider({ children, tripSlug, initialActivities = [] }: Props) {
  const [activities, setActivitiesState] = useState<Activity[]>(initialActivities);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const list = await fetchActivitiesFromApi(tripSlug);
      setActivitiesState(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load schedule.");
      setActivitiesState([]);
    } finally {
      setIsLoading(false);
    }
  }, [tripSlug]);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const bcName = `trip-schedule-${tripSlug}`;
    const bc = new BroadcastChannel(bcName);
    bcRef.current = bc;
    bc.onmessage = (ev: MessageEvent) => {
      if (ev.data === "activities-updated") {
        void fetchActivitiesFromApi(tripSlug)
          .then(setActivitiesState)
          .catch(() => setError("Could not refresh schedule."));
      }
    };
    return () => {
      bc.close();
      bcRef.current = null;
    };
  }, [tripSlug]);

  const setActivities = useCallback(async (next: Activity[]) => {
    const sorted = sortActivities(next.map(normalizeActivity));
    const res = await fetch(`/api/trips/${tripSlug}/activities`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sorted),
    });
    if (!res.ok) {
      let msg = "Could not save schedule.";
      try {
        const j = (await res.json()) as { error?: string };
        if (typeof j.error === "string") msg = j.error;
      } catch {
        /* ignore */
      }
      throw new Error(msg);
    }
    setActivitiesState(sorted);
    try {
      bcRef.current?.postMessage("activities-updated");
    } catch {
      /* ignore */
    }
  }, [tripSlug]);

  const value: ScheduleContextValue = {
    activities,
    setActivities,
    isLoading,
    error,
    refetch: load,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useTripActivities(): ScheduleContextValue {
  const ctx = useContext(ScheduleContext);
  if (!ctx) {
    throw new Error(
      "useTripActivities must be used within ScheduleActivitiesProvider",
    );
  }
  return ctx;
}

// Backwards compat alias
export const useScheduleActivities = useTripActivities;
