"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

interface Me {
  memberId: string;
  name: string;
  image: string | null;
}

export default function ProfileNav() {
  const [me, setMe] = useState<Me | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data: { user: Me | null }) => {
        if (!cancelled) setMe(data.user);
      })
      .catch(() => {
        if (!cancelled) setMe(null);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const label = me ? `${me.name} — open your profile` : "Open member profile";

  return (
    <Link
      href={me ? "/profile" : "/login"}
      prefetch={false}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--surface)] bg-[var(--surface)] p-0.5 shadow-sm ring-1 ring-[var(--border-subtle)] transition hover:border-[#FF2A6D] hover:ring-[#FF2A6D]"
    >
      {me?.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- small external avatar
        <img className="h-full w-full rounded-full object-cover" src={me.image} alt="" referrerPolicy="no-referrer" />
      ) : (
        <UserRound className="h-5 w-5 text-[var(--text-secondary)]" aria-hidden="true" />
      )}
      <span className="sr-only">{loaded ? label : "Loading profile"}</span>
    </Link>
  );
}
