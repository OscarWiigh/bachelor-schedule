"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Trip } from "@/lib/types";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CreateTripForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    timezone: "UTC",
    startDate: "",
    endDate: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = slugify(form.name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!slug) {
      setError("Trip name is required.");
      return;
    }

    if (!form.startDate || !form.endDate) {
      setError("Start and end dates are required.");
      return;
    }

    setSaving(true);
    try {
      const body: Omit<Trip, "createdAt"> = {
        id: slug,
        title: form.name.trim(),
        subtitle: form.subtitle.trim(),
        timezone: form.timezone.trim() || "UTC",
        startDate: new Date(`${form.startDate}T00:00:00`).toISOString(),
        endDate: new Date(`${form.endDate}T23:59:59`).toISOString(),
        goodToKnowMd: null,
      };

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        throw new Error(j.error ?? "Could not create trip.");
      }

      router.push(`/${slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create trip.");
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
    >
      <div>
        <label className="block text-xs font-medium text-zinc-500">Trip name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-orange-500/30 focus:border-orange-500/60 focus:ring-2"
          placeholder="e.g. Paris Weekend"
          required
        />
        {form.name ? (
          <p className="mt-1 text-[11px] text-zinc-600">
            URL: <span className="text-zinc-400">/{slug || "…"}</span>
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500">Subtitle (optional)</label>
        <input
          type="text"
          value={form.subtitle}
          onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/60"
          placeholder="Optional tagline"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500">Timezone</label>
        <input
          type="text"
          value={form.timezone}
          onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/60"
          placeholder="UTC"
        />
        <p className="mt-1 text-[11px] text-zinc-600">
          IANA timezone e.g. Europe/Prague, America/New_York
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-500">Start date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/60"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500">End date</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/60"
            required
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-orange-400 disabled:opacity-50"
      >
        {saving ? "Creating…" : "Create trip"}
      </button>
    </form>
  );
}
