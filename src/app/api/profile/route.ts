import { getSessionUser } from "@/lib/session";
import { updateMember } from "@/lib/members";
import { profileSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid profile" }, { status: 400 });
  const handle = parsed.data.githubHandle ? parsed.data.githubHandle.toLowerCase() : "";
  await updateMember(session.id, {
    githubHandle: handle || null,
    image: parsed.data.image || null,
  });
  return NextResponse.json({ memberId: session.memberId, githubHandle: handle || null, image: parsed.data.image || null });
}
