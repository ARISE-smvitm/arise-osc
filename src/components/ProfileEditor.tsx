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
    <form onSubmit={save} className="grid gap-4 border border-black/10 bg-white p-6">
      <label className="grid gap-2 text-sm font-semibold">GitHub handle<input value={handle} onChange={(event) => setHandle(event.target.value)} className="border border-black/15 px-3 py-2 font-normal" maxLength={39} /></label>
      <label className="grid gap-2 text-sm font-semibold">Profile image URL<input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="border border-black/15 px-3 py-2 font-normal" type="url" /></label>
      <button className="bg-[#0A0A0A] px-4 py-3 text-sm font-bold text-white hover:bg-[#FF2A6D]">Save profile</button>
      {message && <p className="font-mono text-xs text-[#FF2A6D]">{message}</p>}
    </form>
  );
}
