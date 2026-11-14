import NewsForm from "@/components/NewsForm";
import { requireRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function NewNewsPage() {
  await requireRole("ADMIN", "/newsroom/new");
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-6 py-14">
      <div className="mx-auto max-w-3xl"><NewsForm /></div>
    </main>
  );
}
