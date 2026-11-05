export interface CommunityContributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

interface GithubRepository {
  full_name: string;
  archived: boolean;
  fork: boolean;
}

interface GithubMember {
  login: string;
  avatar_url: string;
  html_url: string;
}

export async function fetchCommunityLeaders(organization = "ARISE-smvitm"): Promise<CommunityContributor[]> {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "arise-osc-community" };
  const repositoriesResponse = await fetch(
    `https://api.github.com/orgs/${encodeURIComponent(organization)}/repos?sort=updated&per_page=12`,
    { headers, next: { revalidate: 900 } },
  );
  if (!repositoriesResponse.ok) throw new Error(`GitHub organization request failed with status ${repositoriesResponse.status}`);
  const repositories = (await repositoriesResponse.json()) as GithubRepository[];
  const activeRepositories = repositories.filter((repository) => !repository.archived && !repository.fork).slice(0, 8);
  const contributors = await Promise.all(activeRepositories.map(async (repository) => {
    const response = await fetch(
      `https://api.github.com/repos/${repository.full_name}/contributors?per_page=10`,
      { headers, next: { revalidate: 900 } },
    );
    if (!response.ok) return [];
    return (await response.json()) as CommunityContributor[];
  }));
  const totals = new Map<string, CommunityContributor>();
  for (const repositoryContributors of contributors) {
    for (const contributor of repositoryContributors) {
      if (!contributor.login || contributor.login.includes("[bot]")) continue;
      const current = totals.get(contributor.login);
      totals.set(contributor.login, {
        login: contributor.login,
        avatar_url: contributor.avatar_url,
        html_url: contributor.html_url,
        contributions: (current?.contributions ?? 0) + contributor.contributions,
      });
    }
  }
  const leaders = [...totals.values()].sort((a, b) => b.contributions - a.contributions).slice(0, 3);
  if (leaders.length > 0) return leaders;

  const membersResponse = await fetch(
    `https://api.github.com/orgs/${encodeURIComponent(organization)}/members?per_page=3`,
    { headers, next: { revalidate: 900 } },
  );
  if (!membersResponse.ok) return [];
  const members = (await membersResponse.json()) as GithubMember[];
  return members.map((member) => ({ ...member, contributions: 0 }));
}
