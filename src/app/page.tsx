import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { fetchCommunityLeaders, type CommunityContributor } from "@/lib/github-community";

export const dynamic = "force-dynamic";

export default async function Home() {
  let leaders: CommunityContributor[] = [];
  try {
    leaders = await fetchCommunityLeaders();
  } catch (error) {
    console.error("Community leaderboard preview failed", error);
  }
  return (
    <div className="landing-page min-h-screen">
      <section className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 sm:pt-36">
        <div className="flex items-center justify-between">
          <BrandLogo className="[&_*]:text-[var(--text-primary)]" />
        </div>
        <div className="landing-hero-content max-w-6xl pb-16 pt-16 sm:pt-24 lg:pb-24">
          <div className="hero-copy">
          <p className="eyebrow">ARISE / Open source community</p>
          <h1 className="mt-7 text-5xl font-semibold leading-[1.02] tracking-[-0.06em] sm:text-7xl xl:text-8xl">
            Build in public.<br /><span className="text-[#FF2A6D]">Leave a trace.</span>
          </h1>
          <p className="mt-8 max-w-md text-base leading-7 text-[var(--text-secondary)]">
            A quiet corner for curious people making useful things together at SMVITM.
          </p>
          <div className="mt-9 flex items-center gap-5">
            <Link href="/login" prefetch={false} className="rounded-full bg-[#0A0A0A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#FF2A6D] dark:bg-white dark:text-[#0A0A0A]">Join ARISE <span aria-hidden="true">→</span></Link>
            <Link href="/leaderboard" prefetch={false} className="leaderboard-hero-link">See contributors <span aria-hidden="true">↗</span></Link>
          </div>
          </div>
          <section className="hero-leaderboard" aria-label="Top ARISE contributors">
            <div className="hero-leaderboard-heading"><span className="eyebrow">Community signal</span><span className="hero-leaderboard-org">ARISE-smvitm / live GitHub</span></div>
            {leaders.length > 0 ? <div className="hero-leader-grid">{leaders.map((leader, index) => <a key={leader.login} href={leader.html_url} target="_blank" rel="noreferrer" className={`hero-leader hero-leader-${index + 1}`}><span className="hero-leader-rank">0{index + 1}</span><img src={leader.avatar_url} alt="" /><span><strong>{leader.login}</strong><small>{leader.contributions > 0 ? `${leader.contributions} contributions` : "Public community member"}</small></span></a>)}</div> : <p className="hero-leader-empty">No public contributors are available yet. Publish a repository to activate this live panel.</p>}
          </section>
        </div>
      </section>
    </div>
  );
}
