"use client";

import { useState } from "react";

export default function ProfileEditor({ githubHandle, image }: { githubHandle: string; image: string | null }) {
  const [handle, setHandle] = useState(githubHandle);
  const [imageUrl, setImageUrl] = useState(image ?? "");
  const [message, setMessage] = useState("");
  async function save(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/profile", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ githubHandle: handle, image: imageUrl }) });
    setMessage(response.ok ? "Profile saved." : (await response.json()).error ?? "Could not save.");
  }
  return (
    <form onSubmit={save} className="grid gap-4 border border-[var(--border-subtle)] bg-[var(--surface)] p-6">
      <label className="grid gap-2 text-sm font-semibold text-[var(--text-primary)]">GitHub handle<input value={handle} onChange={(event) => setHandle(event.target.value)} className="border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-2 font-normal text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#FF2A6D]" maxLength={39} /></label>
      <label className="grid gap-2 text-sm font-semibold text-[var(--text-primary)]">Profile image URL<input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-2 font-normal text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#FF2A6D]" type="url" /></label>
      <button className="bg-[#0A0A0A] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#FF2A6D] dark:bg-white dark:text-[#0A0A0A] dark:hover:bg-[#FF2A6D] dark:hover:text-white">Save profile</button>
      {message && <p className="font-mono text-xs text-[#FF2A6D]">{message}</p>}
    </form>
  );
}
