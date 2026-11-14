import { getSessionUser, isAdmin } from "@/lib/session";
import { deleteNews, getNewsById, updateNews } from "@/lib/members";
import { newsSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

const newsUpdateSchema = newsSchema.partial();

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const article = await getNewsById(id);
  if (!article) return NextResponse.json({ error: "Dispatch not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await getSessionUser();
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const parsed = newsUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error?.issues[0]?.message ?? "Invalid dispatch" }, { status: 400 });
  const updated = await updateNews(id, parsed.data);
  if (!updated) return NextResponse.json({ error: "Dispatch not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await getSessionUser();
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const deleted = await deleteNews(id);
  if (!deleted) return NextResponse.json({ error: "Dispatch not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
