import { UPCOMING_EVENTS } from "@/data/mockData";
import { Calendar, MapPin, Users, CheckCircle2 } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-600 mb-2">
            Campus Hackathons & Workshops
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
            Community Events
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-2xl">
            Live technical gatherings, open-source sprints, and peer-to-peer workshops organized by SMVITM technical clubs.
          </p>
        </div>

        {/* Upcoming Section */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-slate-950 mb-6 flex items-center gap-2">
            <span>Upcoming Sprints & Sessions</span>
            <span className="text-xs font-mono font-normal text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
              Open Registration
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {UPCOMING_EVENTS.map((evt) => (
              <div
                key={evt.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      {evt.type}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      Organized by {evt.organisation}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-950">{evt.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="mt-5 space-y-2 text-xs font-mono text-slate-600 border-t border-slate-200/70 pt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-rose-600" />
                      <span>Date: {evt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>Venue: {evt.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>Registration Closes: {evt.registrationDeadline}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Open to all SMVITM students
                  </span>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-950 px-4 py-2 text-xs font-mono font-medium text-white hover:bg-rose-600 transition-colors"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Events Archive Note */}
        <div className="mt-14 rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/30">
          <p className="text-sm font-mono text-slate-500">
            Past event archives and project showcase will be archived here following the November sprint.
          </p>
        </div>
      </div>
    </div>
  );
}
