import Link from "next/link";
import { BookOpen, GitBranch, Terminal, Cpu, Globe, Server, ArrowRight } from "lucide-react";

export default function KnowledgeBasePage() {
  const learningPaths = [
    {
      title: "Git & GitHub Fundamentals",
      level: "Beginner",
      modulesCount: 4,
      desc: "Branching, rebasing, resolving merge conflicts, and conventional commit etiquette.",
      icon: GitBranch,
    },
    {
      title: "First Open Source PR",
      level: "Beginner",
      modulesCount: 3,
      desc: "Navigating repository issue trackers, setting up remotes, and filing your first clean pull request.",
      icon: Terminal,
    },
    {
      title: "Fullstack Web & APIs",
      level: "Intermediate",
      modulesCount: 5,
      desc: "Next.js App Router, TypeScript type safety, server actions, and REST/GraphQL patterns.",
      icon: Globe,
    },
    {
      title: "Systems & Backend Services",
      level: "Intermediate",
      modulesCount: 4,
      desc: "Concurrent servers in Go/Rust, PostgreSQL indexing, and containerized deployments.",
      icon: Server,
    },
    {
      title: "Embedded & Edge Systems",
      level: "Intermediate",
      modulesCount: 3,
      desc: "FreeRTOS, microcontroller UART/SPI interfaces, and low-power LoRa packet protocols.",
      icon: Cpu,
    },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-600 mb-2">
              Engineering Curriculum
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Knowledge Base
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              Curated peer-written modules and blueprints guiding SMVITM students from hello-world scripts to upstream open-source maintainers.
            </p>
          </div>
          <Link
            href="/knowledge-base/rulebook"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-mono font-medium text-slate-900 hover:border-slate-950 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-rose-600" />
            <span>Read Rulebook of Open Source</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Learning Paths Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPaths.map((path) => {
            const Icon = path.icon;
            return (
              <div
                key={path.title}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-6 hover:border-slate-300 hover:bg-white transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-900 shadow-2xs">
                      <Icon className="w-5 h-5 text-rose-600" />
                    </div>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-200/60 text-slate-700">
                      {path.level}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-950">{path.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{path.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>{path.modulesCount} lessons</span>
                  <span className="text-slate-800 font-medium group-hover:text-rose-600">
                    Start Path →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
