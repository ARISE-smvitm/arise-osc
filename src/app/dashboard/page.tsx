import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import ProfileEditor from "@/components/ProfileEditor";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/login");
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return (
    <main className="min-h-screen bg-[#F7F7F7] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF2A6D]">Member dashboard</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight">Welcome, {user.name.split(" ")[0]}.</h1>
        <div className="mt-10 grid gap-6 md:grid-cols-[1fr_auto]">
          <ProfileEditor githubHandle={user.githubHandle ?? ""} image={user.image} />
          <div className="border border-black/10 bg-white p-6 text-center">
            <p className="font-mono text-xs text-black/50">{user.memberId}</p>
            <div className="mt-4 bg-white p-2"><QRCodeSVG value={`${origin}/member/${user.memberId}`} size={180} includeMargin /></div>
            <p className="mt-3 text-xs text-black/50">Scan your ARISE profile</p>
          </div>
        </div>
      </div>
    </main>
  );
}
