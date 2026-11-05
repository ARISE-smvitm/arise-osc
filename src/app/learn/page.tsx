import Link from "next/link";
import { BookOpen, Radio, ArrowUpRight } from "lucide-react";
import ResourceSearch from "@/components/ResourceSearch";
import TopicPlanner from "@/components/TopicPlanner";
import GithubIcon from "@/components/GithubIcon";
import { searchGithubResources, type GithubResource } from "@/lib/github-resources";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  let resources: GithubResource[] = [];
  let sourceError = "";
  try {
    resources = await searchGithubResources();
  } catch (error) {
    console.error("Initial learn resource load failed", error);
    sourceError = "Live GitHub resources are temporarily unavailable. Try searching again shortly.";
  }
  return (
    <main className="site-page">
      <div className="site-container">
        <div className="page-heading">
          <div><p className="eyebrow">Learn / live resources</p><h1 className="page-title">Learn in public.</h1><p className="page-lede">Readable pathways and live community resources for going from first commit to confident maintainer.</p></div>
          <Link href="/knowledge-base/rulebook" className="outline-action"><BookOpen size={16} /> Read the rulebook <ArrowUpRight size={15} /></Link>
        </div>
        <div className="source-strip"><span><GithubIcon className="h-4 w-4" /> GitHub live source</span><span className="source-status">Cached for 15 minutes</span><span className="source-status"><BookOpen size={16} /> Wikipedia public knowledge</span><span className="source-unavailable"><Radio size={16} /> No AI generation</span></div>
        {sourceError && <p className="error-note">{sourceError}</p>}
        <TopicPlanner />
        <ResourceSearch initialResources={resources} />
      </div>
    </main>
  );
}
