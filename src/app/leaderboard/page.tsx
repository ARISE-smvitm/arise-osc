import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { hasDatabaseConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  if (!hasDatabaseConfig()) {
    return <main className="site-page"><div className="site-container"><p className="eyebrow">Contribution index</p><h1 className="page-title">Leaderboard</h1><div className="status-card"><h2>Leaderboard is waiting for its database connection.</h2><p>Set <code>DATABASE_URL</code> to enable live contribution scores.</p></div></div></main>;
  }
  const users = await unstable_cache(
    () => prisma.user.findMany({ orderBy: [{ contributionScore: "desc" }, { name: "asc" }], take: 100, select: { memberId: true, name: true, image: true, githubHandle: true, contributionScore: true } }),
    ["leaderboard-users"],
    { revalidate: 3600 },
  )();
  return <main className="min-h-screen bg-[#0A0A0A] px-6 py-20 text-white"><div className="mx-auto max-w-4xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]">Contribution index</p><h1 className="mt-3 text-6xl font-bold tracking-tight">Leaderboard</h1><div className="leaderboard-list mt-10">{users.map((user, index: number) => <div key={user.memberId} className="leaderboard-row"><span className="leaderboard-rank">{String(index + 1).padStart(2, "0")}</span><div className="leaderboard-name"><p>{user.name}</p><span>{user.githubHandle ? `@${user.githubHandle}` : user.memberId}</span></div><strong className="leaderboard-score">{user.contributionScore}</strong></div>)}</div></div></main>;
}
