"use client";

import { useState } from "react";
import { FEATURED_PROJECTS } from "@/data/mockData";
import { Search, Filter, GitPullRequest, CircleDot, ExternalLink, GitFork } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<string>("ALL");
  const [onlyGoodFirstIssues, setOnlyGoodFirstIssues] = useState(false);

  const orgs = ["ALL", "OSC", "GDSC", "IEEE CS", "ARC"];

  const filteredProjects = FEATURED_PROJECTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesOrg = selectedOrg === "ALL" || p.organisation === selectedOrg;
    const matchesGoodFirst = !onlyGoodFirstIssues || p.goodFirstIssuesCount > 0;

    return matchesSearch && matchesOrg && matchesGoodFirst;
  });

  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-600 mb-2">
            Open Source Index
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
            Active Campus Projects
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-2xl">
            Explore software repositories built and maintained by SMVITM technical clubs. Filter by technology stack, owning cell, or jump straight into beginner-friendly open issues.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, tech stack, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Org Filter */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/50 p-1 text-xs font-mono">
              <span className="px-2 text-slate-400 font-medium">Club:</span>
              {orgs.map((org) => (
                <button
                  key={org}
                  type="button"
                  onClick={() => setSelectedOrg(org)}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    selectedOrg === org
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  {org}
                </button>
              ))}
            </div>

            {/* Good first issue checkbox */}
            <label className="inline-flex items-center gap-2 text-xs font-mono text-slate-700 cursor-pointer select-none border border-slate-200 px-3 py-1.5 rounded-lg bg-slate-50/50 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={onlyGoodFirstIssues}
                onChange={(e) => setOnlyGoodFirstIssues(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span>Has Good First Issues</span>
            </label>
          </div>
        </div>

        {/* Project Results */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-2 py-16 text-center border border-dashed border-slate-200 rounded-xl">
              <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-mono text-slate-500">
                No repositories match your active search filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedOrg("ALL");
                  setOnlyGoodFirstIssues(false);
                }}
                className="mt-3 text-xs font-mono text-rose-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 hover:border-slate-300 hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {proj.organisation}
                        </span>
                        <span
                          className={`font-mono text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            proj.status === "Seeking contributors"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {proj.status}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-950 font-mono">
                        {proj.name}
                      </h2>
                    </div>
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
                      title="GitHub"
                    >
                      <GitFork className="w-4 h-4" />
                    </a>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1 text-rose-700 font-medium">
                      <CircleDot className="w-3 h-3 text-rose-500" />
                      {proj.goodFirstIssuesCount} beginner issues
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitPullRequest className="w-3 h-3 text-slate-400" />
                      {proj.mergedPrsCount} merged
                    </span>
                  </div>
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-slate-800 hover:text-rose-600 transition-colors"
                  >
                    <span>View Issues</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
