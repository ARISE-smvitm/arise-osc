"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import GithubIcon from "./GithubIcon";

export default function Hero() {
  const ease = [0.16, 1, 0.3, 1] as const;
  const transition = { duration: 1, ease };

  return (
    <section className="border-b border-black/10 bg-white py-20 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-4xl">
          {/* Metadata Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.1em] text-[#737373] mb-6"
          >
            <span className="sakura-petal" />
            <span>ARISE OSC</span>
            <span className="text-black/20">/</span>
            <span>SMVITM Bantakal</span>
            <span className="text-black/20">/</span>
            <span>Build. Launch. Scale.</span>
          </motion.div>

          {/* Masked Line Reveal Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.05em] text-black leading-[0.92]">
            <span className="block overflow-hidden pb-1">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ ...transition, delay: 0.1 }}
              >
                The open source
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-1">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ ...transition, delay: 0.22 }}
              >
                community at SMVITM.
              </motion.span>
            </span>
          </h1>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.38 }}
            className="mt-8 text-lg sm:text-xl font-normal tracking-[-0.02em] text-[#525252] leading-[1.5] max-w-2xl"
          >
            A collaborative community connecting students across <strong>OSC</strong>, <strong>GDSC</strong>, <strong>IEEE CS</strong>, and <strong>ARC</strong>. We build open source projects, run hands-on workshops, and learn in public.
          </motion.p>

          {/* Action Triggers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.48 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2.5 rounded-none bg-black px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-[0.1em] text-white hover:bg-[#E11D48] transition-colors"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4 text-white/60" />
            </Link>

            <button
              type="button"
              className="inline-flex items-center gap-2.5 rounded-none border border-black/20 bg-white px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-[0.1em] text-black hover:border-black hover:bg-black/5 transition-colors"
            >
              <GithubIcon className="w-4 h-4 text-black" />
              <span>Join the community</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
