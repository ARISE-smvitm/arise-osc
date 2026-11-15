import { CheckCircle2 } from "lucide-react";
import { listOrgRepos, getCommunityStats, GITHUB_ORG } from "@/lib/github";
import { countCollection } from "@/lib/members";

export const dynamic = "force-dynamic";

const TENETS = [
  {
    num: "01",
    title: "Public by Default",
    desc: "If it is built for the community, it belongs in the open. No proprietary walled gardens.",
  },
  {
    num: "02",
    title: "Mentorship Over Gatekeeping",
    desc: "Every maintainer was once stuck on their first merge conflict. Reviews are constructive and patient.",
  },
  {
    num: "03",
    title: "Production Standards",
    desc: "TypeScript, CI, linting, tests. Student work is held to the same bar as professional code.",
  },
  {
    num: "04",
    title: "Learn by Shipping",
    desc: "The fastest way to learn engineering is to ship something real, review it, and do it again.",
  },
];

const STAGES = [
  {
    step: "STAGE 01",
    title: "First Steps & Git Fluency",
    summary: "From zero open source background to your first merged PR.",
    description:
      "Start with small, well-scoped starter tasks. Maintainers help with local setup, answer questions, and walk through the pull request review process.",
    outcome: "Git workflows, conventional commits, code review.",
  },
  {
    step: "STAGE 02",
    title: "Core Feature Engineering",
    summary: "Own a piece of something people use.",
    description:
      "Take ownership of features across the community's repositories — build them end-to-end with a maintainer checking your work.",
    outcome: "Shipping production-grade software to active users.",
  },
  {
    step: "STAGE 03",
    title: "Repository Stewardship",
    summary: "Guiding the next cohort of contributors.",
    description:
      "Experienced contributors step up as chapter maintainers: roadmap, triage issues, run sprints, review incoming PRs from juniors.",
    outcome: "Technical leadership and review skills.",
  },
  {
    step: "STAGE 04",
    title: "Upstream",
    summary: "From campus repos to the wider world.",
    description:
      "With a verified public GitHub history, students are ready for global open source programs and impact work beyond campus.",
    outcome: "A public, verifiable contribution history.",
  },
];

export default async function AboutPage() {
  const [repos, members, orgStats] = await Promise.all([
    listOrgRepos().catch(() => []),
    countCollection("users").catch(() => 0),
    getCommunityStats().catch(() => null),
  ]);
  const stats = [
    { label: "Chapters", value: "4" },
    { label: "Public repos", value: String(repos.length) },
    { label: "Members", value: String(members) },
    { label: "Contributions", value: String(orgStats?.totalContributions ?? 0) },
  ];

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-16">
        {/* Editorial header */}
        <div className="border-b border-[var(--border-subtle)] pb-12">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-[#FF2A6D] font-bold mb-4">
            <span className="sakura-petal scale-90" />
            <span>Community Charter</span>
            <span className="text-[var(--text-muted)]">/</span>
            <span>SMVITM Bantakal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.05em] leading-[0.95] max-w-4xl">
            Building software in the open at SMVITM.
          </h1>

          <p className="mt-6 text-lg sm:text-xl leading-[1.6] text-[var(--text-secondary)] max-w-3xl">
            ARISE OSC is the open-source community of Shri Madhwa Vadiraja Institute of Technology &amp; Management. Four student chapters build public software together — tools, workflows, and contributions anyone can learn from.
          </p>

          {/* Live metrics — pulled from the org and database, not invented */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[var(--border-subtle)] pt-6 font-mono text-xs">
            {stats.map((stat) => (
              <div key={stat.label}>
                <span className="text-[var(--text-muted)] block text-[10px] uppercase tracking-[0.1em]">{stat.label}</span>
                <span className="font-bold text-xl">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The contributor journey */}
        <section className="space-y-10">
          <div className="border-b border-[var(--border-subtle)] pb-6">
            <div className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-muted)] mb-2 font-medium">
              Progression
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.05em] leading-[0.95]">
              The Contributor Journey
            </h2>
            <p className="mt-2 text-base text-[var(--text-secondary)]">
              How a student evolves from newcomer into a project maintainer.
            </p>
          </div>

          <div className="relative border-l-2 border-[var(--border-subtle)] pl-6 sm:pl-10 space-y-12">
            {STAGES.map((stage, idx) => (
              <div key={stage.step} className="relative">
                <div className="absolute -left-[35px] sm:-left-[51px] top-0 flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center bg-[#0A0A0A] text-white font-mono text-xs sm:text-sm font-bold border-2 border-[var(--bg-primary)] dark:bg-white dark:text-[#0A0A0A]">
                  {idx + 1}
                </div>
                <div className="border border-[var(--border-subtle)] bg-[var(--surface)] p-6 sm:p-8 transition-all duration-200 hover:border-[var(--text-primary)]">
                  <div className="flex items-center gap-2 mb-2 font-mono text-xs">
                    <span className="text-[#FF2A6D] font-bold uppercase tracking-[0.1em]">{stage.step}</span>
                    <span className="text-[var(--text-muted)]">·</span>
                    <span className="text-[var(--text-muted)] font-medium">{stage.summary}</span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-[-0.03em]">{stage.title}</h3>
                  <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] leading-[1.7]">{stage.description}</p>
                  <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FF2A6D] shrink-0 mt-0.5" />
                    <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">Outcome: {stage.outcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Core tenets */}
        <section className="space-y-8">
          <div className="border-b border-[var(--border-subtle)] pb-6">
            <div className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-muted)] mb-2 font-medium">
              Principles
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.05em] leading-[0.95]">
              Core Tenets
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TENETS.map((tenet) => (
              <div key={tenet.num} className="border border-[var(--border-subtle)] bg-[var(--surface)] p-7">
                <span className="font-mono text-xs font-bold bg-[#0A0A0A] text-white px-2 py-0.5 dark:bg-white dark:text-[#0A0A0A]">
                  TENET {tenet.num}
                </span>
                <h3 className="text-xl font-bold tracking-[-0.03em] mt-3">{tenet.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-[1.6]">{tenet.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact — GitHub and the org only; no invented channels */}
        <section className="border-t border-[var(--border-subtle)] pt-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-[-0.03em]">Find us on GitHub.</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Every repo, issue, and discussion is public.</p>
          </div>
          <a
            href={`https://github.com/${GITHUB_ORG}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#FF2A6D] transition-colors dark:bg-white dark:text-[#0A0A0A] dark:hover:bg-[#FF2A6D] dark:hover:text-white"
          >
            {GITHUB_ORG} →
          </a>
        </section>
      </div>
    </div>
  );
}
