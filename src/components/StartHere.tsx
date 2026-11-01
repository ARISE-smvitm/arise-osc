"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function StartHere() {
  const steps = [
    {
      num: "01",
      title: "Pick an active project",
      desc: "Browse club repositories across Web, Systems, AI, and Hardware.",
    },
    {
      num: "02",
      title: "Claim a beginner issue",
      desc: "Find issues labeled 'good first issue' and comment to get assigned.",
    },
    {
      num: "03",
      title: "Submit your pull request",
      desc: "Push your branch, receive friendly peer review, and get merged.",
    },
  ];

  return (
    <section className="border-b border-black/10 bg-[#FAF9F6] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Minimalist Title & Link */}
          <div className="lg:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.1em] text-[#E11D48] font-bold mb-2">
              Pathway
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.05em] text-black leading-[0.95]">
              How to contribute.
            </h2>

            <p className="mt-3 text-base font-normal tracking-[-0.02em] text-[#525252]">
              Three straightforward steps from your first visit to your first merged PR.
            </p>

            <div className="mt-6">
              <Link
                href="/knowledge-base/rulebook"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] font-bold text-black hover:text-[#E11D48] transition-colors"
              >
                <span>Read Contributor Rulebook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Clean 3-Step Sequence */}
          <div className="lg:col-span-7 space-y-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex items-start gap-5 border border-black/10 bg-white p-5 sm:p-6 transition-all duration-200 hover:border-black"
              >
                <span className="font-mono text-sm sm:text-base font-bold bg-black text-white px-2.5 py-1 shrink-0">
                  {step.num}
                </span>

                <div>
                  <h3 className="text-lg font-bold tracking-[-0.02em] text-black">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#525252] leading-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
