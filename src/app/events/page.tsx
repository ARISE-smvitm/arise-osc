import { Calendar, MapPin, Users, CheckCircle2 } from "lucide-react";
import { listUpcomingEvents, formatEventDate } from "@/lib/events";
import { isBackendConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  if (!isBackendConfigured()) {
    return (
      <div className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="border-b border-slate-200 pb-8">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-600 mb-2">Campus Hackathons & Workshops</div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">Community Events</h1>
          </header>
          <div className="status-card mt-8">
            <h2>Events are waiting for Firebase to be configured.</h2>
            <p>Set <code>FIREBASE_SERVICE_ACCOUNT_KEY</code> (or the discrete <code>FIREBASE_*</code> admin variables) in the deployment environment, then restart the server to load community events.</p>
          </div>
        </div>
      </div>
    );
  }

  const events = await listUpcomingEvents(50);

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
            {events.some((event) => event.registrationOpen) && (
              <span className="text-xs font-mono font-normal text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                Open Registration
              </span>
            )}
          </h2>

          {events.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/30 p-12 text-center">
              <p className="font-semibold text-slate-950">No upcoming events yet.</p>
              <p className="mt-1 text-sm text-slate-500">The next sprint or workshop will appear here as soon as an admin publishes it.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-6"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 gap-3">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                        {event.type}
                      </span>
                      <span className="font-mono text-xs text-slate-500 truncate">
                        Organized by {event.organisation}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-950">{event.title}</h3>
                    {event.description && <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{event.description}</p>}

                    <div className="mt-5 space-y-2 text-xs font-mono text-slate-600 border-t border-slate-200/70 pt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-rose-600" />
                        <span>Date: {formatEventDate(event.startsAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>Venue: {event.venue}</span>
                      </div>
                      {event.registrationDeadline && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>Registration Closes: {formatEventDate(event.registrationDeadline)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-mono flex items-center gap-1.5">
                      {event.registrationOpen ? (
                        <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /><span className="text-emerald-700">Open to all SMVITM students</span></>
                      ) : (
                        <span className="text-slate-500">Registration closed</span>
                      )}
                    </span>
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-slate-400">{event.organisation}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
