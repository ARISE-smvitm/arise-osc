import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listAllEvents, formatEventDate } from "@/lib/events";
import DeleteButton from "@/components/DeleteButton";
import { CalendarPlus, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await requireRole("ADMIN", "/admin/events");
  const events = await listAllEvents(200);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-6 py-14 text-[var(--text-primary)]">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]"><Link href="/admin" className="hover:underline">Admin</Link> / Events</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Events ({events.length})</h1>
          <Link href="/admin/events/new" className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] font-bold text-white transition-colors hover:bg-[#FF2A6D] dark:bg-white dark:text-[#0A0A0A] dark:hover:bg-[#FF2A6D] dark:hover:text-white"><CalendarPlus size={14} /> New event</Link>
        </div>

        {events.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface)] p-10 text-center text-[var(--text-muted)]">
            <p className="font-semibold text-black">No events yet.</p>
            <p className="mt-1 text-sm">Publish the first one — it appears on the public events page immediately.</p>
          </div>
        ) : (
          <ul className="mt-8 grid gap-3">
            {events.map((event) => {
              const past = event.startsAt < today;
              return (
                <li key={event.id} className="flex flex-wrap items-center gap-4 border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                  <div className="w-20 shrink-0 border-r border-[var(--border-subtle)] pr-4 text-center">
                    <p className="font-mono text-[0.6rem] uppercase text-[var(--text-muted)]">{formatEventDate(event.startsAt).split(" ")[0]}</p>
                    <p className="text-2xl font-bold leading-none">{formatEventDate(event.startsAt).split(" ")[1]?.replace(",", "")}</p>
                    <p className="font-mono text-[0.6rem] text-[var(--text-muted)]">{formatEventDate(event.startsAt).split(" ")[2]}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-[0.65rem] font-mono uppercase tracking-[0.08em] text-[var(--text-muted)]">
                      <span className="rounded bg-rose-50 px-2 py-0.5 text-[#FF2A6D] ring-1 ring-rose-200">{event.type}</span>
                      {event.organisation}
                      {past && <span className="rounded bg-[var(--surface-raised)] px-2 py-0.5 text-[var(--text-secondary)] ring-1 ring-black/10">Past</span>}
                      {!event.registrationOpen && <span className="rounded bg-[var(--surface-raised)] px-2 py-0.5 text-[var(--text-secondary)] ring-1 ring-black/10">Reg closed</span>}
                    </p>
                    <p className="mt-1 font-bold leading-snug">{event.title}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--text-muted)]"><MapPin size={12} />{event.venue}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link href={`/admin/events/${event.id}`} className="rounded-full border border-[var(--border-subtle)] px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-[var(--text-secondary)] transition-colors hover:border-[#FF2A6D] hover:text-[#FF2A6D]">Edit</Link>
                    <DeleteButton url={`/api/events/${event.id}`} confirmMessage={`Delete “${event.title}”? This cannot be undone.`} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
