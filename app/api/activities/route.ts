import {
  isCategoryId,
  normalizeActivity,
  parseActivitiesPutBody,
} from "@/lib/activities";
import { prisma } from "@/lib/prisma";
import type { Activity } from "@/lib/types";
import { NextResponse } from "next/server";
import type { Activity as DbActivity } from "@prisma/client";

export const runtime = "nodejs";

function prismaRowToActivity(row: DbActivity): Activity {
  if (!isCategoryId(row.category)) {
    throw new Error(`Unknown category in DB: ${row.category}`);
  }
  const a: Activity = {
    id: row.id,
    title: row.title,
    start: row.startAt.toISOString(),
    end: row.endAt.toISOString(),
    category: row.category,
    bookedBy: row.bookedBy,
  };
  if (row.mapUrl) a.mapUrl = row.mapUrl;
  return normalizeActivity(a);
}

function activityToPrismaCreateInput(a: Activity) {
  const n = normalizeActivity(a);
  return {
    id: n.id,
    title: n.title,
    startAt: new Date(n.start),
    endAt: new Date(n.end),
    category: n.category,
    bookedBy: n.bookedBy,
    mapUrl: n.mapUrl ?? null,
  };
}

export async function GET() {
  try {
    const rows = await prisma.activity.findMany({
      orderBy: { startAt: "asc" },
    });
    return NextResponse.json(rows.map(prismaRowToActivity));
  } catch (e) {
    console.error("[GET /api/activities]", e);
    return NextResponse.json(
      { error: "Could not load activities from the database." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseActivitiesPutBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const data = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.activity.deleteMany();
      if (data.length > 0) {
        await tx.activity.createMany({
          data: data.map((a) => activityToPrismaCreateInput(a)),
        });
      }
    });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[PUT /api/activities]", e);
    return NextResponse.json(
      { error: "Could not save activities to the database." },
      { status: 500 },
    );
  }
}
