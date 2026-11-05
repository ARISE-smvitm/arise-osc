import { buildTopicLearningPlan } from "@/lib/public-knowledge";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const topic = new URL(request.url).searchParams.get("topic")?.trim() ?? "";
  if (topic.length > 80) return NextResponse.json({ error: "Topic must be 80 characters or fewer." }, { status: 400 });
  try {
    return NextResponse.json({ plan: await buildTopicLearningPlan(topic) });
  } catch (error) {
    console.error("Public knowledge plan failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Public knowledge is temporarily unavailable." }, { status: 502 });
  }
}
