import { Timeline } from "@/components/Timeline";
import { AIRBNB_MAPS_URL } from "@/lib/config";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <header className="shrink-0 border-b border-zinc-800/80 bg-zinc-950/90 px-4 pb-4 pt-4 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500/90">
              Bachelor weekend
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-50">
              Bachelor Schedule
            </h1>
          </div>
          <Link
            href="/edit"
            className="shrink-0 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-200 transition hover:border-orange-500/50 hover:text-orange-200"
          >
            Edit
          </Link>
        </div>

        <aside
          className="mt-3 w-full rounded-2xl border border-sky-400/45 bg-sky-500/[0.16] px-3.5 py-3.5 shadow-sm ring-1 ring-inset ring-sky-300/20"
          aria-label="Contact and accommodation"
        >
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-sky-100">
            Good to know
          </p>
          <div className="mt-3 divide-y divide-sky-300/25">
            <div className="pb-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-sky-200/90">
                Oscar
              </p>
              <a
                href="tel:+46701476688"
                className="mt-1 block text-base font-bold tabular-nums tracking-tight text-white underline decoration-sky-200/50 decoration-2 underline-offset-2 hover:text-sky-50"
              >
                +46 70 147 66 88
              </a>
            </div>
            <div className="py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-sky-200/90">
                Filip
              </p>
              <a
                href="tel:+46707484583"
                className="mt-1 block text-base font-bold tabular-nums tracking-tight text-white underline decoration-sky-200/50 decoration-2 underline-offset-2 hover:text-sky-50"
              >
                +46 70 748 45 83
              </a>
            </div>
            <div className="py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-sky-200/90">
                AirBnB
              </p>
              <a
                href={AIRBNB_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-base font-bold text-white underline decoration-sky-200/50 decoration-2 underline-offset-2 hover:text-sky-50"
              >
                AirBnB address
              </a>
            </div>
            <div className="pt-3">
              <p className="text-base font-bold tabular-nums tracking-tight text-white">
                Main Door code: 9517#
              </p>
            </div>
          </div>
        </aside>
      </header>
      <Timeline />
    </div>
  );
}
