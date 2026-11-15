import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CLUBS = [
  {
    code: "OSC",
    name: "Open Source Community",
    mandate: "The open source chapter — Git fluency, public contributions and upstream work.",
    domains: ["Open Source", "Git & GitHub", "Community"],
  },
  {
    code: "GDSC",
    name: "Google Developer Student Clubs",
    mandate: "The Google developer chapter — web, cloud and mobile, shipped with students.",
    domains: ["Web", "Cloud", "Mobile", "ML"],
  },
  {
    code: "IEEE CS",
    name: "IEEE Computer Society",
    mandate: "The computer society chapter — systems, algorithms and research.",
    domains: ["Systems", "Algorithms", "Research"],
  },
  {
    code: "ARC",
    name: "Automation & Robotics Club",
    mandate: "The robotics chapter — embedded systems, IoT and physical computing.",
    domains: ["Robotics", "Embedded", "IoT"],
  },
];

export default function OrganisationsPage() {
  return (
    <div className="py-12 bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--border-subtle)] pb-8">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#FF2A6D]">
              Chapters
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)]">
              Clubs
            </h1>
            <p className="mt-2 text-base text-[var(--text-secondary)]">
              The four student chapters behind ARISE — one open source community, one GitHub org, one door.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-primary)] border-b-2 border-[#FF2A6D] pb-1 hover:text-[#FF2A6D] transition-colors"
          >
            All club projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {CLUBS.map((club) => (
            <article
              key={club.code}
              className="group flex flex-col border border-[var(--border-subtle)] bg-[var(--surface)] p-6 hover:border-[#FF2A6D] transition-colors"
            >
              <span className="self-start rounded bg-[#0A0A0A] px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-white dark:bg-white dark:text-[#0A0A0A]">
                {club.code}
              </span>
              <h2 className="mt-4 text-base font-bold leading-snug tracking-tight text-[var(--text-primary)]">
                {club.name}
              </h2>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                {club.mandate}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--border-subtle)] pt-4">
                {club.domains.map((domain) => (
                  <span
                    key={domain}
                    className="rounded bg-[var(--surface-raised)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[var(--text-muted)]">
          All four chapters ship through the same GitHub org — projects at /projects, events at /events
        </p>
      </div>
    </div>
  );
}
