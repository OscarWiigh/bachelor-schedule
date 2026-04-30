import { getTrip } from "@/lib/trips-db";
import { getActivities } from "@/lib/activities-db";
import { ScheduleActivitiesProvider } from "@/components/ScheduleActivitiesProvider";
import { ScheduleEditor } from "@/components/ScheduleEditor";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTrip(slug);
  if (!trip) return { title: "Not found" };
  return {
    title: `Edit — ${trip.title} — Trip Schedule`,
    description: `Edit the schedule for ${trip.title}`,
  };
}

export default async function EditPage({ params }: Props) {
  const { slug } = await params;
  const trip = await getTrip(slug);
  if (!trip) notFound();

  const initialActivities = await getActivities(slug);

  return (
    <ScheduleActivitiesProvider tripSlug={slug} initialActivities={initialActivities}>
      <ScheduleEditor trip={trip} />
    </ScheduleActivitiesProvider>
  );
}
