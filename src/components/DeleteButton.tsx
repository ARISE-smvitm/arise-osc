"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

/** Small destructive-action button: DELETE fetch + refresh (or redirect). */
export default function DeleteButton({ url, confirmMessage, redirectTo, label = "Delete" }: { url: string; confirmMessage: string; redirectTo?: string; label?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!window.confirm(confirmMessage)) return;
    setPending(true);
    const response = await fetch(url, { method: "DELETE" });
    setPending(false);
    if (!response.ok) {
      window.alert((await response.json().catch(() => null))?.error ?? "Delete failed. Please try again.");
      return;
    }
    if (redirectTo) {
      router.push(redirectTo);
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-red-600 transition-colors hover:border-red-600 hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
    >
      <Trash2 size={12} aria-hidden="true" /> {pending ? "Deleting…" : label}
    </button>
  );
}
