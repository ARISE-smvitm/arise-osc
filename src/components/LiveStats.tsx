import { COMMUNITY_STATS } from "@/data/mockData";

export default function LiveStats() {
  const stats = [
    { label: "Community projects", value: COMMUNITY_STATS.projects },
    { label: "Community contributors", value: COMMUNITY_STATS.contributors },
    { label: "Pull requests merged", value: COMMUNITY_STATS.mergedPrs },
    { label: "Events & workshops held", value: COMMUNITY_STATS.eventsHeld },
  ];

  return (
    <section className="border-b border-black/10 bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {stats.map((s) => (
            <div key={s.label} className="space-y-2">
              <div className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.05em] text-black leading-none">
                {s.value}
              </div>
              <div className="font-mono text-xs uppercase tracking-[0.1em] text-[#737373] pt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
