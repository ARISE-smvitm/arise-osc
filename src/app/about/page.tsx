import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, GraduationCap, Mail, MessageSquare } from "lucide-react";

export default function AboutPage() {
  const contributorStages = [
    {
      step: "STAGE 01",
      title: "First Steps & Git Fluency",
      summary: "From zero open-source background to your first merged PR.",
      description:
        "Students start with small, well-scoped starter tasks labeled 'good first issue'. Assigned senior maintainers help set up the local development environment, answer questions on Discord, and walk through the pull request review process.",
      outcome: "Understanding Git workflows, conventional commits, and peer code reviews.",
    },
    {
      step: "STAGE 02",
      title: "Core Feature Engineering",
      summary: "Building software that powers campus daily life.",
      description:
        "Contributors take ownership of features across our 14 active repositories—from campus transport trackers and timetable constraint engines to LoRa environmental mesh nodes and academic search tooling.",
      outcome: "Shipping production TypeScript, Python, Go, and C++ to active users.",
    },
    {
      step: "STAGE 03",
      title: "Repository Stewardship & Mentorship",
      summary: "Guiding the next generation of campus builders.",
      description:
        "Experienced contributors step up as chapter maintainers within OSC, GDSC, IEEE CS, or ARC. They define repository roadmaps, triage issues, organize hackathons, and review incoming PRs from juniors.",
      outcome: "Developing technical leadership, architectural decision-making, and mentorship skills.",
    },
    {
      step: "STAGE 04",
      title: "Branching to Global Upstream",
      summary: "Contributing to international open-source foundations.",
      description:
        "With a verified public GitHub history, students participate in global open-source programs (Google Summer of Code, Linux Foundation, CNCF) and graduate with a durable portfolio of merged public contributions.",
      outcome: "A public, verifiable portfolio of engineering work reviewed in the open.",
    },
  ];

  const tenets = [
    {
      num: "01",
      title: "Public by Default",
      desc: "If it is built for the SMVITM community, the source code belongs to the public. No proprietary walled gardens.",
    },
    {
      num: "02",
      title: "Mentorship Over Gatekeeping",
      desc: "Every senior maintainer was once stuck on their first merge conflict. We prioritize constructive, patient code reviews.",
    },
    {
      num: "03",
      title: "Production Standards",
      desc: "Student projects deserve real engineering discipline: TypeScript, continuous integration, linting, tests, and clean architecture.",
    },
    {
      num: "04",
      title: "Institute Synergy",
      desc: "Supported by SMVITM leadership, bridging academic studies with hands-on open source software engineering.",
    },
  ];

  return (
    <div className="bg-white text-black py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-20">
        {/* Editorial Header */}
        <div className="border-b border-black/10 pb-12">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-[#E11D48] font-bold mb-4">
            <span className="sakura-petal scale-90" />
            <span>Community Charter</span>
            <span className="text-black/20">/</span>
            <span>SMVITM Bantakal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.05em] text-black leading-[0.95] max-w-4xl">
            Building software in the open at SMVITM.
          </h1>

          <p className="mt-6 text-lg sm:text-xl font-normal tracking-[-0.02em] text-[#525252] leading-[1.6] max-w-3xl">
            ARISE OSC is the collaborative open-source engineering ecosystem of Shri Madhwa Vadiraja Institute of Technology & Management. We turn student curiosity into shipped, production-grade software through peer mentorship.
          </p>

          {/* Key Community Metrics */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-black/10 pt-6 font-mono text-xs">
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase tracking-[0.1em]">Collaborating Clubs</span>
              <span className="font-bold text-black text-xl">4 Chapters</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase tracking-[0.1em]">Active Repositories</span>
              <span className="font-bold text-[#E11D48] text-xl">14 Public</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase tracking-[0.1em]">Student Builders</span>
              <span className="font-bold text-black text-xl">112+ Contributors</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase tracking-[0.1em]">Merged Pull Requests</span>
              <span className="font-bold text-black text-xl">348 Merged</span>
            </div>
          </div>
        </div>

        {/* Visual Anchor: Editorial Photograph */}
        <div className="relative group overflow-hidden border border-black/10 bg-zinc-100">
          <div className="relative h-72 sm:h-96 md:h-[400px] w-full">
            <Image
              src="/images/about/journey_origin.jpg"
              alt="SMVITM software architecture review session"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover grayscale contrast-[1.05] group-hover:grayscale-0 transition-all duration-700 ease-out"
            />
          </div>
          <div className="border-t border-black/10 p-4 bg-zinc-50 flex items-center justify-between font-mono text-xs text-zinc-600">
            <span>Engineering Architecture Review · SMVITM Innovation Lab</span>
            <span className="text-[11px] text-zinc-400 hidden sm:inline">SMVITM Campus</span>
          </div>
        </div>

        {/* The Contributor Journey */}
        <section className="space-y-10">
          <div className="border-b border-black/10 pb-6">
            <div className="font-mono text-xs uppercase tracking-[0.1em] text-[#737373] mb-2 font-medium">
              Progression
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.05em] text-black leading-[0.95]">
              The Contributor Journey
            </h2>
            <p className="mt-2 text-base text-[#525252]">
              How a student evolves from an open-source newcomer into a project maintainer at SMVITM.
            </p>
          </div>

          <div className="relative border-l-2 border-black/15 pl-6 sm:pl-10 space-y-12">
            {contributorStages.map((stage, idx) => (
              <div key={stage.step} className="relative group">
                {/* Number Badge */}
                <div className="absolute -left-[35px] sm:-left-[51px] top-0 flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center bg-black text-white font-mono text-xs sm:text-sm font-bold border-2 border-white shadow-xs">
                  {idx + 1}
                </div>

                <div className="border border-black/10 bg-[#FAF9F6] p-6 sm:p-8 transition-all duration-200 hover:border-black hover:bg-white hover:shadow-xs">
                  <div className="flex items-center gap-2 mb-2 font-mono text-xs">
                    <span className="text-[#E11D48] font-bold uppercase tracking-[0.1em]">
                      {stage.step}
                    </span>
                    <span className="text-zinc-300">·</span>
                    <span className="text-zinc-500 font-medium">
                      {stage.summary}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold tracking-[-0.03em] text-black">
                    {stage.title}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base text-[#525252] leading-[1.7]">
                    {stage.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-black/10 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
                    <span className="font-mono text-xs font-semibold text-black">
                      Outcome: {stage.outcome}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Foundational Tenets */}
        <section className="space-y-8">
          <div className="border-b border-black/10 pb-6">
            <div className="font-mono text-xs uppercase tracking-[0.1em] text-[#737373] mb-2 font-medium">
              Principles
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.05em] text-black leading-[0.95]">
              Core Tenets
            </h2>
            <p className="mt-2 text-base text-[#525252]">
              Non-negotiable values that shape every repository, event, and code review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tenets.map((tenet) => (
              <div
                key={tenet.num}
                className="border border-black/10 bg-white p-7 flex flex-col justify-between hover:border-black transition-all"
              >
                <div>
                  <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
                    TENET {tenet.num}
                  </span>
                  <h3 className="text-xl font-bold tracking-[-0.03em] text-black mt-3">
                    {tenet.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#525252] leading-[1.6]">
                    {tenet.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Stewardship & Institutional Governance */}
        <section className="space-y-8 border-t border-black/10 pt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/10 pb-6">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-[#E11D48] font-bold mb-2">
                <GraduationCap className="w-4 h-4" />
                <span>Governance & Oversight</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.04em] text-black leading-[0.95]">
                Community Stewardship & Institute Governance
              </h2>
            </div>
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
              SMVITM Institute Governance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-black/10 bg-[#FAF9F6] p-6">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-[#E11D48]">
                Student Leadership
              </span>
              <h3 className="text-lg font-bold text-black mt-1">
                Cross-Chapter Council & Maintainers
              </h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Peer stewardship across OSC, GDSC, IEEE CS, and ARC. Responsible for code review standards, issue curation, and community hack sessions.
              </p>
              <div className="mt-4 pt-4 border-t border-black/10 font-mono text-xs text-zinc-600">
                Student Technical Council · SMVITM
              </div>
            </div>

            <div className="border border-black/10 bg-[#FAF9F6] p-6">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-black">
                Institutional Oversight
              </span>
              <h3 className="text-lg font-bold text-black mt-1">
                Office of the Principal
              </h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Institutional patronage, campus lab and compute resource support, event approvals, and annual open-source contributor recognition.
              </p>
              <div className="mt-4 pt-4 border-t border-black/10 font-mono text-xs text-zinc-600">
                Shri Madhwa Vadiraja Institute of Technology & Management
              </div>
            </div>
          </div>
        </section>

        {/* Public Connect & Communication Channels */}
        <section className="space-y-6 border-t border-black/10 pt-16">
          <div className="border-b border-black/10 pb-4">
            <div className="font-mono text-xs uppercase tracking-[0.1em] text-[#737373] mb-1 font-medium">
              Get in Touch
            </div>
            <h3 className="text-2xl font-bold tracking-[-0.03em] text-black">
              Connect with the Community
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-4 border border-black/10 bg-white p-5 hover:border-black transition-all"
            >
              <MessageSquare className="w-5 h-5 text-[#E11D48] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-black group-hover:text-[#E11D48] transition-colors text-sm">
                  Developer Discord
                </div>
                <div className="text-zinc-500 mt-1 font-normal text-xs">
                  Real-time discussion, beginner help, and PR review requests.
                </div>
              </div>
            </a>

            <div className="flex items-start gap-4 border border-black/10 bg-[#FAF9F6] p-5">
              <Mail className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-black text-sm">Official Inquiries</div>
                <div className="text-zinc-600 mt-1 font-normal text-xs">
                  arise@sode-edu.in
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Join the Movement CTA */}
        <div className="border-2 border-black bg-black text-white p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-[#E11D48] font-bold mb-2">
              Start Contributing
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.04em] text-white">
              Write your first line of open source code today.
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-xl leading-relaxed">
              No prior open source background is necessary. Explore our beginner-tagged issues, join our campus Discord, and meet your student mentor.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 font-mono text-xs uppercase tracking-[0.1em]">
            <Link
              href="/#issues"
              className="bg-white text-black px-6 py-3 font-bold text-center hover:bg-[#E11D48] hover:text-white transition-colors"
            >
              Explore Open Issues
            </Link>
            <Link
              href="/knowledge-base/rulebook"
              className="border border-white/20 text-white px-6 py-3 font-bold text-center hover:border-white transition-colors"
            >
              Read Rulebook
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
