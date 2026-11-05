"use client";

import { Search, Star, ExternalLink, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { GithubResource } from "@/lib/github-resources";

export default function ResourceSearch({ initialResources }: { initialResources: GithubResource[] }) {
  const [resources, setResources] = useState(initialResources);
  const [query, setQuery] = useState("awesome open source");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) {
      setError("Enter a topic, language, or project name to search.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/learn/resources?q=${encodeURIComponent(query)}`);
      const data = await response.json() as { resources?: GithubResource[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Search failed");
      setResources(data.resources ?? []);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={search} className="resource-search">
        <Search size={17} aria-hidden="true" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search GitHub learning resources" placeholder="Search GitHub resources" />
        <button type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
      </form>
      <div className="resource-results-summary">
        <span>{loading ? "Searching GitHub..." : `${resources.length} relevant resource${resources.length === 1 ? "" : "s"} found`}</span>
        <span>Sorted by relevance, then stars</span>
      </div>
      {error && <p className="error-note">{error}</p>}
      {resources.length > 0 ? (
        <div className="resource-grid">
          {resources.map((resource) => (
            <article key={resource.id} className="resource-card">
              <div className="flex items-start justify-between gap-3"><span className="resource-kind">GitHub / {resource.language ?? "Open source"}</span><ExternalLink size={15} aria-hidden="true" /></div>
              <h2>{resource.full_name}</h2>
              <p>{resource.description ?? "Community-curated open source resources."}</p>
              <span className="resource-meta"><Star size={13} fill="currentColor" /> {resource.stargazers_count.toLocaleString("en-US")} stars</span>
              <div className="resource-actions">
                <Link href={`/learn/${resource.full_name}`} className="resource-read-button"><Eye size={14} /> View resource</Link>
                <a href={resource.html_url} target="_blank" rel="noreferrer" className="resource-external-link">GitHub <ExternalLink size={13} /></a>
              </div>
            </article>
          ))}
        </div>
      ) : !loading && <div className="resource-empty"><Search size={20} /><h2>No resources found</h2><p>Try a broader search such as “React”, “Python”, or “awesome open source”.</p></div>}
    </>
  );
}
