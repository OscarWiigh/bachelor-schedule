import { NextResponse } from "next/server";
import { getAllTrips, createTrip } from "@/lib/trips-db";
import type { Trip } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const trips = await getAllTrips();
  return NextResponse.json(trips);
}

export async function POST(req: Request) {
  const body = await req.json() as Omit<Trip, "createdAt">;
  if (!body.id || !body.title || !body.timezone || !body.startDate || !body.endDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const trip = await createTrip(body);
  return NextResponse.json(trip, { status: 201 });
}
