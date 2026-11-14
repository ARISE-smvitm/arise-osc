"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Create (POST /api/newsroom) or edit (PATCH /api/news/[id]) an ARISE dispatch. */
export default function NewsForm({ id, initialTitle = "", initialContent = "" }: { id?: string; initialTitle?: string; initialContent?: string }) {
  const router = useRouter();
  const editing = Boolean(id);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch(editing ? `/api/news/${id}` : "/api/newsroom", {
      method: editing ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setPending(false);
    if (!response.ok) {
      setError((await response.json().catch(() => null))?.error ?? "Unable to save this dispatch");
      return;
    }
    router.push(editing ? "/admin/news" : "/newsroom");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="max-w-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]">{editing ? "Edit dispatch" : "Admin studio"}</p>
      <h1 className="mt-3 text-4xl font-bold">{editing ? "Refine the dispatch" : "New dispatch"}</h1>
      <div className="mt-8 grid gap-5">
        <input
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Headline"
          className="border-b border-[var(--border-subtle)] py-3 text-2xl outline-none"
          maxLength={160}
        />
        <textarea
          required
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Markdown content"
          className="min-h-72 border border-[var(--border-subtle)] p-4 font-mono text-sm outline-none"
          maxLength={100000}
        />
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="bg-[#0A0A0A] px-5 py-3 font-mono text-xs uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#FF2A6D] disabled:cursor-wait disabled:opacity-70 dark:bg-white dark:text-[#0A0A0A] dark:hover:bg-[#FF2A6D] dark:hover:text-white"
        >
          {pending ? "Saving…" : editing ? "Save changes" : "Publish dispatch"}
        </button>
      </div>
    </form>
  );
}
