import { notFound } from "next/navigation";
import EventForm from "@/components/EventForm";
import { requireRole } from "@/lib/session";
import { getEvent } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN", "/admin/events");
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]">Admin / Events / Edit</p>
        <h1 className="sr-only">Edit {event.title}</h1>
        <div className="mt-4"><EventForm initial={event} /></div>
      </div>
    </main>
  );
}
