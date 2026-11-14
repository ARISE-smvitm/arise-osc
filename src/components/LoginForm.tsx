"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import BrandLogo from "@/components/BrandLogo";
import GithubIcon from "@/components/GithubIcon";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { refreshSessionCookie, signInWithGithub } from "@/lib/firebase-signin";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  // Firebase persists the user locally. If the httpOnly cookie expired but the
  // Firebase session is still valid, re-establish the cookie without a popup.
  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (user) => {
      if (!user) return;
      const restored = await refreshSessionCookie();
      if (restored) {
        router.push(callbackUrl);
        router.refresh();
      }
    });
    return unsubscribe;
  }, [callbackUrl, router]);

  async function handleSignIn() {
    setPending(true);
    setError("");
    const result = await signInWithGithub();
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <main className="flex min-h-[70vh] items-center bg-[var(--bg-primary)] px-6 py-16 text-[var(--text-primary)]">
      <div className="mx-auto w-full max-w-md border border-[var(--border-subtle)] bg-[var(--surface)] p-8 shadow-sm">
        <BrandLogo size="lg" className="[&_*]:text-[var(--text-primary)]" />
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]">Member access</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Enter the circle.</h1>
        <p className="mt-4 text-[var(--text-secondary)]">Sign in with your GitHub account to manage your profile and access the community dashboard.</p>
        <div className="mt-8 grid gap-3">
          <button
            type="button"
            onClick={handleSignIn}
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 bg-[#0A0A0A] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#FF2A6D] hover:text-white disabled:cursor-wait disabled:opacity-70 dark:bg-white dark:text-[#0A0A0A] dark:hover:bg-[#FF2A6D] dark:hover:text-white"
          >
            <GithubIcon className="h-4 w-4" />
            <span>{pending ? "Opening GitHub…" : "Continue with GitHub"}</span>
          </button>
          {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
      </div>
    </main>
  );
}
