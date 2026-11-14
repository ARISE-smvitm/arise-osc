/* eslint-disable @next/next/no-img-element -- avatars come from GitHub/Google */
import Link from "next/link";
import { listTopMembers } from "@/lib/members";
import { isBackendConfigured } from "@/lib/config";
import { getCommunityStats, GITHUB_ORG } from "@/lib/github";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  if (!isBackendConfigured()) {
    return <main className="site-page"><div className="site-container"><p className="eyebrow">Contribution index</p><h1 className="page-title">Leaderboard</h1><div className="status-card"><h2>Leaderboard is waiting for Firebase to be configured.</h2><p>Set <code>FIREBASE_SERVICE_ACCOUNT_KEY</code> (or the discrete <code>FIREBASE_*</code> admin variables) to enable live contribution scores.</p></div></div></main>;
  }

  const [github, members] = await Promise.all([
    getCommunityStats().catch(() => null),
    listTopMembers(100),
  ]);

  const membersByHandle = new Map(
    members.filter((member) => member.githubHandle).map((member) => [member.githubHandle!.toLowerCase(), member]),
  );

  const contributorHandles = new Set(github?.contributors.map((contributor) => contributor.login.toLowerCase()) ?? []);
  const board =
    github && github.contributors.length > 0
      ? [
          ...github.contributors.map((contributor) => {
            const member = membersByHandle.get(contributor.login.toLowerCase());
            return {
              key: contributor.login,
              name: member?.name ?? contributor.login,
              login: contributor.login,
              memberId: member?.memberId ?? null,
              isMember: Boolean(member),
              image: member?.image ?? contributor.avatarUrl,
              contributions: contributor.contributions,
              repoCount: contributor.repoCount,
              href: member ? `/member/${member.memberId}` : contributor.htmlUrl,
              external: !member,
            };
          }),
          // Members with no contributions yet — appended after the GitHub-ranked rows.
          ...members
            .filter((member) => !member.githubHandle || !contributorHandles.has(member.githubHandle.toLowerCase()))
            .map((member) => ({
              key: member.memberId,
              name: member.name,
              login: member.githubHandle?.toLowerCase() ?? null,
              memberId: member.memberId,
              isMember: true,
              image: member.image,
              contributions: member.contributionScore,
              repoCount: null as number | null,
              href: `/member/${member.memberId}`,
              external: false,
            })),
        ]
      : members.map((member) => ({
          key: member.memberId,
          name: member.name,
          login: member.githubHandle?.toLowerCase() ?? null,
          memberId: member.memberId,
          isMember: true,
          image: member.image,
          contributions: member.contributionScore,
          repoCount: null as number | null,
          href: `/member/${member.memberId}`,
          external: false,
        }));

  const totals = github
    ? { contributors: github.contributors.length, contributions: github.totalContributions, repos: github.repos }
    : null;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-6 py-20 text-[var(--text-primary)]">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]">Contribution index</p>
        <h1 className="mt-3 text-6xl font-bold tracking-tight">Leaderboard</h1>
        <p className="mt-3 max-w-lg text-sm text-[var(--text-secondary)]">
          Real GitHub contributions across <span className="text-[var(--text-primary)]">{GITHUB_ORG}</span> — refreshed hourly, merged with member records. Members are marked <span className="text-[#FF2A6D]">ARISE</span>; everyone else contributes anonymously as a GitHub handle.
        </p>

        {totals && (
          <div className="mt-8 grid grid-cols-3 overflow-hidden border border-[var(--border-subtle)]">
            {[
              { value: totals.contributions, label: "contributions" },
              { value: totals.contributors, label: "contributors" },
              { value: totals.repos, label: "repos" },
            ].map((stat) => (
              <div key={stat.label} className="border-r border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-5 text-center last:border-r-0">
                <p className="text-3xl font-bold leading-none text-[#FF2A6D]">{stat.value}</p>
                <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.15em] text-[var(--text-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="leaderboard-list mt-10">
          {board.map((entry, index) => (
            <Link
              key={entry.key}
              href={entry.href}
              {...(entry.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="leaderboard-row"
            >
              <span className="leaderboard-rank">{String(index + 1).padStart(2, "0")}</span>
              {entry.image ? (
                <img className="leaderboard-avatar" src={entry.image} alt="" loading="lazy" />
              ) : (
                <span className="leaderboard-avatar leaderboard-avatar-fallback">{entry.name.trim().charAt(0).toUpperCase() || "A"}</span>
              )}
              <span className="leaderboard-name">
                <span className="flex flex-wrap items-center gap-2">
                  <p>{entry.name}</p>
                  {entry.memberId && <span className="rounded-full border border-[#FF2A6D]/40 bg-[#FF2A6D]/10 px-2 py-0.5 font-mono text-[0.52rem] font-bold uppercase tracking-[0.08em] text-[#FF2A6D]">{entry.memberId}</span>}
                </span>
                <span>{entry.login ? `@${entry.login}` : "Not linked yet — link in onboarding"}{entry.repoCount !== null && entry.repoCount > 0 ? ` · across ${entry.repoCount} ${entry.repoCount === 1 ? "repo" : "repos"}` : ""}</span>
              </span>
              <span className="leaderboard-score flex flex-col items-end">
                <span>{entry.contributions}</span>
                <span className="text-[0.55rem] uppercase tracking-[0.1em] text-[var(--text-muted)]">{entry.contributions === 1 ? "contribution" : "contributions"}</span>
              </span>
            </Link>
          ))}
        </div>

        {board.length === 0 && (
          <div className="mt-12 border border-dashed border-[var(--border-subtle)] p-10 text-center">
            <p className="font-semibold text-[var(--text-primary)]">No contributions yet.</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Push a commit to any public repository in <span className="text-[var(--text-primary)]">{GITHUB_ORG}</span> and you&apos;ll appear here within the hour — handle or not.</p>
          </div>
        )}
      </div>
    </main>
  );
}
