"use client";

import Link from "next/link";
import { demoProfiles } from "@/lib/demo-profiles";

export default function ProfileNav() {
  const profile = demoProfiles[0];
  return (
    <Link
      href="/profile"
      prefetch={false}
      aria-label="Open member profile"
      title={`${profile.name} (${profile.id})`}
      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--surface)] p-0.5 shadow-sm ring-1 ring-[var(--border-subtle)] transition hover:border-[#FF2A6D] hover:ring-[#FF2A6D]"
    >
      <span className="profile-nav-avatar" role="img" aria-label={`${profile.name} developer avatar`}>{profile.avatar}</span>
    </Link>
  );
}
