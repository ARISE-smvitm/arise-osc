import Link from "next/link";
import { listOrgRepos, GITHUB_ORG } from "@/lib/github";
import ProjectsGrid from "@/components/ProjectsGrid";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const repos = await listOrgRepos();

  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-600 mb-2">
              Open Source Index <span className="text-slate-400 normal-case">· live from GitHub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Active Campus Projects
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              Public repositories built and maintained by the {GITHUB_ORG} GitHub organisation. Star one, read its README, pick an issue, and put it in your portfolio.
            </p>
          </div>
          <a
            href={`https://github.com/${GITHUB_ORG}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-[0.1em] text-white hover:bg-rose-600 transition-colors"
          >
            View org on GitHub <ArrowUpRightIcon />
          </a>
        </div>

        {repos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/30 px-6 py-20 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-rose-600">Nothing public yet</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Publish a repository and watch it appear here.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
              Push any public repo to the {GITHUB_ORG} organisation — it shows up on this page with its README, issues and contributors within minutes. The GitHub token used by this site currently sees no public repositories.
            </p>
            <Link href="/learn" className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] font-bold text-slate-900 border-b-2 border-rose-600 pb-1 hover:text-rose-600">
              New to open source? Start with Learn →
            </Link>
          </div>
        ) : (
          <>
            <ProjectsGrid repos={repos} />
            <p className="mt-8 text-center font-mono text-[0.65rem] uppercase tracking-[0.15em] text-slate-400">
              {repos.length} public {repos.length === 1 ? "repository" : "repositories"} · updated live on every visit
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}
