import Link from "next/link";
import { requireRole } from "@/lib/session";
import { listNews } from "@/lib/members";
import DeleteButton from "@/components/DeleteButton";
import { PenSquare, Newspaper } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  await requireRole("ADMIN", "/admin/news");
  const items = await listNews(100);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-6 py-14 text-[var(--text-primary)]">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]"><Link href="/admin" className="hover:underline">Admin</Link> / Newsroom</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Dispatches ({items.length})</h1>
          <Link href="/newsroom/new" className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] font-bold text-white transition-colors hover:bg-[#FF2A6D] dark:bg-white dark:text-[#0A0A0A] dark:hover:bg-[#FF2A6D] dark:hover:text-white"><PenSquare size={14} /> New dispatch</Link>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface)] p-10 text-center text-[var(--text-muted)]">
            <p className="font-semibold text-black">No dispatches published yet.</p>
            <p className="mt-1 text-sm">Write the first one — it appears on the public newsroom immediately.</p>
          </div>
        ) : (
          <ul className="mt-8 grid gap-3">
            {items.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-4 border border-[var(--border-subtle)] bg-[var(--surface)] p-4">
                <Newspaper className="h-5 w-5 shrink-0 text-[#FF2A6D]" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-[var(--text-muted)]">{item.createdAt ? item.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"} · {item.authorName}</p>
                  <p className="mt-0.5 truncate font-bold leading-snug">{item.title}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link href={`/admin/news/${item.id}`} className="rounded-full border border-[var(--border-subtle)] px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-[var(--text-secondary)] transition-colors hover:border-[#FF2A6D] hover:text-[#FF2A6D]">Edit</Link>
                  <DeleteButton url={`/api/news/${item.id}`} confirmMessage={`Delete “${item.title}”? This cannot be undone.`} redirectTo="/admin/news" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
