"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewNewsPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/newsroom", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title, content }) });
    if (!response.ok) { setError((await response.json()).error ?? "Unable to publish"); return; }
    router.push("/newsroom");
  }
  return <main className="min-h-screen bg-[#F7F7F7] px-6 py-20"><form onSubmit={submit} className="mx-auto max-w-3xl border border-black/10 bg-white p-8"><p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]">Admin studio</p><h1 className="mt-3 text-4xl font-bold">New dispatch</h1><div className="mt-8 grid gap-5"><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Headline" className="border-b border-black/20 py-3 text-2xl outline-none" maxLength={160} /><textarea required value={content} onChange={(event) => setContent(event.target.value)} placeholder="Markdown content" className="min-h-72 border border-black/15 p-4 font-mono text-sm outline-none" maxLength={100000} /><button className="bg-[#0A0A0A] px-5 py-3 font-mono text-xs uppercase tracking-[0.1em] text-white hover:bg-[#FF2A6D]">Publish dispatch</button>{error && <p className="text-sm text-red-600">{error}</p>}</div></form></main>;
}
