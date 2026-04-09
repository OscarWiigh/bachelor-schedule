import { parseActivitiesPutBody } from "@/lib/activities";
import { readActivities, writeActivities } from "@/lib/schedule-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const list = await readActivities();
    return NextResponse.json(list);
  } catch (e) {
    console.error("[GET /api/activities]", e);
    return NextResponse.json(
      { error: "Could not load activities from the store." },
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
    await writeActivities(data);
    return NextResponse.json(data);
  } catch (e) {
    console.error("[PUT /api/activities]", e);
    return NextResponse.json(
      { error: "Could not save activities to the store." },
      { status: 500 },
    );
  }
}
