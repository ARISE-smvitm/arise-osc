import { getSessionUser, isAdmin } from "@/lib/session";
import { createEvent, listUpcomingEvents } from "@/lib/events";
import { eventSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await listUpcomingEvents(100));
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error?.issues[0]?.message ?? "Invalid event" }, { status: 400 });
  const id = await createEvent(parsed.data);
  return NextResponse.json({ id, ...parsed.data }, { status: 201 });
}
