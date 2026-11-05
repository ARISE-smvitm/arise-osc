import Link from "next/link";
import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";
import Markdown from "react-markdown";
import { hasDatabaseConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function NewsroomPage() {
  if (!hasDatabaseConfig()) {
    return (
      <main className="site-page">
        <div className="site-container">
          <p className="eyebrow">Dispatches from ARISE</p>
          <h1 className="page-title">Newsroom</h1>
          <div className="status-card">
            <h2>Newsroom is waiting for its database connection.</h2>
            <p>Set <code>DATABASE_URL</code> in the deployment environment, then restart the server to load published dispatches.</p>
          </div>
        </div>
      </main>
    );
  }
  const items = await unstable_cache(
    () => prisma.newsItem.findMany({ orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } }),
    ["newsroom-items"],
    { revalidate: 300 },
  )();
  return <main className="site-page"><div className="site-container"><p className="eyebrow">Dispatches from ARISE</p><h1 className="page-title">Newsroom</h1><div className="resource-grid mt-12">{items.map((item) => <article key={item.id} className="resource-card"><p className="resource-kind">{item.createdAt.toLocaleDateString()} / {item.author.name}</p><h2>{item.title}</h2><div className="prose prose-sm mt-3 max-w-none text-[var(--text-secondary)]"><Markdown>{item.content}</Markdown></div></article>)}</div>{items.length === 0 && <p className="mt-12 text-[var(--text-secondary)]">No dispatches yet.</p>}<Link className="inline-flex mt-12 font-mono text-xs uppercase text-[#FF2A6D]" href="/leaderboard">View contributor leaderboard →</Link></div></main>;
}
