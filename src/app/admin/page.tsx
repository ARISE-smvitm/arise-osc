import Link from "next/link";
import { requireRole } from "@/lib/session";
import { countCollection } from "@/lib/members";
import { CalendarDays, Newspaper, Users, ShieldCheck, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireRole("ADMIN", "/admin");
  const [members, dispatches, events] = await Promise.all([
    countCollection("users"),
    countCollection("news"),
    countCollection("events"),
  ]);

  const cards = [
    { href: "/admin/events", icon: CalendarDays, title: "Events", detail: "Create, edit and remove community events shown on the public events page.", stat: events, statLabel: "events on file" },
    { href: "/admin/news", icon: Newspaper, title: "Newsroom", detail: "Edit or remove published dispatches. New dispatches are created from the studio.", stat: dispatches, statLabel: "dispatches live" },
    { href: "/newsroom/new", icon: ShieldCheck, title: "Publish dispatch", detail: "Open the admin studio to write a new dispatch in Markdown.", stat: null, statLabel: null },
    { href: "/dashboard", icon: Users, title: "Member dashboard", detail: "Your own profile, GitHub handle and ARISE QR card.", stat: members, statLabel: "members registered" },
  ];

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-6 py-16 text-[var(--text-primary)]">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]">Admin console</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight">Good to see you, {user.name.split(" ")[0]}.</h1>
        <p className="mt-3 max-w-lg text-[var(--text-secondary)]">Everything below is gated to role <b>ADMIN</b> and enforced server-side. Changes go live immediately (pages may serve cached content for a few minutes).</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <Link key={card.title} href={card.href} className="group flex flex-col justify-between border border-[var(--border-subtle)] bg-[var(--surface)] p-6 transition-colors hover:border-[#FF2A6D]">
              <div>
                <card.icon className="h-6 w-6 text-[#FF2A6D]" aria-hidden="true" />
                <h2 className="mt-3 text-xl font-bold tracking-tight">{card.title}</h2>
                <p className="mt-1.5 text-sm leading-6 text-[var(--text-secondary)]">{card.detail}</p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-4">
                {card.stat !== null ? <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]"><span className="text-lg font-bold text-[#FF2A6D]">{card.stat}</span> {card.statLabel}</p> : <span />}
                <ArrowRight className="h-4 w-4 text-[var(--text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[#FF2A6D]" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
