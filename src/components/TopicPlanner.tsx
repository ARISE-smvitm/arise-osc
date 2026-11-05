"use client";

import { BookOpen, ExternalLink, ListChecks, Search } from "lucide-react";
import { useState } from "react";
import type { TopicLearningPlan } from "@/lib/public-knowledge";

export default function TopicPlanner() {
  const [topic, setTopic] = useState("");
  const [plan, setPlan] = useState<TopicLearningPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!topic.trim()) { setError("Enter a topic, such as Git, astronomy, or TypeScript."); return; }
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/learn/knowledge?topic=${encodeURIComponent(topic)}`);
      const data = await response.json() as { plan?: TopicLearningPlan; error?: string };
      if (!response.ok || !data.plan) throw new Error(data.error ?? "Could not build a learning path.");
      setPlan(data.plan);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not build a learning path.");
    } finally { setLoading(false); }
  }

  return (
    <section className="topic-planner">
      <div className="topic-planner-heading"><div><p className="eyebrow">Public knowledge path</p><h2>Tell us what you want to learn.</h2><p>We use cached public Wikipedia references and a transparent rule-based sequence. No AI-generated claims.</p></div><BookOpen size={24} aria-hidden="true" /></div>
      <form onSubmit={submit} className="resource-search topic-search">
        <Search size={17} aria-hidden="true" /><input value={topic} onChange={(event) => setTopic(event.target.value)} aria-label="Topic to learn" placeholder="Try “computer networks” or “Git”" /><button type="submit" disabled={loading}>{loading ? "Building..." : "Build path"}</button>
      </form>
      {error && <p className="error-note">{error}</p>}
      {plan && <div className="topic-plan">
        <div className="topic-plan-summary"><span className="resource-kind">Wikipedia / {plan.topic}</span><h3>{plan.source.title}</h3><p>{plan.summary}</p><a href={plan.source.url} target="_blank" rel="noreferrer">Read primary source <ExternalLink size={13} /></a></div>
        <div className="topic-steps">{plan.steps.map((step) => <article className="topic-step" key={step.number}><span className="topic-step-number">{String(step.number).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.action}</p><div className="topic-step-sources">{step.sources.map((source) => <a key={source.title} href={source.url} target="_blank" rel="noreferrer">{source.title} <ExternalLink size={11} /></a>)}</div></div></article>)}</div>
        <p className="topic-plan-note"><ListChecks size={14} /> Sources are public references; verify important details and respect each source&apos;s license.</p>
      </div>}
    </section>
  );
}
