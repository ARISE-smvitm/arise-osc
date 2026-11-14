import { unstable_cache } from "next/cache";

// Shared GitHub REST client. Uses GITHUB_TOKEN when present (5000 req/h),
// falls back to unauthenticated (60 req/h). All server-side — the token never
// reaches the browser.

export const GITHUB_ORG = process.env.GITHUB_ORG || "ARISE-smvitm";

const GITHUB_API = "https://api.github.com";

export function githubHeaders(): Record<string, string> {
  return headers();
}

function headers(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "arise-osc",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function githubFetch<T>(path: string, revalidate: number): Promise<T> {
  const response = await fetch(`${GITHUB_API}${path}`, { headers: headers(), next: { revalidate } });
  if (!response.ok) {
    throw new Error(`GitHub ${path} failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

async function githubFetchRaw(path: string, revalidate: number): Promise<string | null> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: { ...headers(), Accept: "application/vnd.github.raw+json" },
    next: { revalidate },
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`GitHub ${path} failed with status ${response.status}`);
  }
  return response.text();
}

/** Paginated list fetch (max 3 pages — enough for an org our size). */
async function githubFetchAll<T>(path: string, revalidate: number): Promise<T[]> {
  const separator = path.includes("?") ? "&" : "?";
  const pages: T[] = [];
  for (let page = 1; page <= 3; page += 1) {
    const items = await githubFetch<T[]>(`${path}${separator}per_page=100&page=${page}`, revalidate);
    pages.push(...items);
    if (items.length < 100) break;
  }
  return pages;
}

export interface RepoSummary {
  owner: string;
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  /** Open issues + PRs as reported by GitHub. */
  openIssues: number;
  topics: string[];
  pushedAt: string;
  updatedAt: string;
  defaultBranch: string;
  archived: boolean;
  license: string | null;
}

interface GithubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics?: string[];
  pushed_at: string;
  updated_at: string;
  default_branch: string;
  archived: boolean;
  fork: boolean;
  license?: { spdx_id?: string | null; name?: string | null } | null;
  owner: { login: string };
}

function toSummary(repo: GithubRepo): RepoSummary {
  return {
    owner: repo.owner.login,
    name: repo.name,
    fullName: repo.full_name,
    htmlUrl: repo.html_url,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    topics: repo.topics ?? [],
    pushedAt: repo.pushed_at,
    updatedAt: repo.updated_at,
    defaultBranch: repo.default_branch,
    archived: repo.archived,
    license: repo.license?.spdx_id && repo.license.spdx_id !== "NOASSERTION" ? repo.license.spdx_id : repo.license?.name ?? null,
  };
}

/** Non-archived, non-fork org repositories, most recently pushed first. */
export async function listOrgRepos(): Promise<RepoSummary[]> {
  try {
    const repos = await githubFetchAll<GithubRepo>(`/orgs/${encodeURIComponent(GITHUB_ORG)}/repos?type=all&sort=pushed&direction=desc`, 900);
    return repos.filter((repo) => !repo.archived && !repo.fork).map(toSummary);
  } catch (error) {
    console.error("GitHub org repository list failed", error);
    return [];
  }
}

/** Single repo from the org — scoped to the org so the route is not an open proxy. */
export async function getOrgRepo(name: string): Promise<RepoSummary | null> {
  const safe = /^[\w.-]{1,100}$/.test(name) ? name : null;
  if (!safe) return null;
  try {
    const repo = await githubFetch<GithubRepo>(`/repos/${encodeURIComponent(GITHUB_ORG)}/${encodeURIComponent(safe)}`, 900);
    return toSummary(repo);
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) return null;
    console.error("GitHub repo fetch failed", error);
    return null;
  }
}

export async function getRepoReadme(owner: string, name: string): Promise<string | null> {
  const safeOwner = encodeURIComponent(owner);
  const safeName = encodeURIComponent(name);
  try {
    return await githubFetchRaw(`/repos/${safeOwner}/${safeName}/readme`, 900);
  } catch (error) {
    console.error("GitHub README fetch failed", error);
    return null;
  }
}

export interface RepoIssue {
  number: number;
  title: string;
  htmlUrl: string;
  authorHandle: string;
  authorAvatar: string | null;
  createdAt: string;
  labels: Array<{ name: string; color: string }>;
  comments: number;
  goodFirstIssue: boolean;
}

interface GithubIssue {
  number: number;
  title: string;
  html_url: string;
  pull_request?: unknown;
  user?: { login?: string; avatar_url?: string };
  created_at: string;
  labels?: Array<{ name: string; color: string }>;
  comments?: number;
}

/** Open issues (excluding PRs), good-first-issues first, then oldest first. */
export async function getOpenIssues(owner: string, name: string, limit = 12): Promise<RepoIssue[]> {
  const path = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/issues?state=open&sort=created&direction=asc`;
  try {
    const issues = await githubFetchAll<GithubIssue>(path, 300);
    const mapped = issues
      .filter((issue) => !issue.pull_request)
      .map((issue) => {
        const labels = (issue.labels ?? []).map((label) => ({ name: label.name, color: `#${label.color}` }));
        return {
          number: issue.number,
          title: issue.title,
          htmlUrl: issue.html_url,
          authorHandle: issue.user?.login ?? "unknown",
          authorAvatar: issue.user?.avatar_url ?? null,
          createdAt: issue.created_at,
          labels,
          comments: issue.comments ?? 0,
          goodFirstIssue: labels.some((label) => /good[- ]first[- ]issue/i.test(label.name)),
        };
      });
    return mapped.sort((a, b) => Number(b.goodFirstIssue) - Number(a.goodFirstIssue) || a.createdAt.localeCompare(b.createdAt)).slice(0, limit);
  } catch (error) {
    console.error("GitHub issues fetch failed", error);
    return [];
  }
}

/**
 * Per-repo open issue counts (for badges). Expensive — paginated like contributors.
 * Returns name → open issue count (issues only, PRs excluded is impossible here
 * without N calls, so this uses repo.open_issues_count from listing).
 */
export interface CommunityContributor {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
  contributions: number;
  repoCount: number;
  score: number;
}

export interface CommunityStats {
  repos: number;
  totalContributions: number;
  contributors: CommunityContributor[];
}

/**
 * Walk every public org repo + its contributors once (hourly cache) and
 * aggregate per-author contribution totals. Everything the leaderboard needs —
 * people, totals, repo count — comes from this single snapshot, so the board
 * is the actual community, not just registered members.
 */
const computeCommunityStats = async (): Promise<CommunityStats> => {
  const repos = await listOrgRepos();
  const byLogin = new Map<string, { login: string; avatarUrl: string; htmlUrl: string; contributions: number; repoSet: Set<string> }>();
  for (const repo of repos) {
    const [owner, name] = repo.fullName.split("/");
    try {
      const contributors = await githubFetchAll<{ login?: string; contributions?: number; avatar_url?: string; html_url?: string }>(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/contributors?type=all`,
        900,
      );
      for (const contributor of contributors) {
        if (!contributor.login || contributor.login.includes("[bot]")) continue;
        const current = byLogin.get(contributor.login);
        if (current) {
          current.contributions += contributor.contributions ?? 0;
          current.repoSet.add(repo.fullName);
        } else {
          byLogin.set(contributor.login, {
            login: contributor.login,
            avatarUrl: contributor.avatar_url ?? "",
            htmlUrl: contributor.html_url ?? `https://github.com/${contributor.login}`,
            contributions: contributor.contributions ?? 0,
            repoSet: new Set([repo.fullName]),
          });
        }
      }
    } catch (error) {
      console.error(`Contributors fetch failed for ${repo.fullName}`, error);
    }
  }
  const contributors = [...byLogin.values()]
    .map((c) => ({ login: c.login, avatarUrl: c.avatarUrl, htmlUrl: c.htmlUrl, contributions: c.contributions, repoCount: c.repoSet.size, score: c.contributions }))
    .sort((a, b) => b.contributions - a.contributions);
  return {
    repos: repos.length,
    totalContributions: contributors.reduce((sum, c) => sum + c.contributions, 0),
    contributors,
  };
};

// Serializable output — unstable_cache stores JSON, so no Map/Set survives.
export const getCommunityStats = unstable_cache(computeCommunityStats, ["community-stats", GITHUB_ORG], { revalidate: 3600 });

/** Per-handle score map — derived from the shared community snapshot (cron uses this). */
export async function getLiveContributionScores(): Promise<Map<string, number>> {
  const stats = await getCommunityStats();
  return new Map(stats.contributors.map((contributor) => [contributor.login, contributor.score]));
}
