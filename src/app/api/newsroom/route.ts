import { isAdmin, getSessionUser } from "@/lib/session";
import { createNews, listNews } from "@/lib/members";
import { newsSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function GET() {
  const items = await listNews(100);
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = newsSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid article" }, { status: 400 });
  const id = await createNews({ ...parsed.data, authorId: session.id, authorName: session.name });
  return NextResponse.json({ id, ...parsed.data }, { status: 201 });
}
