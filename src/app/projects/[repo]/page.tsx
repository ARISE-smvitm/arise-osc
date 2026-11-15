import Link from "next/link";
import type { Components } from "react-markdown";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Star, GitFork, CircleDot, GitBranch, Scale, MessageSquare, Sparkles, Clock, Code2, BookOpen } from "lucide-react";
import ReadmeMarkdown from "@/components/ReadmeMarkdown";
import { getOrgRepo, getRepoReadme, getOpenIssues, GITHUB_ORG, type RepoIssue } from "@/lib/github";

export const dynamic = "force-dynamic";

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  const days = Math.floor(seconds / 86400);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return months < 12 ? `${months}mo ago` : `${Math.floor(months / 12)}y ago`;
}

/** Rewrite relative README links to absolute GitHub URLs (raw content host for files, blob host for pages). */
function markdownComponents(owner: string, name: string, branch: string): Components {
  const rawBase = `https://raw.githubusercontent.com/${owner}/${name}/${branch}/`;
  const blobBase = `https://github.com/${owner}/${name}/blob/${branch}/`;
  const absolutize = (url: string, image: boolean) => {
    if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(url) || url.startsWith("#")) return url;
    const clean = url.replace(/^\.?\//, "");
    return (image ? rawBase : blobBase) + clean;
  };
  return {
    // Props are contextually typed by react-markdown; narrow URLs to strings inside.
    a: (props) => {
      const href = typeof props.href === "string" && props.href ? props.href : undefined;
      return <a {...props} href={href ? absolutize(href, false) : href} target="_blank" rel="noreferrer" />;
    },
    img: (props) => {
      const source = typeof props.src === "string" && props.src ? props.src : undefined;
      const alt = typeof props.alt === "string" ? props.alt : "";
      // eslint-disable-next-line @next/next/no-img-element
      return <img {...props} src={source ? absolutize(source, true) : source} alt={alt} />;
    },
  };
}

