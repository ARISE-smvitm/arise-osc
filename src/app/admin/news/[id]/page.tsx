import { notFound } from "next/navigation";
import NewsForm from "@/components/NewsForm";
import { requireRole } from "@/lib/session";
import { getNewsById } from "@/lib/members";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN", "/admin/news");
  const { id } = await params;
  const article = await getNewsById(id);
  if (!article) notFound();
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]">Admin / Newsroom / Edit</p>
        <h1 className="sr-only">Edit dispatch</h1>
        <div className="mt-4"><NewsForm id={article.id} initialTitle={article.title} initialContent={article.content} /></div>
      </div>
    </main>
  );
}
