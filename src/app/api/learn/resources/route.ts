import { fetchGithubReadme, searchGithubResources } from "@/lib/github-resources";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() || "awesome open source";
  const repository = new URL(request.url).searchParams.get("repository")?.trim();
  if (repository) {
    try {
      return NextResponse.json({ source: "github", readme: await fetchGithubReadme(repository) });
    } catch (error) {
      console.error("Learn README load failed", error);
      return NextResponse.json({ error: "This repository README is temporarily unavailable" }, { status: 502 });
    }
  }
  if (query.length > 100) return NextResponse.json({ error: "Search query is too long" }, { status: 400 });
  try {
    return NextResponse.json({ source: "github", resources: await searchGithubResources(query) });
  } catch (error) {
    console.error("Learn resource search failed", error);
    return NextResponse.json({ error: "The live GitHub resource source is temporarily unavailable" }, { status: 502 });
  }
}
