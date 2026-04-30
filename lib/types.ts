export type CategoryId = "food" | "drinks" | "transport" | "activity" | "lodging" | "free";

export type Activity = {
  id: string;
  tripId: string;
  title: string;
  start: string;   // ISO 8601 UTC
  end: string;     // ISO 8601 UTC
  category: CategoryId;
  bookedBy: string;
  mapUrl?: string;
};

export type Trip = {
  id: string;        // slug
  title: string;
  subtitle: string;
  timezone: string;  // IANA tz, e.g. "Europe/Prague"
  startDate: string; // ISO 8601 UTC
  endDate: string;   // ISO 8601 UTC
  goodToKnowMd?: string | null;
  createdAt: string;
};

export type TimelineRow =
  | { kind: "header"; key: string; label: string }
  | { kind: "now" }
  | { kind: "activity"; activity: Activity };
