import { prisma } from "./prisma";
import type { Activity } from "./types";

function rowToActivity(row: {
  id: string; tripId: string; title: string; startAt: Date; endAt: Date;
  category: string; bookedBy: string; mapUrl: string | null;
}): Activity {
  return {
    id: row.id,
    tripId: row.tripId,
    title: row.title,
    start: row.startAt.toISOString(),
    end: row.endAt.toISOString(),
    category: row.category as Activity["category"],
    bookedBy: row.bookedBy,
    mapUrl: row.mapUrl ?? undefined,
  };
}

export async function getActivities(tripId: string): Promise<Activity[]> {
  const rows = await prisma.activity.findMany({
    where: { tripId },
    orderBy: { startAt: "asc" },
  });
  return rows.map(rowToActivity);
}

export async function replaceActivities(tripId: string, activities: Activity[]): Promise<Activity[]> {
  await prisma.$transaction([
    prisma.activity.deleteMany({ where: { tripId } }),
    prisma.activity.createMany({
      data: activities.map((a) => ({
        id: a.id,
        tripId,
        title: a.title,
        startAt: new Date(a.start),
        endAt: new Date(a.end),
        category: a.category,
        bookedBy: a.bookedBy,
        mapUrl: a.mapUrl ?? null,
      })),
    }),
  ]);
  return getActivities(tripId);
}
