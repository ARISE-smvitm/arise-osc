import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { profileSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid profile" }, { status: 400 });
  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: { githubHandle: parsed.data.githubHandle || null, image: parsed.data.image || null },
    select: { memberId: true, githubHandle: true, image: true },
  });
  return NextResponse.json(user);
}
