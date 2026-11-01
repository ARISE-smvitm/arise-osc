import Hero from "@/components/Hero";
import MarqueeTicker from "@/components/MarqueeTicker";
import LiveStats from "@/components/LiveStats";
import StartHere from "@/components/StartHere";
import FeaturedProjects from "@/components/FeaturedProjects";
import IssueRadar from "@/components/IssueRadar";
import OrganisationsGrid from "@/components/OrganisationsGrid";
import UpcomingEvents from "@/components/UpcomingEvents";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-white text-black">
      {/* LOCKED: Hero, Marquee, LiveStats */}
      <Hero />
      <MarqueeTicker />
      <LiveStats />

      {/* DIVERSE EDITORIAL MID-SECTIONS */}
      {/* 1. Contributor Pathway (Sticky Split & Vertical Milestones) */}
      <StartHere />

      {/* 2. Featured Projects (Lead Centerpiece + Interactive Category Filters + Technical Docket) */}
      <FeaturedProjects />

      {/* 3. Live Good First Issues Radar (Filterable beginner issues with assigned mentors) */}
      <IssueRadar />

      {/* 4. Technical Clubs (2x2 Architectural Chapter Matrix with Stack & Flagship specs) */}
      <OrganisationsGrid />

      {/* 5. Upcoming Gatherings & Sprints (Event passes + Call for Proposals) */}
      <UpcomingEvents />
    </div>
  );
}
