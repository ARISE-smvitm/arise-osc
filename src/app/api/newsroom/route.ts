import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { newsSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function GET() {
  const items = await prisma.newsItem.findMany({ orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" || !session.user.email) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = newsSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid article" }, { status: 400 });
  const author = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!author) return NextResponse.json({ error: "Author not found" }, { status: 404 });
  const item = await prisma.newsItem.create({ data: { ...parsed.data, authorId: author.id } });
  return NextResponse.json(item, { status: 201 });
}
