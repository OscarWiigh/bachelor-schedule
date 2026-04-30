import { getTrip } from "@/lib/trips-db";
import { getActivities } from "@/lib/activities-db";
import { ScheduleActivitiesProvider } from "@/components/ScheduleActivitiesProvider";
import { SchedulePageHeader } from "@/components/SchedulePageHeader";
import { Timeline } from "@/components/Timeline";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTrip(slug);
  if (!trip) return { title: "Not found" };
  return {
    title: `${trip.title} — Trip Schedule`,
    description: trip.subtitle || `Trip schedule for ${trip.title}`,
  };
}

export default async function TripPage({ params }: Props) {
  const { slug } = await params;
  const trip = await getTrip(slug);
  if (!trip) notFound();

  const initialActivities = await getActivities(slug);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <ScheduleActivitiesProvider tripSlug={slug} initialActivities={initialActivities}>
        <SchedulePageHeader trip={trip} />
        <Timeline trip={trip} />
      </ScheduleActivitiesProvider>
    </div>
  );
}