function IssueRow({ issue }: { issue: RepoIssue }) {
  return (
    <a
      href={issue.htmlUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex items-start gap-4 border-b border-[var(--border-subtle)] px-5 py-4 transition-colors hover:bg-[var(--surface-raised)]"
    >
      <span className="mt-0.5 shrink-0 font-mono text-xs font-bold text-[#FF2A6D]">#{issue.number}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[#FF2A6D]">{issue.title}</span>
        <span className="mt-2 flex flex-wrap items-center gap-1.5">
          {issue.goodFirstIssue && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[0.6rem] font-mono font-bold uppercase tracking-[0.08em] text-emerald-400">
              <Sparkles size={10} /> good first issue
            </span>
          )}
          {issue.labels.filter((label) => !/good[- ]first[- ]issue/i.test(label.name)).map((label) => (
            <span
              key={label.name}
              className="rounded-full border px-2 py-0.5 text-[0.6rem] font-mono"
              style={{ color: label.color, borderColor: `${label.color}55`, backgroundColor: `${label.color}14` }}
            >
              {label.name}
            </span>
          ))}
        </span>
        <span className="mt-2 flex items-center gap-3 text-[0.65rem] text-[var(--text-muted)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- external avatar, 16px */}
          {issue.authorAvatar && <img src={issue.authorAvatar} alt={`${issue.authorHandle} avatar`} className="h-4 w-4 rounded-full" loading="lazy" />}
          <span className="font-mono">@{issue.authorHandle}</span>
          <span className="inline-flex items-center gap-1"><Clock size={11} />{timeAgo(issue.createdAt)}</span>
          {issue.comments > 0 && <span className="inline-flex items-center gap-1"><MessageSquare size={11} />{issue.comments}</span>}
        </span>
      </span>
      <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--text-muted)] transition-all group-hover:text-[#FF2A6D]" />
    </a>
  );
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ repo: string }> }) {
  const { repo } = await params;
  const orgRepo = await getOrgRepo(decodeURIComponent(repo));
  if (!orgRepo) notFound();

  const [readme, issues] = await Promise.all([
    getRepoReadme(orgRepo.owner, orgRepo.name),
    getOpenIssues(orgRepo.owner, orgRepo.name, 15),
  ]);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--text-muted)] transition-colors hover:text-[#FF2A6D]">
          <ArrowLeft size={14} /> All projects
        </Link>

        <div className="mt-6 grid gap-6 xl:grid-cols-[19rem_minmax(0,1fr)]">
          {/* ── Sidebar ─────────────────────────────── */}
          <aside className="h-fit border border-[var(--border-subtle)] bg-[var(--surface)] p-6 xl:sticky xl:top-24">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#FF2A6D]">{GITHUB_ORG} / project</p>
            <h1 className="mt-2 font-mono text-2xl font-bold leading-tight tracking-tight">{orgRepo.name}</h1>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{orgRepo.description ?? "No description provided yet."}</p>

            <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden border border-[var(--border-subtle)] bg-[var(--border-subtle)]">
              {[
                { icon: Star, label: "Stars", value: orgRepo.stars },
                { icon: GitFork, label: "Forks", value: orgRepo.forks },
                { icon: CircleDot, label: "Issues", value: orgRepo.openIssues },
                { icon: Scale, label: "License", value: orgRepo.license ?? "—" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[var(--surface-raised)] p-3">
                  <stat.icon size={13} className="text-[#FF2A6D]" />
                  <p className="mt-1.5 text-lg font-bold leading-none">{stat.value}</p>
                  <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[var(--text-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>

            <dl className="mt-5 space-y-2 font-mono text-[0.7rem] text-[var(--text-secondary)]">
              <div className="flex items-center justify-between gap-2"><dt className="inline-flex items-center gap-1.5"><GitBranch size={11} />default branch</dt><dd className="text-[var(--text-primary)]">{orgRepo.defaultBranch}</dd></div>
              {orgRepo.language && <div className="flex items-center justify-between gap-2"><dt className="inline-flex items-center gap-1.5"><Code2 size={11} />language</dt><dd className="text-[var(--text-primary)]">{orgRepo.language}</dd></div>}
              <div className="flex items-center justify-between gap-2"><dt className="inline-flex items-center gap-1.5"><Clock size={11} />last push</dt><dd className="text-[var(--text-primary)]">{timeAgo(orgRepo.pushedAt)}</dd></div>
            </dl>

            {orgRepo.topics.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {orgRepo.topics.map((topic) => (
                  <span key={topic} className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2.5 py-0.5 text-[0.65rem] font-mono text-[var(--text-secondary)]">{topic}</span>
                ))}
              </div>
            )}

            <div className="mt-6 grid gap-2">
              <a href={orgRepo.htmlUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#0A0A0A] px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#FF2A6D] hover:text-white dark:bg-white dark:text-[#0A0A0A] dark:hover:bg-[#FF2A6D] dark:hover:text-white">
                Star / fork on GitHub <ArrowUpRight size={14} />
              </a>
              <a href="#issues" className="inline-flex items-center justify-center gap-2 border border-[var(--border-subtle)] px-4 py-3 text-xs font-mono uppercase tracking-[0.1em] text-[var(--text-secondary)] transition-colors hover:border-[#FF2A6D] hover:text-[#FF2A6D]">
                View open issues ({issues.length})
              </a>
            </div>
          </aside>

          {/* ── Reader + Issues ─────────────────────── */}
          <div className="min-w-0 space-y-6">
            <section className="overflow-hidden border border-[var(--border-subtle)]">
              <header className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface)] px-5 py-3">
                <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.15em] text-[var(--text-secondary)]"><BookOpen size={13} className="text-[#FF2A6D]" /> README.md</span>
                <span className="font-mono text-[0.62rem] text-[var(--text-muted)]">branch · {orgRepo.defaultBranch}</span>
              </header>
              <div className="resource-reader-body max-h-none">
                {readme ? (
                  <ReadmeMarkdown content={readme} components={markdownComponents(orgRepo.owner, orgRepo.name, orgRepo.defaultBranch)} />
                ) : (
                  <div className="p-4 text-sm text-[var(--text-secondary)]">
                    <p>This repository has no README yet.</p>
                    <a href={orgRepo.htmlUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-[#FF2A6D] hover:underline">Read the code directly on GitHub <ArrowUpRight size={14} /></a>
                  </div>
                )}
              </div>
            </section>

            <section id="issues" className="scroll-mt-24 overflow-hidden border border-[var(--border-subtle)]">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--surface)] px-5 py-3">
                <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.15em] text-[var(--text-secondary)]"><CircleDot size={13} className="text-[#FF2A6D]" /> Open issues · {issues.length}</span>
                <a href={`${orgRepo.htmlUrl}/issues`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-[var(--text-secondary)] transition-colors hover:text-[#FF2A6D]">
                  View all on GitHub <ArrowUpRight size={12} />
                </a>
              </header>
              {issues.length > 0 ? (
                <div>{issues.map((issue) => <IssueRow key={issue.number} issue={issue} />)}</div>
              ) : (
                <div className="px-5 py-10 text-center text-sm text-[var(--text-muted)]">
                  <p className="font-semibold text-[var(--text-primary)]">No open issues.</p>
                  <p className="mt-1">Be the first to file one — it helps whoever picks this up next.</p>
                  <a href={`${orgRepo.htmlUrl}/issues/new`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-[#FF2A6D] hover:underline">Open an issue on GitHub <ArrowUpRight size={14} /></a>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
