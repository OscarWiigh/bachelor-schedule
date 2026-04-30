"use client";

import type { Trip } from "@/lib/types";
import { utcIsoToTripDateTime, tripDateTimeToUtcIso } from "@/lib/trip-local-input";
import { useState } from "react";
import { MarkdownContent } from "@/components/MarkdownContent";

type Props = {
  trip: Trip;
  onSaved: (trip: Trip) => void;
};

export function SchedulePageSettingsEditor({ trip, onSaved }: Props) {
  const startLocal = utcIsoToTripDateTime(trip.startDate, trip.timezone);
  const endLocal = utcIsoToTripDateTime(trip.endDate, trip.timezone);

  const [form, setForm] = useState({
    title: trip.title,
    subtitle: trip.subtitle,
    timezone: trip.timezone,
    startDate: startLocal.date,
    endDate: endLocal.date,
    goodToKnowMd: trip.goodToKnowMd ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    try {
      // Convert date-only values using midnight in the trip timezone
      const startIso = tripDateTimeToUtcIso(form.startDate, "00:00", form.timezone);
      const endIso = tripDateTimeToUtcIso(form.endDate, "23:59", form.timezone);

      const res = await fetch(`/api/trips/${trip.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim() || trip.title,
          subtitle: form.subtitle.trim(),
          timezone: form.timezone.trim() || trip.timezone,
          startDate: startIso,
          endDate: endIso,
          goodToKnowMd: form.goodToKnowMd.trim() || null,
        }),
      });

      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        throw new Error(j.error ?? "Could not save trip settings.");
      }

      const updated = (await res.json()) as Trip;
      onSaved(updated);
      setMessage("Saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
    >
      <div>
        <label className="block text-xs font-medium text-zinc-500">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-orange-500/30 focus:border-orange-500/60 focus:ring-2"
          placeholder="Trip title"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500">Subtitle</label>
        <input
          type="text"
          value={form.subtitle}
          onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/60"
          placeholder="Optional subtitle"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500">Timezone</label>
        <input
          type="text"
          value={form.timezone}
          onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/60"
          placeholder="Europe/Prague"
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

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-zinc-500">
            Good to know (markdown)
          </label>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-[11px] font-medium text-orange-400/80 hover:text-orange-300"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
        {showPreview ? (
          <div className="mt-1 min-h-[6rem] rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 prose prose-invert prose-sm max-w-none">
            {form.goodToKnowMd.trim() ? (
              <MarkdownContent md={form.goodToKnowMd} />
            ) : (
              <p className="text-zinc-600 italic">Nothing to preview.</p>
            )}
          </div>
        ) : (
          <textarea
            value={form.goodToKnowMd}
            onChange={(e) => setForm((f) => ({ ...f, goodToKnowMd: e.target.value }))}
            rows={5}
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/60 resize-y"
            placeholder="**Contact info**, door codes, etc. Supports markdown."
          />
        )}
      </div>

      {message ? (
        <p className="text-sm text-orange-300/90" role="status">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-orange-400 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save trip settings"}
      </button>
    </form>
  );
}
