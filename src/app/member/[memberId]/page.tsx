import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import GithubIcon from "@/components/GithubIcon";
import { getMemberByMemberId } from "@/lib/members";

export const dynamic = "force-dynamic";

export default async function MemberPage({ params }: { params: Promise<{ memberId: string }> }) {
  const { memberId } = await params;
  if (!/^[A-Z0-9-]{4,20}$/i.test(memberId)) notFound();
  const user = await getMemberByMemberId(memberId.toUpperCase());
  if (!user) notFound();
  const initial = user.name.trim().charAt(0).toUpperCase() || "A";
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-6 py-20 text-[var(--text-primary)]">
      <div className="mx-auto max-w-xl">
        <Link href="/leaderboard" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)] transition-colors hover:text-[#FF2A6D]">
          <ArrowLeft size={14} /> Leaderboard
        </Link>
        <div className="mt-6 border border-[var(--border-subtle)] bg-[var(--surface)] p-8">
          <p className="font-mono text-xs text-[#FF2A6D]">{user.memberId}{user.role === "ADMIN" ? " · ADMIN" : ""}</p>
          <div className="mt-6 flex items-center gap-6">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element -- external avatar
              <img src={user.image} alt={`${user.name} avatar`} className="h-24 w-24 rounded-2xl border border-[var(--border-subtle)] object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="inline-flex h-24 w-24 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-4xl font-bold text-[#FF2A6D]" aria-hidden="true">{initial}</span>
            )}
            <div className="min-w-0">
              <h1 className="text-4xl font-bold tracking-tight">{user.name}</h1>
              {user.githubHandle && <p className="mt-2 font-mono text-sm text-[var(--text-secondary)]">@{user.githubHandle}</p>}
            </div>
          </div>
          <div className="mt-8 border-t border-[var(--border-subtle)] pt-6">
            <p className="font-mono text-xs uppercase text-[var(--text-muted)]">Contribution score</p>
            <p className="mt-2 text-5xl font-bold text-[#FF2A6D]">{user.contributionScore}</p>
          </div>
          {user.githubHandle && (
            <a
              href={`https://github.com/${user.githubHandle}`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-secondary)] transition-colors hover:border-[#FF2A6D] hover:text-[#FF2A6D]"
            >
              <GithubIcon className="w-4 h-4" /> View on GitHub <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
