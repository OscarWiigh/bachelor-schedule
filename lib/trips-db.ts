import { prisma } from "./prisma";
import type { Trip } from "./types";

function rowToTrip(row: {
  id: string; title: string; subtitle: string; timezone: string;
  startDate: Date; endDate: Date; goodToKnowMd: string | null; createdAt: Date;
}): Trip {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    timezone: row.timezone,
    startDate: row.startDate.toISOString(),
    endDate: row.endDate.toISOString(),
    goodToKnowMd: row.goodToKnowMd,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getAllTrips(): Promise<Trip[]> {
  const rows = await prisma.trip.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(rowToTrip);
}

export async function getTrip(slug: string): Promise<Trip | null> {
  const row = await prisma.trip.findUnique({ where: { id: slug } });
  return row ? rowToTrip(row) : null;
}

export async function createTrip(data: Omit<Trip, "createdAt">): Promise<Trip> {
  const row = await prisma.trip.create({
    data: {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      timezone: data.timezone,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      goodToKnowMd: data.goodToKnowMd ?? null,
    },
  });
  return rowToTrip(row);
}

export async function updateTrip(slug: string, data: Partial<Omit<Trip, "id" | "createdAt">>): Promise<Trip> {
  const row = await prisma.trip.update({
    where: { id: slug },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
      ...(data.timezone !== undefined && { timezone: data.timezone }),
      ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
      ...(data.endDate !== undefined && { endDate: new Date(data.endDate) }),
      ...(data.goodToKnowMd !== undefined && { goodToKnowMd: data.goodToKnowMd }),
    },
  });
  return rowToTrip(row);
}
