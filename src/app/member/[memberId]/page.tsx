import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MemberPage({ params }: { params: Promise<{ memberId: string }> }) {
  const { memberId } = await params;
  const user = await prisma.user.findUnique({ where: { memberId }, select: { name: true, image: true, githubHandle: true, contributionScore: true, memberId: true } });
  if (!user) notFound();
  return <main className="min-h-screen bg-[#0A0A0A] px-6 py-24 text-white"><div className="mx-auto max-w-xl border border-white/15 bg-[#1F1F1F] p-8"><p className="font-mono text-xs text-[#FF2A6D]">{user.memberId}</p><h1 className="mt-4 text-5xl font-bold">{user.name}</h1>{user.githubHandle && <p className="mt-3 text-white/60">@{user.githubHandle}</p>}<div className="mt-12 border-t border-white/10 pt-5"><p className="font-mono text-xs uppercase text-white/40">Contribution score</p><p className="mt-2 text-4xl font-bold text-[#FF2A6D]">{user.contributionScore}</p></div></div></main>;
}
