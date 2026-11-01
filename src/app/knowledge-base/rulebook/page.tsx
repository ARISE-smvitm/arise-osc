import Link from "next/link";
import { BookOpen, GitPullRequest, ShieldCheck, Scale, Terminal, CheckCircle2 } from "lucide-react";

export default function RulebookPage() {
  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
          <Link href="/knowledge-base" className="hover:text-rose-600 transition-colors">
            Knowledge Base
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Rulebook of Open Source</span>
        </div>

        {/* Title */}
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-rose-600 mb-2">
            <span className="sakura-petal scale-75" />
            <span>Community Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            The Rulebook of Open Source
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            The engineering guidelines, PR etiquette, and code of conduct governing all software developed under the ARISE OSC umbrella at SMVITM.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12 text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-950">
              <ShieldCheck className="w-5 h-5 text-rose-600" />
              <h2>1. Code of Conduct & Academic Integrity</h2>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5 text-sm space-y-3">
              <p>
                ARISE is built on peer respect, inclusive collaboration, and honest engineering. Harassment, derogatory comments, or academic dishonesty will result in immediate revocation of repository access.
              </p>
              <ul className="space-y-2 text-xs font-mono text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Respect maintainer time and fellow student feedback.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Strictly zero copy-pasting of undisclosed proprietary or uncredited homework solutions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Write thoughtful, constructive code review comments.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-950">
              <GitPullRequest className="w-5 h-5 text-rose-600" />
              <h2>2. Pull Request & Commit Hygiene</h2>
            </div>
            <div className="text-sm space-y-3">
              <p>
                Every commit merged into `main` must compile, pass automated tests, and reflect atomic, focused modifications.
              </p>
              <div className="rounded-lg border border-slate-200 bg-slate-900 text-slate-100 p-4 font-mono text-xs space-y-2">
                <div className="text-slate-400"># Conventional Commit Format Required:</div>
                <div className="text-emerald-400">feat(auth): integrate github oauth token validation</div>
                <div className="text-emerald-400">fix(timetable): resolve constraint conflict on lab slot</div>
                <div className="text-emerald-400">docs(readme): clarify local setup instructions</div>
              </div>
              <ul className="list-disc pl-5 text-xs space-y-1.5 text-slate-600">
                <li>Never bundle unrelated changes into a single pull request.</li>
                <li>Link the target issue using GitHub keywords (e.g. `Closes #24`).</li>
                <li>Ensure branch names follow `username/issue-description` convention.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-950">
              <Scale className="w-5 h-5 text-rose-600" />
              <h2>3. Licensing & Open Source Defense</h2>
            </div>
            <div className="text-sm space-y-2">
              <p>
                All student projects under ARISE OSC are licensed under standard OSI-approved licenses (typically <strong>MIT</strong> or <strong>Apache 2.0</strong>) to ensure student code can be inspected, used, and referenced in portfolios without commercial encumbrance.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-950">
              <Terminal className="w-5 h-5 text-rose-600" />
              <h2>4. Issue Claiming & Assignment</h2>
            </div>
            <div className="text-sm space-y-3">
              <p>
                To avoid duplicate work, contributors must comment on an issue or click "Request to work on this" before writing code. Maintainers will assign the issue, granting a 7-day window to open a draft PR.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
