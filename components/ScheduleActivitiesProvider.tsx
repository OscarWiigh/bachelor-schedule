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

const BC_NAME = "bachelor-schedule";

type ScheduleContextValue = {
  activities: Activity[];
  setActivities: (next: Activity[]) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const ScheduleContext = createContext<ScheduleContextValue | null>(null);

async function fetchActivitiesFromApi(): Promise<Activity[]> {
  const res = await fetch("/api/activities", { cache: "no-store" });
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

export function ScheduleActivitiesProvider({ children }: { children: ReactNode }) {
  const [activities, setActivitiesState] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const list = await fetchActivitiesFromApi();
      setActivitiesState(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load schedule.");
      setActivitiesState([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const bc = new BroadcastChannel(BC_NAME);
    bcRef.current = bc;
    bc.onmessage = (ev: MessageEvent) => {
      if (ev.data === "activities-updated") {
        void fetchActivitiesFromApi()
          .then(setActivitiesState)
          .catch(() => setError("Could not refresh schedule."));
      }
    };
    return () => {
      bc.close();
      bcRef.current = null;
    };
  }, []);

  const setActivities = useCallback(async (next: Activity[]) => {
    const sorted = sortActivities(next.map(normalizeActivity));
    const res = await fetch("/api/activities", {
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
  }, []);

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

export function useScheduleActivities(): ScheduleContextValue {
  const ctx = useContext(ScheduleContext);
  if (!ctx) {
    throw new Error(
      "useScheduleActivities must be used within ScheduleActivitiesProvider",
    );
  }
  return ctx;
}
