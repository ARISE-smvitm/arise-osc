"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";
import GithubIcon from "./GithubIcon";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Projects", href: "/projects" },
    { name: "Events", href: "/events" },
    { name: "News", href: "/newsroom" },
    { name: "Guides", href: "/knowledge-base" },
    { name: "Clubs", href: "/organisations" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <BrandLogo size="md" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-mono text-xs uppercase tracking-[0.1em] text-[#525252] hover:text-black transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* GitHub Sign-in */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-none bg-black px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] font-bold text-white hover:bg-[#E11D48] transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5 text-white" />
            <span>Sign in with GitHub</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-black hover:text-[#E11D48]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-black/10 bg-white px-4 pt-2 pb-5 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-[#525252] hover:bg-black/5"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-2 border-t border-black/10">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-none bg-black px-4 py-2.5 font-mono text-xs uppercase tracking-[0.1em] font-bold text-white hover:bg-[#E11D48] transition-colors"
            >
              <GithubIcon className="w-4 h-4 text-white" />
              <span>Sign in with GitHub</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
