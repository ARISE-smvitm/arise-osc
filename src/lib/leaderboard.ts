export interface ContributorStats {
  login: string;
  contributions: number;
  pullRequests?: number;
  issues?: number;
}

export function calculateScore(stats: Pick<ContributorStats, "contributions" | "pullRequests" | "issues">): number {
  return (stats.pullRequests ?? 0) * 5 + (stats.issues ?? 0) * 2 + stats.contributions;
}

export function aggregateContributorScores(
  repositories: Array<{ contributors: ContributorStats[] }>,
): Map<string, number> {
  const scores = new Map<string, number>();
  for (const repository of repositories) {
    for (const contributor of repository.contributors) {
      const handle = contributor.login.trim().toLowerCase();
      if (!handle) continue;
      scores.set(handle, (scores.get(handle) ?? 0) + calculateScore(contributor));
    }
  }
  return scores;
}
