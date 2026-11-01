import Link from "next/link";
import Image from "next/image";
import { UPCOMING_EVENTS } from "@/data/mockData";
import { MapPin, ArrowRight, Sparkles } from "lucide-react";

export default function UpcomingEvents() {
  return (
    <section className="border-b border-black/10 bg-[#FAF9F6] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-black/10 gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.1em] text-[#737373] mb-2 font-medium">
              Gatherings & Sprints
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.05em] text-black leading-[0.95]">
              Upcoming events
            </h2>
            <p className="mt-2 text-base font-normal tracking-[-0.02em] text-[#525252]">
              Hands-on workshops, contribution sprints, and peer hack sessions on campus.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] font-bold text-black hover:text-[#E11D48] transition-colors"
          >
            <span>Full Schedule & Archives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2-Column Editorial Event Pass Grid with Grayscale-to-Color Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {UPCOMING_EVENTS.map((evt) => {
            const dateParts = evt.date.split(" ");
            const month = dateParts[0];
            const day = dateParts[1]?.replace(",", "") || "";

            return (
              <div
                key={evt.id}
                className="group flex flex-col justify-between border border-black/10 bg-white hover:border-black transition-all duration-300 shadow-xs overflow-hidden"
              >
                {/* Event Image Container with Grayscale Filter & Hover Reveal */}
                <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-zinc-100 border-b border-black/10">
                  {evt.image && (
                    <Image
                      src={evt.image}
                      alt={evt.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover grayscale contrast-[1.05] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                  )}

                  {/* Dark subtle gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Top Floating Badge Bar */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    {/* Black Date Stamp Block */}
                    <div className="flex items-center gap-2 bg-black text-white px-3 py-1.5 font-mono shadow-md">
                      <span className="text-[11px] uppercase tracking-[0.15em] text-zinc-300">
                        {month}
                      </span>
                      <span className="text-base font-bold leading-none">
                        {day}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-950 bg-emerald-400 px-2.5 py-1 shadow-xs">
                      Registration Open
                    </span>
                  </div>

                  {/* Bottom Image Tag */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                    <span className="bg-[#E11D48] text-white px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] shadow-xs">
                      {evt.type}
                    </span>
                    <span className="bg-black/75 backdrop-blur-xs text-white px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider">
                      By {evt.organisation}
                    </span>
                  </div>
                </div>

                {/* Event Details Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-[-0.03em] text-black group-hover:text-[#E11D48] transition-colors">
                      {evt.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-[#525252] leading-[1.6]">
                      {evt.description}
                    </p>
                  </div>

                  {/* Venue & Registration Deadline */}
                  <div className="mt-6 pt-4 border-t border-black/10 font-mono text-xs text-zinc-600 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-zinc-800 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Registration closes {evt.registrationDeadline}
                    </div>
                  </div>
                </div>

                {/* Perforated Action Footer */}
                <div className="border-t border-dashed border-black/15 p-5 bg-zinc-50/70 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.1em] text-zinc-500">
                    Free · Student Access
                  </span>
                  <Link
                    href="/events"
                    className="bg-black px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-[#E11D48] transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Propose a Sprint / Talk Banner */}
        <div className="mt-10 border border-black/10 bg-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] text-[#E11D48] font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Community Call for Proposals</span>
            </div>
            <h4 className="text-lg font-bold tracking-[-0.02em] text-black">
              Want to host a sprint or deliver a technical talk?
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-[#525252] max-w-xl">
              Any SMVITM student or alumnus can propose a 45-minute workshop. ARISE OSC provides lab access, audio-visual support, and connects you with attendees.
            </p>
          </div>
          <Link
            href="/events"
            className="shrink-0 inline-flex items-center gap-2 border border-black px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] font-bold text-black hover:bg-black hover:text-white transition-all"
          >
            <span>Submit Proposal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
