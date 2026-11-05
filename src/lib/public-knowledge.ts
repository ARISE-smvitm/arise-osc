export interface KnowledgeSource {
  title: string;
  description: string;
  url: string;
  source: "Wikipedia";
}

export interface LearningStep {
  number: number;
  title: string;
  action: string;
  sources: KnowledgeSource[];
}

export interface TopicLearningPlan {
  topic: string;
  summary: string;
  source: KnowledgeSource;
  steps: LearningStep[];
}

interface WikipediaSearchResponse {
  query?: { search?: Array<{ title: string; snippet: string }> };
}

interface WikipediaSummary {
  title: string;
  extract?: string;
  content_urls?: { desktop?: { page?: string } };
}

const WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php";

function clean(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").trim();
}

async function searchWikipedia(topic: string): Promise<string[]> {
  const url = `${WIKIPEDIA_API}?action=query&list=search&srsearch=${encodeURIComponent(topic)}&srlimit=5&format=json&origin=*`;
  const response = await fetch(url, { headers: { "User-Agent": "arise-osc-learn/1.0" }, next: { revalidate: 3600 } });
  if (!response.ok) throw new Error(`Wikipedia search failed with status ${response.status}`);
  const data = (await response.json()) as WikipediaSearchResponse;
  return (data.query?.search ?? []).map((item) => item.title);
}

async function fetchSummary(title: string): Promise<WikipediaSummary> {
  const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
    headers: { "User-Agent": "arise-osc-learn/1.0" },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`Wikipedia summary failed with status ${response.status}`);
  return (await response.json()) as WikipediaSummary;
}

export async function buildTopicLearningPlan(topic: string): Promise<TopicLearningPlan> {
  const normalized = topic.trim().slice(0, 80);
  if (!normalized) throw new Error("Enter a topic to build a learning path.");
  const titles = await searchWikipedia(normalized);
  if (!titles.length) throw new Error("No public knowledge source matched that topic.");
  const summaries = (await Promise.all(titles.slice(0, 3).map(fetchSummary))).filter((item) => item.extract);
  if (!summaries.length) throw new Error("The public source did not return readable material.");

  const sources = summaries.map((item) => ({
    title: item.title,
    description: clean(item.extract ?? "").slice(0, 240),
    url: item.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
    source: "Wikipedia" as const,
  }));
  const primary = sources[0];
  const summary = primary.description;
  return {
    topic: normalized,
    summary,
    source: primary,
    steps: [
      { number: 1, title: "Build the mental model", action: `Read the overview of ${primary.title}. Write down five unfamiliar terms and define them in your own words.`, sources: [primary] },
      { number: 2, title: "Map the foundations", action: `Compare the related public references below. Note how ${normalized} connects to adjacent ideas, people, or systems.`, sources },
      { number: 3, title: "Practice in a small project", action: `Create one small example that demonstrates the central idea of ${normalized}. Keep it observable, document your assumptions, and link back to the sources.`, sources: [primary] },
      { number: 4, title: "Teach it back", action: `Explain ${normalized} without copying the article. Use your notes to identify one gap, then return to the most relevant source and continue deeper.`, sources },
    ],
  };
}
