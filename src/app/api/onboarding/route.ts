import { getSessionUser } from "@/lib/session";
import { updateMember } from "@/lib/members";
import { onboardingSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

/** Save (or update) the member's community profile. Marks onboarding complete. */
export async function PATCH(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = onboardingSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid profile" }, { status: 400 });
  }

  const data = parsed.data;
  await updateMember(session.id, {
    name: data.name,
    githubHandle: data.githubHandle ? data.githubHandle.toLowerCase() : null,
    college: data.college,
    branch: data.branch,
    year: data.year,
    skills: data.skills,
    interests: data.interests,
    bio: data.bio,
    linkedin: data.linkedin,
    website: data.website,
    onboardedAt: true,
  });
  return NextResponse.json({ ok: true });
}
