"use client";

import { useState } from "react";
import Link from "next/link";
import { FEATURED_PROJECTS } from "@/data/mockData";
import { ArrowRight, ExternalLink, GitPullRequest, CircleDot, Users } from "lucide-react";

export default function FeaturedProjects() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const tabs = [
    { label: "All", value: "All" },
    { label: "OSC", value: "OSC" },
    { label: "GDSC", value: "GDSC" },
    { label: "IEEE CS", value: "IEEE CS" },
    { label: "ARC", value: "ARC" },
  ];

  const filteredProjects =
    activeTab === "All"
      ? FEATURED_PROJECTS
      : FEATURED_PROJECTS.filter((p) => p.organisation === activeTab);

  // Language dot colors for authentic developer feel
  const getLanguageColor = (tech: string) => {
    switch (tech.toLowerCase()) {
      case "typescript":
      case "next.js":
        return "bg-blue-500";
      case "python":
      case "fastapi":
        return "bg-amber-500";
      case "c++":
        return "bg-indigo-500";
      case "go":
        return "bg-cyan-500";
      default:
        return "bg-emerald-500";
    }
  };

  return (
    <section className="border-b border-black/10 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header with Clean Editorial Underline Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-black/10 gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.1em] text-[#737373] mb-2 font-medium">
              Open Source Repositories
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.05em] text-black leading-[0.95]">
              Featured projects
            </h2>
            <p className="mt-2 text-base font-normal tracking-[-0.02em] text-[#525252]">
              Community software actively maintained by SMVITM students.
            </p>
          </div>

          {/* Clean Editorial Underline Filter Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto pb-1 -mb-4 font-mono text-xs uppercase tracking-[0.1em]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`pb-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "border-black text-black font-bold"
                      : "border-transparent text-[#737373] hover:text-black font-medium"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Balanced Uniform Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="group flex flex-col justify-between border border-black/10 bg-white p-7 sm:p-8 transition-all duration-200 hover:border-black hover:shadow-xs"
            >
              <div>
                {/* Card Top Metadata */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.1em] bg-black text-white px-2.5 py-0.5">
                      {proj.organisation}
                    </span>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.05em] text-[#E11D48] bg-rose-50 px-2 py-0.5 border border-rose-200">
                      {proj.goodFirstIssuesCount} first issues
                    </span>
                  </div>
                  <span className="font-mono text-xs text-zinc-400">
                    {proj.status}
                  </span>
                </div>

                {/* Repo Title & Description */}
                <h3 className="text-xl sm:text-2xl font-bold tracking-[-0.03em] text-black group-hover:text-[#E11D48] transition-colors">
                  {proj.name}
                </h3>
                <p className="mt-2 text-sm text-[#525252] leading-[1.6]">
                  {proj.description}
                </p>

                {/* Tech Stack Pills with Language Color Dots */}
                <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
                  {proj.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 border border-black/10 bg-zinc-50 px-2.5 py-1 text-zinc-800 text-[11px] font-medium"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${getLanguageColor(tech)}`} />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Metrics & GitHub Link */}
              <div className="mt-8 pt-5 border-t border-black/10 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-4 text-zinc-600 text-[11px]">
                  <span>{proj.mergedPrsCount} merged PRs</span>
                  <span className="text-zinc-300">·</span>
                  <span>{proj.contributorsCount} contributors</span>
                </div>

                <a
                  href={proj.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold uppercase tracking-[0.1em] text-black hover:text-[#E11D48] transition-colors"
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Directory Footer Link */}
        <div className="mt-10 flex items-center justify-between border-t border-black/10 pt-6">
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-zinc-500">
            Showing {filteredProjects.length} of {FEATURED_PROJECTS.length} repositories
          </span>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] font-bold text-black hover:text-[#E11D48] transition-colors"
          >
            <span>View all 14 projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
