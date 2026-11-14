"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Star, GitFork, CircleDot, ArrowRight, Filter } from "lucide-react";
import type { RepoSummary } from "@/lib/github";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572a5", Rust: "#dea584",
  Go: "#00add8", "C++": "#f34b7d", C: "#555555", "C#": "#178600", Java: "#b07219",
  Kotlin: "#a97bff", Swift: "#f05138", CSS: "#663399", HTML: "#e34c26", Vue: "#41b883",
  Svelte: "#ff3e00", Ruby: "#701516", Shell: "#89e051", Dart: "#00b4ab", PHP: "#4f5d95",
};

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  const days = Math.floor(seconds / 86400);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default function ProjectsGrid({ repos }: { repos: RepoSummary[] }) {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("ALL");

  const languages = ["ALL", ...new Set(repos.map((repo) => repo.language).filter((value): value is string => Boolean(value)))];

  const filtered = repos.filter((repo) => {
    const haystack = `${repo.name} ${repo.description ?? ""} ${repo.topics.join(" ")}`.toLowerCase();
    const matchesSearch = !search || haystack.includes(search.toLowerCase());
    const matchesLanguage = language === "ALL" || repo.language === language;
    return matchesSearch && matchesLanguage;
  });

  return (
    <>
      {/* Filter Bar */}
      <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search repositories, topics, descriptions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:outline-hidden"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-slate-400 font-medium px-1">Language:</span>
          {languages.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLanguage(option)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${language === option ? "bg-slate-950 text-white" : "text-slate-600 hover:text-slate-950"}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-slate-200 rounded-xl">
            <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-mono text-slate-500">No repositories match those filters.</p>
            <button type="button" onClick={() => { setSearch(""); setLanguage("ALL"); }} className="mt-3 text-xs font-mono text-rose-600 hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map((repo) => (
            <Link
              key={repo.name}
              href={`/projects/${repo.name}`}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {repo.language && <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: LANGUAGE_COLORS[repo.language] ?? "#94a3b8" }} />}
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-slate-500">{repo.language ?? "Unknown"}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">pushed {timeAgo(repo.pushedAt)}</span>
                </div>
                <h2 className="mt-2 text-lg font-bold text-slate-950 font-mono group-hover:text-rose-600 transition-colors">
                  {repo.fullName}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {repo.description ?? "No description yet — read the README to see what this is about."}
                </p>
                {repo.topics.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {repo.topics.slice(0, 6).map((topic) => (
                      <span key={topic} className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1" title="Stars"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />{repo.stars}</span>
                  <span className="inline-flex items-center gap-1" title="Forks"><GitFork className="w-3.5 h-3.5 text-slate-400" />{repo.forks}</span>
                  <span className="inline-flex items-center gap-1 text-rose-700 font-medium" title="Open issues"><CircleDot className="w-3.5 h-3.5 text-rose-500" />{repo.openIssues}</span>
                </div>
                <span className="inline-flex items-center gap-1 font-medium text-slate-800 group-hover:text-rose-600 transition-colors">
                  <span>Details & issues</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
