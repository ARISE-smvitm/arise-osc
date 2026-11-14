import EventForm from "@/components/EventForm";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  await requireRole("ADMIN", "/admin/events/new");
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]">Admin / Events / New</p>
        <h1 className="sr-only">Create an event</h1>
        <div className="mt-4"><EventForm /></div>
      </div>
    </main>
  );
}
