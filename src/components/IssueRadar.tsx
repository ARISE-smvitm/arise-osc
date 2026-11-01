"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CircleDot, ExternalLink, HelpCircle, User, Sparkles } from "lucide-react";

interface OpenIssue {
  id: string;
  number: number;
  repo: string;
  org: "OSC" | "GDSC" | "IEEE CS" | "ARC";
  title: string;
  category: "TypeScript" | "Python" | "Go" | "C++" | "Documentation";
  mentor: string;
  mentorHandle: string;
  url: string;
  difficulty: "First Timer" | "Beginner" | "Intermediate";
}

const LIVE_ISSUES: OpenIssue[] = [
  {
    id: "issue-1",
    number: 48,
    repo: "arise-osc-platform",
    org: "OSC",
    title: "Add dark mode token fallback to campus shuttle tracker component",
    category: "TypeScript",
    mentor: "Tejas Nayak",
    mentorHandle: "@tejasnayak",
    url: "https://github.com/ARISE-smvitm/arise-osc/issues",
    difficulty: "First Timer",
  },
  {
    id: "issue-2",
    number: 19,
    repo: "campus-mesh-iot",
    org: "ARC",
    title: "Implement LoRa packet parser for DHT22 humidity sensor payload",
    category: "C++",
    mentor: "Rakshith Shenoy",
    mentorHandle: "@rakshith-arc",
    url: "https://github.com/ARISE-smvitm/campus-mesh-iot/issues",
    difficulty: "Beginner",
  },
  {
    id: "issue-3",
    number: 31,
    repo: "smvitm-timetable-engine",
    org: "IEEE CS",
    title: "Implement semester elective conflict resolution filter in timetable solver",
    category: "Go",
    mentor: "Pratheek Rao",
    mentorHandle: "@pratheek-cs",
    url: "https://github.com/ARISE-smvitm/timetable-engine/issues",
    difficulty: "Beginner",
  },
  {
    id: "issue-4",
    number: 14,
    repo: "open-syllabus-ai-index",
    org: "GDSC",
    title: "Add fuzzy keyword search over previous VTU question paper PDFs",
    category: "Python",
    mentor: "Kavya Bhat",
    mentorHandle: "@kavya-bhat",
    url: "https://github.com/ARISE-smvitm/open-syllabus-index/issues",
    difficulty: "First Timer",
  },
  {
    id: "issue-5",
    number: 12,
    repo: "arise-osc-platform",
    org: "OSC",
    title: "Document local setup guide for Windows PowerShell and WSL2 users",
    category: "Documentation",
    mentor: "Tejas Nayak",
    mentorHandle: "@tejasnayak",
    url: "https://github.com/ARISE-smvitm/arise-osc/issues",
    difficulty: "First Timer",
  },
];

export default function IssueRadar() {
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "TypeScript", "Python", "Go", "C++", "Documentation"];

  const filteredIssues =
    filter === "All"
      ? LIVE_ISSUES
      : LIVE_ISSUES.filter((issue) => issue.category === filter);

  return (
    <section className="border-b border-black/10 bg-[#FAF9F6] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 pb-6 border-b border-black/10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] text-[#E11D48] font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse" />
              <span>Issue Radar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.05em] text-black leading-[0.95]">
              Good first issues ready to claim
            </h2>
            <p className="mt-2 text-base font-normal tracking-[-0.02em] text-[#525252]">
              Hand-picked starter tasks with assigned student mentors ready to help you set up.
            </p>
          </div>

          {/* Interactive Technology Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-white border border-black/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 font-mono text-xs uppercase tracking-[0.05em] font-semibold transition-all ${
                  filter === cat
                    ? "bg-black text-white"
                    : "text-zinc-600 hover:text-black hover:bg-zinc-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dense Technical Issue Ledger */}
        <div className="border border-black/10 bg-white divide-y divide-black/10 shadow-xs">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="group p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50/70 transition-colors"
            >
              {/* Left Details */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-xs">
                  <span className="bg-black text-white px-2 py-0.5 font-bold uppercase tracking-[0.1em] text-[10px]">
                    {issue.org}
                  </span>
                  <span className="text-zinc-500 font-medium">
                    {issue.repo}
                  </span>
                  <span className="text-zinc-300">·</span>
                  <span className="text-[#E11D48] font-bold">
                    #{issue.number}
                  </span>
                  <span className="bg-rose-50 text-[#E11D48] border border-rose-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em]">
                    {issue.difficulty}
                  </span>
                </div>

                <a
                  href={issue.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base sm:text-lg font-bold tracking-[-0.02em] text-black group-hover:text-[#E11D48] transition-colors inline-flex items-center gap-2"
                >
                  <span>{issue.title}</span>
                </a>

                <div className="mt-2.5 flex flex-wrap items-center gap-4 font-mono text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1.5 text-zinc-700">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    Mentor: {issue.mentor} ({issue.mentorHandle})
                  </span>
                  <span>Category: {issue.category}</span>
                </div>
              </div>

              {/* Right CTA */}
              <div className="shrink-0 flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-black/5">
                <a
                  href={issue.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-black px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] font-bold text-white hover:bg-[#E11D48] transition-colors"
                >
                  <span>Claim on GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Helper Note Banner */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between border border-dashed border-black/20 bg-white p-4 font-mono text-xs text-zinc-600 gap-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#E11D48] shrink-0" />
            <span>How to claim: Simply comment on the GitHub issue saying you want to work on it.</span>
          </div>
          <Link
            href="/knowledge-base/rulebook"
            className="font-bold text-black hover:text-[#E11D48] uppercase tracking-[0.1em] inline-flex items-center gap-1 shrink-0"
          >
            <span>Read Rulebook</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
