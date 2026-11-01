import { Newspaper, Calendar, Tag, ArrowRight } from "lucide-react";

export default function NewsroomPage() {
  const posts = [
    {
      id: "post-1",
      title: "ARISE OSC Platform Launch: Unified Open Source Hub at SMVITM",
      date: "Oct 28, 2026",
      category: "Announcements",
      summary:
        "The official launch of the ARISE collaboration engine bringing together OSC, GDSC, IEEE CS, and ARC into a shared contribution pipeline.",
      readTime: "3 min read",
    },
    {
      id: "post-2",
      title: "SMVITM Students Merge 100+ Upstream Commits During Semester Sprint",
      date: "Oct 15, 2026",
      category: "Recap",
      summary:
        "A recap of student contributions across VTU syllabus tooling, campus LoRa mesh nodes, and open-access courseware repositories.",
      readTime: "4 min read",
    },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-600 mb-2">
            Dispatches & Recaps
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
            Newsroom
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-2xl">
            Updates, technical writeups, milestone recaps, and club announcements from the SMVITM developer community.
          </p>
        </div>

        {/* Posts List */}
        <div className="mt-10 max-w-4xl space-y-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-slate-200 bg-slate-50/40 p-6 sm:p-8 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3 text-xs font-mono text-slate-500 mb-3">
                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                  {post.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {post.date}
                </span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 hover:text-rose-600 transition-colors cursor-pointer">
                {post.title}
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{post.summary}</p>

              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">SMVITM Bantakal Press</span>
                <span className="text-slate-900 font-medium hover:text-rose-600 cursor-pointer flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
