import { prisma } from "@/lib/db";
import { aggregateContributorScores, type ContributorStats } from "@/lib/leaderboard";
import { Octokit } from "octokit";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const org = process.env.GITHUB_ORG;
  if (!org) return NextResponse.json({ error: "GITHUB_ORG is not configured" }, { status: 500 });
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const repos = await octokit.paginate(octokit.rest.repos.listForOrg, { org, per_page: 100, type: "all" });
  const repositories: Array<{ contributors: ContributorStats[] }> = [];
  for (const repo of repos) {
    const contributors = await octokit.paginate(octokit.rest.repos.listContributors, { owner: org, repo: repo.name, per_page: 100 });
    repositories.push({
      contributors: contributors.map((contributor) => ({
        login: contributor.login ?? "",
        contributions: contributor.contributions ?? 0,
      })),
    });
  }
  const scores = aggregateContributorScores(repositories);
  await Promise.all([...scores].map(([githubHandle, contributionScore]) =>
    prisma.user.updateMany({ where: { githubHandle: { equals: githubHandle, mode: "insensitive" } }, data: { contributionScore } }),
  ));
  return NextResponse.json({ repositories: repos.length, contributors: scores.size });
}
