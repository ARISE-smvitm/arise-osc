import Link from "next/link";
import { redirect } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { getSessionUser } from "@/lib/session";
import { countCollection } from "@/lib/members";
import { listOrgRepos, GITHUB_ORG } from "@/lib/github";
import ProfileEditor from "@/components/ProfileEditor";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?callbackUrl=/dashboard");
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const [repos, members] = await Promise.all([
    listOrgRepos().catch(() => []),
    countCollection("users").catch(() => 0),
  ]);
  const orgPulse = {
    repos: repos.length,
    stars: repos.reduce((total, repo) => total + repo.stars, 0),
    issues: repos.reduce((total, repo) => total + repo.openIssues, 0),
    members,
  };
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-6 py-16 text-[var(--text-primary)]">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]">Member dashboard</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight">Welcome, {user.name.split(" ")[0]}.</h1>
        {user.role === "ADMIN" && (
          <Link href="/admin" className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-[#0A0A0A] bg-[#0A0A0A] px-5 py-4 text-white transition-colors hover:border-[#FF2A6D] hover:bg-[#161616] dark:border-[var(--border-subtle)] dark:bg-[var(--surface)] dark:text-[var(--text-primary)] dark:hover:bg-[var(--surface-raised)]">
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#FF2A6D]">Admin</p>
              <p className="mt-1 font-semibold">You have admin access — open the admin console to manage events and dispatches.</p>
            </div>
            <span className="shrink-0 font-mono text-xs uppercase tracking-[0.1em] text-white/80">Open console →</span>
          </Link>
        )}
        {!user.onboardedAt && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-[#FF2A6D]/40 bg-[var(--surface-raised)] px-5 py-4">
            <div>
              <p className="font-semibold">Complete your community profile</p>
              <p className="text-sm text-[var(--text-secondary)]">Takes 30 seconds — it powers the leaderboard and helps members find you.</p>
            </div>
            <Link href="/onboarding" className="shrink-0 rounded-full bg-[#0A0A0A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#FF2A6D] dark:bg-white dark:text-[#0A0A0A] dark:hover:bg-[#FF2A6D] dark:hover:text-white">
              Complete setup →
            </Link>
          </div>
        )}
        {/* Your GitHub + live org pulse */}
        <section className="mt-8 grid overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface)] md:grid-cols-[1fr_auto]">
          <div className="flex items-center gap-5 p-6 text-[var(--text-primary)] text-[var(--text-primary)]">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element -- external avatar
              <img src={user.image} alt={`${user.name} avatar`} className="h-16 w-16 rounded-full border border-[var(--border-subtle)] object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-raised)] font-mono text-2xl font-bold text-[var(--text-secondary)]">{user.name.trim().charAt(0).toUpperCase()}</span>
            )}
            <div className="min-w-0">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#FF2A6D]">Your GitHub</p>
              {user.githubHandle ? (
                <>
                  <a href={`https://github.com/${user.githubHandle}`} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-2 font-mono text-lg font-bold hover:text-[#FF2A6D]">@{user.githubHandle} <ArrowUpRightMini /></a>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">Contributions to {GITHUB_ORG} repos count toward your score — <span className="font-semibold text-[var(--text-primary)]">{user.contributionScore}</span> and counting.</p>
                </>
              ) : (
                <>
                  <p className="mt-1 font-semibold">No GitHub handle linked yet.</p>
                  <Link href="/onboarding" className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.1em] text-[#FF2A6D] hover:underline">Link it in onboarding <ArrowUpRightMini /></Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6 border-t border-[var(--border-subtle)] bg-[#0A0A0A] px-6 py-5 text-white md:border-l md:border-t-0 dark:border-[var(--border-subtle)] dark:bg-[#101010]">
            <OrgStat value={orgPulse.repos} label="Public repos" />
            <OrgStat value={orgPulse.stars} label="Stars" />
            <OrgStat value={orgPulse.issues} label="Open issues" />
            <OrgStat value={orgPulse.members} label="Members" />
          </div>
        </section>
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto]">
          <ProfileEditor githubHandle={user.githubHandle ?? ""} image={user.image} />
          <div className="border border-[var(--border-subtle)] bg-[var(--surface)] p-6 text-center">
            <p className="font-mono text-xs text-[var(--text-muted)]">{user.memberId}</p>
            <div className="mt-4 bg-white p-2"><QRCodeSVG value={`${origin}/member/${user.memberId}`} size={180} includeMargin /></div>
            <p className="mt-3 text-xs text-[var(--text-muted)]">Scan your ARISE profile</p>
          </div>
        </div>
      </div>
    </main>
  );
}

function OrgStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold leading-none text-[#FF2A6D]">{value}</p>
      <p className="mt-1.5 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-white/55">{label}</p>
    </div>
  );
}

function ArrowUpRightMini() {
  return (
    <svg className="inline h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}
