import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ReadmeMarkdown from "@/components/ReadmeMarkdown";
import { fetchGithubReadme } from "@/lib/github-resources";

export const dynamic = "force-dynamic";

interface ResourcePageProps {
  params: Promise<{ owner: string; repo: string }>;
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { owner, repo } = await params;
  const repository = `${owner}/${repo}`;
  let readme = "";
  let error = "";

  try {
    readme = await fetchGithubReadme(repository);
  } catch (reason) {
    console.error("Learn resource page load failed", reason);
    error = "This resource could not be loaded right now. Please try again shortly.";
  }

  return (
    <main className="site-page">
      <div className="site-container">
        <div className="resource-reader-page-header">
          <Link href="/learn" className="outline-action"><ArrowLeft size={15} /> Back to Learn</Link>
          <a href={`https://github.com/${repository}`} target="_blank" rel="noreferrer" className="outline-action">Open on GitHub <ExternalLink size={15} /></a>
        </div>
        <section className="resource-reader resource-reader-page">
          <header className="resource-reader-header">
            <div>
              <p className="resource-kind">Reading on ARISE / GitHub</p>
              <h1>{repository}</h1>
            </div>
          </header>
          <div className="resource-reader-body">
            {error ? <div className="resource-unavailable"><h2>README unavailable</h2><p>{error}</p><a href={`https://github.com/${repository}`} target="_blank" rel="noreferrer" className="resource-read-button">Read the repository on GitHub <ExternalLink size={14} /></a></div> : <ReadmeMarkdown content={readme} />}
          </div>
        </section>
      </div>
    </main>
  );
}
