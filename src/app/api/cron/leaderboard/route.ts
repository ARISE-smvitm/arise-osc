import { applyContributionScores } from "@/lib/members";
import { getLiveContributionScores } from "@/lib/github";
import { getDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Vercel Cron (daily) — persists GitHub contribution scores onto member documents. */
export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!getDb()) return NextResponse.json({ error: "Firestore is not configured" }, { status: 500 });

  const scores = await getLiveContributionScores();
  const { updated } = await applyContributionScores(scores);
  return NextResponse.json({ contributors: scores.size, updated });
}
