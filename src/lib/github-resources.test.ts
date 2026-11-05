import { scoreGithubResource } from "./github-resources";

const resource = (overrides: Partial<Parameters<typeof scoreGithubResource>[0]> = {}) => ({
  id: 1,
  name: "git-learning",
  full_name: "arise/git-learning",
  description: "A practical guide to version control",
  html_url: "https://github.com/arise/git-learning",
  stargazers_count: 10,
  language: "Markdown",
  topics: ["git", "version-control"],
  ...overrides,
});

describe("GitHub resource relevance", () => {
  it("prioritizes title and topic matches over description mentions", () => {
    expect(scoreGithubResource(resource(), "git")).toBeGreaterThan(scoreGithubResource(resource({
      name: "shell-tools",
      full_name: "someone/shell-tools",
      description: "A toolkit with optional git integration",
      topics: [],
    }), "git"));
  });

  it("rejects resources that do not contain every query term", () => {
    expect(scoreGithubResource(resource({ description: "A practical guide" }), "git python")).toBe(0);
  });
});
