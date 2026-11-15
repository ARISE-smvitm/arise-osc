import Link from "next/link";
import { fetchCommunityLeaders, type CommunityContributor } from "@/lib/github-community";
import { listOrgRepos, GITHUB_ORG } from "@/lib/github";
import { countCollection } from "@/lib/members";

export const dynamic = "force-dynamic";

export default async function Home() {
  let leaders: CommunityContributor[] = [];
  let orgPulse = { repos: 0, stars: 0, issues: 0, members: 0 };
  try {
    const [leaderboard, repos, members] = await Promise.all([
      fetchCommunityLeaders(),
      listOrgRepos(),
      countCollection("users"),
    ]);
    leaders = leaderboard;
    orgPulse = {
      repos: repos.length,
      stars: repos.reduce((total, repo) => total + repo.stars, 0),
      issues: repos.reduce((total, repo) => total + repo.openIssues, 0),
      members,
    };
  } catch (error) {
    console.error("Community leaderboard preview failed", error);
  }
  return (
    <div className="landing-page min-h-screen">
      <section className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl flex-col justify-center px-6 pb-16 pt-12 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
        <div className="landing-hero-content">
          <div className="hero-copy">
            <p className="eyebrow">ARISE / Open source community</p>
            <h1 className="hero-headline">
              Build in public.<br /><span className="text-[#FF2A6D]">Leave a trace.</span>
            </h1>
            <p className="hero-lede">
              A quiet corner for curious people making useful things together at SMVITM.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/login" prefetch={false} className="rounded-full bg-[#0A0A0A] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#FF2A6D] dark:bg-white dark:text-[#0A0A0A]">Join ARISE <span aria-hidden="true">→</span></Link>
              <Link href="/leaderboard" prefetch={false} className="leaderboard-hero-link">See contributors <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <section className="hero-leaderboard" aria-label="Top ARISE contributors">
            <div className="hero-leaderboard-heading"><span className="eyebrow">Community signal</span><span className="hero-leaderboard-org">ARISE-smvitm / live GitHub</span></div>
            {leaders.length > 0 ? <div className="hero-leader-grid">{leaders.map((leader, index) => <a key={leader.login} href={leader.html_url} target="_blank" rel="noreferrer" className={`hero-leader hero-leader-${index + 1}`}><span className="hero-leader-rank">0{index + 1}</span><img src={leader.avatar_url} alt="" />{/* eslint-disable-line @next/next/no-img-element */}<span><strong>{leader.login}</strong><small>{leader.contributions > 0 ? `${leader.contributions} contributions` : "Public community member"}</small></span></a>)}</div> : <p className="hero-leader-empty">No public contributors are available yet. Publish a repository to activate this live panel.</p>}
          </section>
        </div>
      </section>
      {orgPulse.repos > 0 && (
        <section aria-label="ARISE GitHub organisation at a glance" className="border-t border-[var(--border-subtle)] bg-[#0A0A0A] text-white dark:bg-[#101010]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-12 gap-y-6 px-6 py-7 sm:px-6">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#FF2A6D]">{GITHUB_ORG}</p>
            <dl className="flex flex-wrap items-center gap-x-10 gap-y-4">
              <PulseStat value={orgPulse.repos} label="public repos" />
              <PulseStat value={orgPulse.stars} label="total stars" />
              <PulseStat value={orgPulse.issues} label="open issues" />
              <PulseStat value={orgPulse.members} label="members" />
            </dl>
            <Link href="/projects" prefetch={false} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] font-bold text-white/85 transition-colors hover:text-[#FF2A6D]">
              Browse projects <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

function PulseStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <dt className="sr-only">{label}</dt>
      <dd className="text-3xl font-bold leading-none text-[#FF2A6D]">{value}</dd>
      <dd className="mt-1.5 font-mono text-[0.55rem] uppercase tracking-[0.15em] text-white/50">{label}</dd>
    </div>
  );
}
