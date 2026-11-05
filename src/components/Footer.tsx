import Link from "next/link";
import { ExternalLink } from "lucide-react";
import BrandLogo from "./BrandLogo";
import GithubIcon from "./GithubIcon";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#0A0A0A] py-16 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                ARISE
              </span>
              <span className="text-white/30">/</span>
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-white/70 bg-white/10 px-1.5 py-0.5 border border-white/10">
                OSC
              </span>
              <span className="sakura-petal" />
            </div>
            <p className="text-xs font-normal tracking-[-0.02em] text-zinc-400 leading-[1.6]">
              The open source community at Shri Madhwa Vadiraja Institute of Technology & Management (SMVITM), Bantakal.
            </p>
          </div>

          {/* Links: Platform */}
          <div className="space-y-3 font-mono text-xs uppercase tracking-[0.1em]">
            <h4 className="font-bold text-white">Community</h4>
            <ul className="space-y-2 text-zinc-400 font-normal">
              <li>
                <Link href="/projects" prefetch={false} className="hover:text-white transition-colors">
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link href="/events" prefetch={false} className="hover:text-white transition-colors">
                  Events & Hackathons
                </Link>
              </li>
              <li>
                <Link href="/newsroom" prefetch={false} className="hover:text-white transition-colors">
                  Newsroom
                </Link>
              </li>
              <li>
                <Link href="/organisations" prefetch={false} className="hover:text-white transition-colors">
                  Clubs (OSC, GDSC, IEEE, ARC)
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Resources */}
          <div className="space-y-3 font-mono text-xs uppercase tracking-[0.1em]">
            <h4 className="font-bold text-white">Standards</h4>
            <ul className="space-y-2 text-zinc-400 font-normal">
              <li>
                <Link href="/knowledge-base/rulebook" prefetch={false} className="hover:text-white transition-colors">
                  Rulebook of Open Source
                </Link>
              </li>
              <li>
                <Link href="/knowledge-base" prefetch={false} className="hover:text-white transition-colors">
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/about" prefetch={false} className="hover:text-white transition-colors">
                  Faculty & Core Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: External */}
          <div className="space-y-3 font-mono text-xs uppercase tracking-[0.1em]">
            <h4 className="font-bold text-white">Links</h4>
            <ul className="space-y-2 text-zinc-400 font-normal">
              <li>
                <a
                  href="https://github.com/ARISE-smvitm"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://sode-edu.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>SMVITM Website</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>Discord</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between font-mono text-xs uppercase tracking-[0.1em] text-zinc-500 gap-4">
          <div>
            © 2026 ARISE Open Source Community. SMVITM Bantakal.
          </div>
          <div>
            Built with open source craft.
          </div>
        </div>
      </div>
    </footer>
  );
}
