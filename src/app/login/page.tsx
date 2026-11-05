"use client";

import { signIn } from "next-auth/react";
import BrandLogo from "@/components/BrandLogo";

export default function LoginPage() {
  return (
    <main className="min-h-[70vh] bg-[#0A0A0A] px-6 py-24 text-white">
      <div className="mx-auto max-w-md border border-white/15 bg-[#1F1F1F] p-8">
        <BrandLogo size="lg" className="[&_*]:text-white" />
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]">Member access</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Enter the circle.</h1>
        <p className="mt-4 text-white/60">Sign in to manage your profile and access the community dashboard.</p>
        <div className="mt-8 grid gap-3">
          <button onClick={() => signIn("github")} className="bg-white px-4 py-3 text-sm font-bold text-black hover:bg-[#FF2A6D]">Continue with GitHub</button>
          <button onClick={() => signIn("google")} className="border border-white/20 px-4 py-3 text-sm font-bold hover:border-[#FF2A6D]">Continue with Google</button>
        </div>
      </div>
    </main>
  );
}
