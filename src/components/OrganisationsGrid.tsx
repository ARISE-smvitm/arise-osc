import Link from "next/link";
import { ORGANISATIONS } from "@/data/mockData";
import { ArrowRight, Code2, Cpu, FolderGit2, Globe, Layers, Terminal, Users } from "lucide-react";

export default function OrganisationsGrid() {
  const chapters = [
    {
      code: "OSC",
      index: "01",
      name: "Open Source Community",
      domain: "Web Platforms & Developer Tooling",
      icon: Terminal,
      description:
        "The core cell driving open source literacy, production web systems, and upstream contributions across SMVITM.",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
      flagshipRepo: "arise-osc-platform",
      reposCount: 5,
      leads: "Tejas Nayak & Community Stewards",
    },
    {
      code: "GDSC",
      index: "02",
      name: "Google Developer Student Clubs",
      domain: "Cloud, Mobile & Applied AI",
      icon: Globe,
      description:
        "Empowering student engineers with modern web, cloud infrastructure, and AI tools to build high-impact community solutions.",
      techStack: ["Python", "FastAPI", "Flutter", "GCP"],
      flagshipRepo: "open-syllabus-ai-index",
      reposCount: 3,
      leads: "GDSC Tech Core",
    },
    {
      code: "IEEE CS",
      index: "03",
      name: "IEEE Computer Society",
      domain: "Systems, Security & Standards",
      icon: Layers,
      description:
        "Dedicated to algorithmic precision, systems programming, computing standards, and peer-reviewed technical research.",
      techStack: ["Go", "Rust", "C++", "PostgreSQL"],
      flagshipRepo: "smvitm-timetable-engine",
      reposCount: 4,
      leads: "Chapter Technical Head",
    },
    {
      code: "ARC",
      index: "04",
      name: "Automation & Robotics Club",
      domain: "Embedded Systems & Hardware",
      icon: Cpu,
      description:
        "Designing physical computing devices, autonomous rovers, LoRa telemetry nodes, and embedded firmware in the campus lab.",
      techStack: ["C++", "FreeRTOS", "ROS2", "MQTT"],
      flagshipRepo: "campus-mesh-iot",
      reposCount: 2,
      leads: "ARC Systems & Hardware Lead",
    },
  ];

  return (
    <section className="border-b border-black/10 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-black/10 gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.1em] text-[#737373] mb-2 font-medium">
              Collaborating Chapters
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.05em] text-black leading-[0.95]">
              Technical clubs
            </h2>
            <p className="mt-2 text-base font-normal tracking-[-0.02em] text-[#525252]">
              Four student technical bodies collaborating under the ARISE open source umbrella.
            </p>
          </div>
          <Link
            href="/organisations"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] font-bold text-black hover:text-[#E11D48] transition-colors"
          >
            <span>Club Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2x2 Architectural Chapter Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-black/15">
          {chapters.map((ch) => {
            const Icon = ch.icon;

            return (
              <div
                key={ch.code}
                className="group border-r border-b border-black/15 p-8 sm:p-10 flex flex-col justify-between hover:bg-[#FAF9F6] transition-colors duration-200"
              >
                <div>
                  {/* Top Index Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold uppercase tracking-[0.1em] bg-black text-white px-2.5 py-1">
                        {ch.code}
                      </span>
                      <span className="font-mono text-xs text-zinc-400">
                        Chapter {ch.index}
                      </span>
                    </div>
                    <Icon className="w-5 h-5 text-zinc-400 group-hover:text-black transition-colors" />
                  </div>

                  <h3 className="text-2xl font-bold tracking-[-0.04em] text-black">
                    {ch.name}
                  </h3>

                  <div className="font-mono text-xs text-[#E11D48] font-bold mt-1.5">
                    {ch.domain}
                  </div>

                  <p className="mt-4 text-sm font-normal text-[#525252] leading-[1.6]">
                    {ch.description}
                  </p>

                  {/* Technical Specs Ledger */}
                  <div className="mt-6 pt-5 border-t border-black/10 space-y-2.5 font-mono text-xs">
                    <div className="flex items-center justify-between text-zinc-600">
                      <span className="text-zinc-400 uppercase tracking-[0.05em] text-[11px]">Primary Stack</span>
                      <span className="font-medium text-black">{ch.techStack.join(" · ")}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-600">
                      <span className="text-zinc-400 uppercase tracking-[0.05em] text-[11px]">Flagship Repo</span>
                      <span className="font-medium text-[#E11D48]">{ch.flagshipRepo}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-600">
                      <span className="text-zinc-400 uppercase tracking-[0.05em] text-[11px]">Lead Stewards</span>
                      <span className="font-medium text-black">{ch.leads}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-8 pt-5 border-t border-black/10 flex items-center justify-between font-mono text-xs uppercase tracking-[0.1em]">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-zinc-400" />
                    {ch.reposCount} active repos
                  </span>
                  <Link
                    href={`/organisations#${ch.code.toLowerCase().replace(/\s+/g, "-")}`}
                    className="font-bold text-black hover:text-[#E11D48] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>View Chapter</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
