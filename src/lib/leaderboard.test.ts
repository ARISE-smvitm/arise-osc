import { aggregateContributorScores, calculateScore } from "./leaderboard";

describe("leaderboard scoring", () => {
  it("weights pull requests, issues, and commits", () => {
    expect(calculateScore({ pullRequests: 2, issues: 3, contributions: 4 })).toBe(20);
  });

  it("aggregates contributors case-insensitively across repositories", () => {
    const scores = aggregateContributorScores([
      { contributors: [{ login: "Alice", contributions: 3, pullRequests: 1 }] },
      { contributors: [{ login: "alice", contributions: 2, issues: 2 }] },
    ]);
    expect(scores.get("alice")).toBe(14);
  });
});
