import { NextResponse } from "next/server";
import { getActivities, replaceActivities } from "@/lib/activities-db";
import { normalizeActivities } from "@/lib/activities";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activities = await getActivities(slug);
  return NextResponse.json(activities);
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await req.json();
  try {
    const activities = normalizeActivities(body);
    const saved = await replaceActivities(slug, activities);
    return NextResponse.json(saved);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid activities." },
      { status: 400 },
    );
  }
}
