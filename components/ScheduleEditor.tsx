"use client";

import { useScheduleActivities } from "@/components/ScheduleActivitiesProvider";
import { newActivityId } from "@/lib/activities";
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/categories";
import { hasBookedByForDisplay } from "@/lib/booked-by-display";
import {
  pragueDateTimeToUtcIso,
  utcIsoToPragueDateTime,
} from "@/lib/prague-local-input";
import type { Activity } from "@/lib/types";
import Link from "next/link";
import { useCallback, useState } from "react";

const emptyForm = () => ({
  title: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  category: "food" as CategoryId,
  bookedBy: "",
  mapUrl: "",
});

export function ScheduleEditor() {
  const { activities, setActivities, isLoading, error, refetch } =
    useScheduleActivities();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadIntoForm = useCallback((a: Activity) => {
    const s = utcIsoToPragueDateTime(a.start);
    const e = utcIsoToPragueDateTime(a.end);
    setEditingId(a.id);
    setForm({
      title: a.title,
      startDate: s.date,
      startTime: s.time,
      endDate: e.date,
      endTime: e.time,
      category: a.category,
      bookedBy: a.bookedBy,
      mapUrl: a.mapUrl ?? "",
    });
    setMessage(null);
  }, []);

  const clearForm = useCallback(() => {
    setEditingId(null);
    setForm(emptyForm());
    setMessage(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    let startIso: string;
    let endIso: string;
    try {
      startIso = pragueDateTimeToUtcIso(form.startDate, form.startTime);
      endIso = pragueDateTimeToUtcIso(form.endDate, form.endTime);
    } catch {
      setMessage("Could not save — check date and time fields.");
      return;
    }

    if (new Date(endIso).getTime() <= new Date(startIso).getTime()) {
      setMessage("End must be after start.");
      return;
    }

    const mapTrim = form.mapUrl.trim();
    if (mapTrim && !/^https?:\/\//i.test(mapTrim)) {
      setMessage("Link must start with http:// or https:// (or leave blank).");
      return;
    }

    const next: Activity = {
      id: editingId ?? newActivityId(),
      title: form.title.trim() || "Untitled",
      start: startIso,
      end: endIso,
      category: form.category,
      bookedBy: form.bookedBy.trim(),
      ...(mapTrim && /^https?:\/\//i.test(mapTrim) ? { mapUrl: mapTrim } : {}),
    };

    setSaving(true);
    try {
      if (editingId) {
        await setActivities(
          activities.map((a) => (a.id === editingId ? next : a)),
        );
      } else {
        await setActivities([...activities, next]);
      }
      setEditingId(null);
      setForm(emptyForm());
      setMessage("Saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this entry?")) return;
    setSaving(true);
    try {
      await setActivities(activities.filter((a) => a.id !== id));
      if (editingId === id) clearForm();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not delete.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-28 pt-4">
      <header className="mb-6 border-b border-zinc-800/80 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500/90">
              Unlisted editor
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-50">
              Edit schedule
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Times are{" "}
              <span className="font-medium text-zinc-400">Europe/Prague</span>.
              Entries are stored in your{" "}
              <span className="font-medium text-zinc-400">PostgreSQL</span>{" "}
              database via the API.
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-200 transition hover:border-orange-500/50 hover:text-orange-200"
          >
            Timeline
          </Link>
        </div>
      </header>

      {isLoading ? (
        <p className="mb-4 text-sm text-zinc-500">Loading entries…</p>
      ) : null}
      {!isLoading && error && activities.length === 0 ? (
        <div className="mb-4 rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-3 text-sm text-red-200">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-2 text-xs font-semibold text-orange-400 underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
      >
        <h2 className="text-sm font-semibold text-orange-400/90">
          {editingId ? "Edit entry" : "Add entry"}
        </h2>

        <div>
          <label className="block text-xs font-medium text-zinc-500">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-orange-500/30 focus:border-orange-500/60 focus:ring-2"
            placeholder="e.g. Dinner reservation"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-500">
              Start date
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, startDate: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/60"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">
              Start time
            </label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) =>
                setForm((f) => ({ ...f, startTime: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/60"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">
              End date
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, endDate: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/60"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">
              End time
            </label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) =>
                setForm((f) => ({ ...f, endTime: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/60"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                category: e.target.value as CategoryId,
              }))
            }
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/60"
          >
            {CATEGORY_IDS.map((id) => (
              <option key={id} value={id}>
                {CATEGORIES[id].emoji} {CATEGORIES[id].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500">
            Booked by
          </label>
          <input
            type="text"
            value={form.bookedBy}
            onChange={(e) =>
              setForm((f) => ({ ...f, bookedBy: e.target.value }))
            }
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/60"
            placeholder="Name"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500">
            Link (optional)
          </label>
          <input
            type="url"
            value={form.mapUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, mapUrl: e.target.value }))
            }
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/60"
            placeholder="https://…"
          />
          <p className="mt-1 text-[11px] text-zinc-600">
            https only — tapping the card on the timeline opens this in a new tab.
          </p>
        </div>

        {message ? (
          <p className="text-sm text-orange-300/90" role="status">
            {message}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="submit"
            disabled={saving || isLoading}
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-orange-400 disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Update" : "Add"}
          </button>
          {editingId ? (
            <button
              type="button"
              disabled={saving}
              onClick={clearForm}
              className="rounded-full border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500 disabled:opacity-50"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <section className="mt-8">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-zinc-300">
            All entries ({activities.length})
          </h2>
        </div>
        <ul className="space-y-2">
          {activities.map((a) => {
            const cat = CATEGORIES[a.category];
            const s = utcIsoToPragueDateTime(a.start);
            const e = utcIsoToPragueDateTime(a.end);
            return (
              <li
                key={a.id}
                className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3"
              >
                <span className="text-xl leading-none" aria-hidden>
                  {cat.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-zinc-100">{a.title}</p>
                  <p className="mt-0.5 text-xs tabular-nums text-zinc-500">
                    {s.date} {s.time} → {e.date} {e.time}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {cat.label}
                    {hasBookedByForDisplay(a.bookedBy) ? (
                      <>
                        {" "}
                        · Booked by{" "}
                        <span className="text-zinc-400">{a.bookedBy.trim()}</span>
                      </>
                    ) : null}
                    {a.mapUrl?.trim() ? (
                      <span className="ml-1 font-medium text-sky-400/90">
                        · Link
                      </span>
                    ) : null}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => loadIntoForm(a)}
                    className="rounded-lg bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700 disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void handleDelete(a.id)}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-red-400/90 hover:bg-red-950/50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
