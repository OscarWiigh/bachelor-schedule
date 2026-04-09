export const CATEGORY_IDS = [
  "food",
  "drinks",
  "transport",
  "activity",
  "lodging",
  "free",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type CategoryDef = {
  label: string;
  emoji: string;
  /** Accent for category chip */
  chipClass: string;
  /** Left border + subtle tint on card */
  cardAccentClass: string;
};

export const CATEGORIES: Record<CategoryId, CategoryDef> = {
  food: {
    label: "Food",
    emoji: "🍽️",
    chipClass:
      "border-orange-400/40 bg-orange-500/15 text-orange-200 ring-orange-400/20",
    cardAccentClass: "border-l-orange-400 bg-orange-500/[0.06]",
  },
  drinks: {
    label: "Drinks",
    emoji: "🍺",
    chipClass:
      "border-amber-400/40 bg-amber-500/15 text-amber-100 ring-amber-400/20",
    cardAccentClass: "border-l-amber-400 bg-amber-500/[0.06]",
  },
  transport: {
    label: "Transport",
    emoji: "🚃",
    chipClass:
      "border-zinc-500/50 bg-zinc-700/40 text-zinc-200 ring-zinc-500/20",
    cardAccentClass: "border-l-zinc-500 bg-zinc-800/50",
  },
  activity: {
    label: "Activity",
    emoji: "🎯",
    chipClass:
      "border-orange-500/50 bg-orange-600/20 text-orange-100 ring-orange-500/25",
    cardAccentClass: "border-l-orange-500 bg-orange-600/10",
  },
  lodging: {
    label: "Lodging",
    emoji: "🏨",
    chipClass:
      "border-stone-500/45 bg-stone-600/25 text-stone-100 ring-stone-500/20",
    cardAccentClass: "border-l-stone-500 bg-stone-800/40",
  },
  free: {
    label: "Free time",
    emoji: "☕",
    chipClass:
      "border-neutral-500/40 bg-neutral-700/30 text-neutral-200 ring-neutral-500/15",
    cardAccentClass: "border-l-neutral-500 bg-neutral-800/35",
  },
};
