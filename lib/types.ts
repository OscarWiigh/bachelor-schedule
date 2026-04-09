import type { CategoryId } from "./categories";

export type Activity = {
  id: string;
  title: string;
  /** ISO 8601 instant (UTC recommended) */
  start: string;
  end: string;
  category: CategoryId;
  bookedBy: string;
  /** Optional https URL — tapping the card opens it in a new tab */
  mapUrl?: string;
};
