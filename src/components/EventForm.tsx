"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EVENT_TYPES, type EventType } from "@/lib/validation";
import type { CommunityEvent } from "@/lib/events";

const inputClass = "w-full border border-[var(--border-subtle)] px-3 py-2.5 text-sm outline-none focus:border-[#FF2A6D]";

/** Create (POST /api/events) or edit (PATCH /api/events/[id]) an event. */
export default function EventForm({ initial }: { initial?: CommunityEvent | null }) {
  const router = useRouter();
  const editing = Boolean(initial);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [type, setType] = useState<EventType>(initial?.type ?? "Workshop");
  const [startsAt, setStartsAt] = useState(initial?.startsAt ?? "");
  const [registrationDeadline, setRegistrationDeadline] = useState(initial?.registrationDeadline ?? "");
  const [venue, setVenue] = useState(initial?.venue ?? "");
  const [organisation, setOrganisation] = useState(initial?.organisation ?? "");
  const [registrationOpen, setRegistrationOpen] = useState(initial?.registrationOpen ?? true);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const payload = { title, type, startsAt, registrationDeadline, venue, organisation, registrationOpen, description };
    const response = await fetch(editing ? `/api/events/${initial!.id}` : "/api/events", {
      method: editing ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    setPending(false);
    if (!response.ok) {
      setError((await response.json().catch(() => null))?.error ?? "Unable to save this event");
      return;
    }
    router.push("/admin/events");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid max-w-3xl gap-5 border border-[var(--border-subtle)] bg-[var(--surface)] p-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]">{editing ? "Edit event" : "New event"}</p>
      <label className="grid gap-1.5 text-sm font-semibold">Title<input required value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} maxLength={140} placeholder="Hacktoberfest Sprint 2026" /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold">Type
          <select value={type} onChange={(event) => setType(event.target.value as EventType)} className={inputClass}>
            {EVENT_TYPES.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">Hosted by<input required value={organisation} onChange={(event) => setOrganisation(event.target.value)} className={inputClass} maxLength={80} placeholder="OSC × IEEE CS" /></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold">Date<input required type="date" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className={inputClass} /></label>
        <label className="grid gap-1.5 text-sm font-semibold">Registration closes <span className="font-normal text-[var(--text-muted)]">(optional)</span><input type="date" value={registrationDeadline} onChange={(event) => setRegistrationDeadline(event.target.value)} className={inputClass} /></label>
      </div>
      <label className="grid gap-1.5 text-sm font-semibold">Venue<input required value={venue} onChange={(event) => setVenue(event.target.value)} className={inputClass} maxLength={160} placeholder="Central Computing Lab 3 & Online" /></label>
      <label className="grid gap-1.5 text-sm font-semibold">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} className={`${inputClass} min-h-28`} maxLength={2000} placeholder="What happens, who it's for, what to bring…" /></label>
      <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={registrationOpen} onChange={(event) => setRegistrationOpen(event.target.checked)} className="h-4 w-4 accent-[#FF2A6D]" /> Registration open</label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={pending} className="justify-self-start bg-[#0A0A0A] px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#FF2A6D] disabled:cursor-wait disabled:opacity-70 dark:bg-white dark:text-[#0A0A0A] dark:hover:bg-[#FF2A6D] dark:hover:text-white">
        {pending ? "Saving…" : editing ? "Save changes" : "Publish event"}
      </button>
    </form>
  );
}
