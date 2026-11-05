export interface GithubResource {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
}

export interface GithubReadme {
  content: string;
  encoding: "base64";
}

interface GithubSearchResponse {
  items: GithubResource[];
}

function queryTokens(query: string) {
  return [...new Set(query.toLowerCase().split(/[^a-z0-9+#.-]+/).filter((token) => token.length > 1))];
}

export function scoreGithubResource(resource: GithubResource, query: string): number {
  const tokens = queryTokens(query);
  const name = `${resource.name} ${resource.full_name}`.toLowerCase();
  const topics = (resource.topics ?? []).map((topic) => topic.toLowerCase());
  const description = (resource.description ?? "").toLowerCase();
  if (!tokens.length || !tokens.every((token) => `${name} ${topics.join(" ")} ${description}`.includes(token))) return 0;

  return tokens.reduce((score, token) => {
    if (resource.name.toLowerCase() === token) return score + 140;
    if (name.split(/[\/._-]+/).includes(token)) return score + 100;
    if (topics.some((topic) => topic === token || topic.includes(token))) return score + 75;
    if (name.includes(token)) return score + 55;
    return score + 8;
  }, 0);
}

export async function searchGithubResources(query = "awesome open source"): Promise<GithubResource[]> {
  const normalizedQuery = query.trim().slice(0, 100);
  const search = encodeURIComponent(`${normalizedQuery} in:name,description,topics`);
  const response = await fetch(`https://api.github.com/search/repositories?q=${search}&sort=stars&order=desc&per_page=50`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "arise-osc-learn" },
    next: { revalidate: 900 },
  });
  if (!response.ok) throw new Error(`GitHub resource search failed with status ${response.status}`);
  const data = (await response.json()) as GithubSearchResponse;
  const ranked = data.items
    .map((resource) => ({ resource, score: scoreGithubResource(resource, normalizedQuery) }))
    .filter(({ score }) => score > 0);
  const hasStrongMatch = ranked.some(({ score }) => score >= 55);
  return ranked
    .filter(({ score }) => !hasStrongMatch || score >= 55)
    .sort((a, b) => b.score - a.score || b.resource.stargazers_count - a.resource.stargazers_count)
    .slice(0, 24)
    .map(({ resource }) => resource);
}

export async function fetchGithubReadme(fullName: string): Promise<string> {
  if (!/^[\w.-]+\/[\w.-]+$/.test(fullName)) throw new Error("Invalid repository name");
  const response = await fetch(`https://api.github.com/repos/${fullName}/readme`, {
    headers: { Accept: "application/vnd.github.raw+json", "User-Agent": "arise-osc-learn" },
    next: { revalidate: 900 },
  });
  if (!response.ok) throw new Error(`GitHub README request failed with status ${response.status}`);
  return (await response.text()).slice(0, 18000);
}
