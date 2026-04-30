import { getAllTrips } from "@/lib/trips-db";
import { TripCard } from "@/components/TripCard";
import { CreateTripForm } from "@/components/CreateTripForm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const trips = await getAllTrips();

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500/90">
          Multi-trip scheduler
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-50">
          Trip Schedule
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          View and manage your trip itineraries.
        </p>
      </header>

      {trips.length === 0 ? (
        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
          <p className="text-zinc-400">No trips yet. Create your first one below.</p>
        </div>
      ) : (
        <section className="mb-8 space-y-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </section>
      )}

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-400">
          Create new trip
        </h2>
        <CreateTripForm />
      </section>
    </div>
  );
}
