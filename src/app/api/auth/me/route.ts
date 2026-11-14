import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";

/** Lightweight identity probe for client components (navbar, panels). Never 401s. */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: {
      memberId: user.memberId,
      name: user.name,
      image: user.image,
      role: user.role,
      githubHandle: user.githubHandle,
      contributionScore: user.contributionScore,
      onboardedAt: user.onboardedAt?.toISOString() ?? null,
    },
  });
}
