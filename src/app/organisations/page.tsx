import { ORGANISATIONS, FEATURED_PROJECTS } from "@/data/mockData";
import { FolderGit2, Calendar, Users, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function OrganisationsPage() {
  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-600 mb-2">
            Technical Ecosystem
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
            Member Organisations
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-2xl">
            The four technical clubs driving student innovation, systems engineering, and open-source contributions across the SMVITM campus.
          </p>
        </div>

        {/* Clubs List */}
        <div className="mt-10 space-y-12">
          {ORGANISATIONS.map((org) => {
            const orgProjects = FEATURED_PROJECTS.filter((p) => p.organisation === org.code);

            return (
              <div
                key={org.code}
                id={org.code.toLowerCase().replace(/\s+/g, "-")}
                className="scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50/40 p-8 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-bold px-2.5 py-1 rounded bg-slate-950 text-white">
                        {org.code}
                      </span>
                      <h2 className="text-2xl font-bold text-slate-950">{org.name}</h2>
                    </div>
                    <p className="text-sm font-mono text-rose-700 font-medium">{org.tagline}</p>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-3xl">
                      {org.description}
                    </p>
                  </div>

                  <div className="flex md:flex-col items-end gap-3 shrink-0">
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                      <span className="flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                        {org.projectsCount} Repos
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {org.eventsCount} Events
                      </span>
                    </div>
                  </div>
                </div>

                {/* Club Repositories */}
                <div className="mt-6">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mb-4">
                    Active Club Repositories
                  </h3>
                  {orgProjects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {orgProjects.map((p) => (
                        <div
                          key={p.id}
                          className="rounded-lg border border-slate-200 bg-white p-4 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-xs font-bold text-slate-900">
                                {p.name}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                {p.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                            <span>{p.goodFirstIssuesCount} beginner issues</span>
                            <a
                              href={p.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-800 hover:text-rose-600 flex items-center gap-1"
                            >
                              <span>GitHub</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-slate-400">
                      Additional repositories in review.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
