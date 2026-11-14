"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { onAuthStateChanged, type User } from "firebase/auth";
import BrandLogo from "./BrandLogo";
import GithubIcon from "./GithubIcon";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { signOutEverywhere } from "@/lib/firebase-signin";
import ProfileNav from "./ProfileNav";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    return onAuthStateChanged(getFirebaseAuth(), setFirebaseUser);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data: { user: { role?: string } | null }) => {
        if (!cancelled) setIsAdmin(data?.user?.role === "ADMIN");
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, [firebaseUser]);

  async function handleSignOut() {
    await signOutEverywhere();
    setMobileMenuOpen(false);
    router.refresh();
  }

  const navLinks = [
    { name: "Projects", href: "/projects" },
    { name: "Events", href: "/events" },
    { name: "News", href: "/newsroom" },
    { name: "Learn", href: "/learn" },
    { name: "Clubs", href: "/organisations" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/85 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-6 px-4 sm:px-6">
        <BrandLogo size="md" className="[&_*]:text-[var(--text-primary)]" />

        {/* Desktop Nav */}
        <nav className="hidden items-center justify-center gap-6 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              prefetch={false}
              className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-secondary)] hover:text-[#FF2A6D] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* GitHub Sign-in */}
        <div className="hidden items-center justify-end gap-2 sm:flex">
          <ThemeToggle />
          <ProfileNav />
          {firebaseUser ? (
            <div className="hidden items-center gap-2 lg:flex">
              {isAdmin && (
                <Link
                  href="/admin"
                  prefetch={false}
                  className="inline-flex items-center gap-2 rounded-full border border-[#FF2A6D]/50 px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] font-bold text-[#FF2A6D] transition-colors hover:bg-[#FF2A6D] hover:text-white"
                >
                  <span>Admin</span>
                </Link>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] font-bold text-[var(--text-primary)] transition-colors hover:border-[#FF2A6D] hover:text-[#FF2A6D]"
              >
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              prefetch={false}
              className="hidden items-center gap-2 rounded-full bg-[#0A0A0A] px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] font-bold text-white transition-colors hover:bg-[#FF2A6D] dark:bg-white dark:text-[#0A0A0A] lg:inline-flex"
            >
              <GithubIcon className="w-3.5 h-3.5 text-white" />
              <span>Sign in with GitHub</span>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center justify-end gap-2 md:hidden">
          <ThemeToggle />
          <ProfileNav />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full p-2 text-[var(--text-primary)] hover:bg-[var(--surface)] hover:text-[#FF2A6D]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[var(--border-subtle)] bg-[var(--surface)] px-4 pb-5 pt-2 md:hidden">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                prefetch={false}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-secondary)] hover:bg-[var(--cinematic-blue-soft)] hover:text-[var(--text-primary)]"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-2 border-t border-black/10">
            {firebaseUser ? (
              <div className="grid gap-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    prefetch={false}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-[#FF2A6D] px-4 py-2.5 font-mono text-xs uppercase tracking-[0.1em] font-bold text-[#FF2A6D] transition-colors hover:bg-[#FF2A6D] hover:text-white"
                  >
                    <span>Admin console</span>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  prefetch={false}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-black/15 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.1em] font-bold text-[var(--text-primary)] transition-colors hover:border-[#FF2A6D] hover:text-[#FF2A6D] dark:border-white/15"
                >
                  <span>Open dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0A0A0A] px-4 py-2.5 font-mono text-xs uppercase tracking-[0.1em] font-bold text-white transition-colors hover:bg-[#FF2A6D] dark:bg-white dark:text-[#0A0A0A]"
                >
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                prefetch={false}
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0A0A0A] px-4 py-2.5 font-mono text-xs uppercase tracking-[0.1em] font-bold text-white transition-colors hover:bg-[#FF2A6D] dark:bg-white dark:text-[#0A0A0A]"
              >
                <GithubIcon className="w-4 h-4 text-white" />
                <span>Sign in with GitHub</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
