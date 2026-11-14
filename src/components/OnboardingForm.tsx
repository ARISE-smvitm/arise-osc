"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SessionMember } from "@/lib/session";

const inputClass =
  "w-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#FF2A6D]";

function TagList({ name, values, onChange }: { name: string; values: string[]; onChange: (values: string[]) => void }) {
  const [raw, setRaw] = useState(values.join(", "));
  return (
    <label className="grid gap-1.5 text-sm">
      {name}
      <input
        className={inputClass}
        value={raw}
        placeholder="React, TypeScript, Node.js"
        onChange={(event) => {
          setRaw(event.target.value);
          onChange(event.target.value.split(",").map((part) => part.trim()).filter(Boolean));
        }}
        onBlur={() => setRaw(values.join(", "))}
      />
      <span className="text-xs text-[var(--text-muted)]">Comma-separated, up to 20 tags.</span>
    </label>
  );
}

export default function OnboardingForm({ initial }: { initial: SessionMember | null }) {
  const router = useRouter();
  const editing = Boolean(initial?.onboardedAt);
  const [name, setName] = useState(initial?.name ?? "");
  const [githubHandle, setGithubHandle] = useState(initial?.githubHandle ?? "");
  const [college, setCollege] = useState(initial?.college ?? "");
  const [branch, setBranch] = useState(initial?.branch ?? "");
  const [year, setYear] = useState(initial?.year?.toString() ?? "");
  const [skills, setSkills] = useState<string[]>(initial?.skills ?? []);
  const [interests, setInterests] = useState<string[]>(initial?.interests ?? []);
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [linkedin, setLinkedin] = useState(initial?.linkedin ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/onboarding", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        githubHandle,
        college,
        branch,
        year: year.trim() === "" ? null : Number(year),
        skills,
        interests,
        bio,
        linkedin,
        website,
      }),
    });
    setPending(false);
    if (!response.ok) {
      setError((await response.json().catch(() => null))?.error ?? "Could not save your profile.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-5 border border-[var(--border-subtle)] bg-[var(--surface)] p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm sm:col-span-2">Display name<input required className={inputClass} value={name} onChange={(event) => setName(event.target.value)} maxLength={80} /></label>
        <label className="grid gap-1.5 text-sm sm:col-span-2">GitHub handle<input className={inputClass} value={githubHandle} onChange={(event) => setGithubHandle(event.target.value)} placeholder="your-github-username" maxLength={39} /><span className="text-xs text-[var(--text-muted)]">Used to match your open source contributions on the leaderboard.</span></label>
        <label className="grid gap-1.5 text-sm">College<input className={inputClass} value={college} onChange={(event) => setCollege(event.target.value)} placeholder="SMVITM" maxLength={160} /></label>
        <label className="grid gap-1.5 text-sm">Branch / department<input className={inputClass} value={branch} onChange={(event) => setBranch(event.target.value)} placeholder="CSE" maxLength={80} /></label>
        <label className="grid gap-1.5 text-sm">Year of study<input className={inputClass} type="number" min={1} max={10} inputMode="numeric" value={year} onChange={(event) => setYear(event.target.value)} placeholder="2" /></label>
      </div>
      <TagList name="Skills" values={skills} onChange={setSkills} />
      <TagList name="Interests" values={interests} onChange={setInterests} />
      <label className="grid gap-1.5 text-sm">Short bio<textarea className={`${inputClass} min-h-20`} value={bio} onChange={(event) => setBio(event.target.value)} maxLength={280} placeholder="What are you building, learning or curious about?" /><span className="text-xs text-[var(--text-muted)]">{bio.length}/280</span></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">LinkedIn<input className={inputClass} type="url" value={linkedin} onChange={(event) => setLinkedin(event.target.value)} placeholder="https://linkedin.com/in/…" maxLength={200} /></label>
        <label className="grid gap-1.5 text-sm">Personal site<input className={inputClass} type="url" value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://…" maxLength={200} /></label>
      </div>
      {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="bg-[#FF2A6D] px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.1em] text-white transition-colors hover:opacity-90 disabled:cursor-wait disabled:opacity-70">
          {pending ? "Saving…" : editing ? "Save changes" : "Complete setup"}
        </button>
        <a href="/dashboard" className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-secondary)] hover:text-[#FF2A6D]">Skip for now</a>
      </div>
    </form>
  );
}
