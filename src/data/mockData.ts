export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  organisation: "OSC" | "GDSC" | "IEEE CS" | "ARC";
  techStack: string[];
  status: "Seeking contributors" | "Active" | "Completed";
  repoUrl: string;
  demoUrl?: string;
  openIssuesCount: number;
  goodFirstIssuesCount: number;
  contributorsCount: number;
  mergedPrsCount: number;
  maintainers: string[];
}

export interface Organisation {
  name: string;
  code: "OSC" | "GDSC" | "IEEE CS" | "ARC";
  tagline: string;
  description: string;
  leadMembers: string[];
  projectsCount: number;
  eventsCount: number;
}

export interface CommunityEvent {
  id: string;
  title: string;
  type: "Hackathon" | "Workshop" | "Open Source Sprint" | "Tech Talk";
  date: string;
  venue: string;
  organisation: string;
  registrationOpen: boolean;
  registrationDeadline: string;
  description: string;
  image?: string;
}

export const COMMUNITY_STATS = {
  projects: 14,
  contributors: 112,
  mergedPrs: 348,
  eventsHeld: 19,
};

export const FEATURED_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "arise-osc-platform",
    slug: "arise-osc-platform",
    description: "The official collaboration hub and contribution tracking platform for SMVITM student developers.",
    organisation: "OSC",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
    status: "Seeking contributors",
    repoUrl: "https://github.com/ARISE-smvitm/arise-osc",
    openIssuesCount: 8,
    goodFirstIssuesCount: 4,
    contributorsCount: 16,
    mergedPrsCount: 42,
    maintainers: ["Tejas Nayak", "Core Team"],
  },
  {
    id: "proj-2",
    name: "campus-mesh-iot",
    slug: "campus-mesh-iot",
    description: "Low-power LoRa mesh sensor network for real-time environmental monitoring across college campus blocks.",
    organisation: "ARC",
    techStack: ["C++", "FreeRTOS", "Python", "MQTT"],
    status: "Active",
    repoUrl: "https://github.com/ARISE-smvitm/campus-mesh-iot",
    openIssuesCount: 5,
    goodFirstIssuesCount: 2,
    contributorsCount: 9,
    mergedPrsCount: 28,
    maintainers: ["ARC Systems Lead"],
  },
  {
    id: "proj-3",
    name: "smvitm-timetable-engine",
    slug: "smvitm-timetable-engine",
    description: "Constraint-satisfaction timetable generator and sync service for VTU curriculum batches and faculty slots.",
    organisation: "IEEE CS",
    techStack: ["Go", "React", "PostgreSQL"],
    status: "Seeking contributors",
    repoUrl: "https://github.com/ARISE-smvitm/timetable-engine",
    openIssuesCount: 11,
    goodFirstIssuesCount: 6,
    contributorsCount: 14,
    mergedPrsCount: 64,
    maintainers: ["IEEE CS Dev Lead"],
  },
  {
    id: "proj-4",
    name: "open-syllabus-ai-index",
    slug: "open-syllabus-ai-index",
    description: "Curated open-access university curriculum repository with semantic search over lecture notes and previous QP solutions.",
    organisation: "GDSC",
    techStack: ["FastAPI", "Next.js", "ChromaDB"],
    status: "Seeking contributors",
    repoUrl: "https://github.com/ARISE-smvitm/open-syllabus-index",
    openIssuesCount: 7,
    goodFirstIssuesCount: 3,
    contributorsCount: 12,
    mergedPrsCount: 31,
    maintainers: ["GDSC AI Lead"],
  },
];

export const ORGANISATIONS: Organisation[] = [
  {
    name: "Open Source Community",
    code: "OSC",
    tagline: "Building public goods, contributing upstream.",
    description: "The primary cell driving open-source tooling, Git fluency, and production-grade engineering for SMVITM students.",
    leadMembers: ["Tejas Nayak", "Community Stewards"],
    projectsCount: 5,
    eventsCount: 8,
  },
  {
    name: "Google Developer Student Clubs",
    code: "GDSC",
    tagline: "Peer-to-peer technology innovation and workshops.",
    description: "Empowering developers to build real-world solutions for local businesses and community impact with modern web, cloud, and mobile tech.",
    leadMembers: ["GDSC Lead", "Tech Core"],
    projectsCount: 3,
    eventsCount: 6,
  },
  {
    name: "IEEE Computer Society",
    code: "IEEE CS",
    tagline: "Computing standards, research, and systems.",
    description: "Fostering technical rigor in computer architecture, systems programming, algorithms, and peer research publications.",
    leadMembers: ["Chapter Chair", "Technical Head"],
    projectsCount: 4,
    eventsCount: 4,
  },
  {
    name: "Automation & Robotics Club",
    code: "ARC",
    tagline: "Hardware-software symbiosis and embedded robotics.",
    description: "Designing autonomous robots, IoT nodes, embedded firmware, and physical computing systems in the SMVITM lab.",
    leadMembers: ["ARC President", "Hardware Lead"],
    projectsCount: 2,
    eventsCount: 3,
  },
];

export const UPCOMING_EVENTS: CommunityEvent[] = [
  {
    id: "event-1",
    title: "Hacktoberfest Sprint 2026: SMVITM Upstream",
    type: "Open Source Sprint",
    date: "Nov 12, 2026",
    venue: "Central Computing Lab 3 & Online",
    organisation: "OSC",
    registrationOpen: true,
    registrationDeadline: "Nov 10, 2026",
    description: "A 12-hour guided contribution sprint. Pick verified beginner issues, open PRs, and get code merged into active club repositories.",
    image: "/images/events/hacktoberfest.jpg",
  },
  {
    id: "event-2",
    title: "Rust for Systems & Embedded Nodes",
    type: "Workshop",
    date: "Nov 22, 2026",
    venue: "Seminar Hall 2",
    organisation: "IEEE CS × ARC",
    registrationOpen: true,
    registrationDeadline: "Nov 20, 2026",
    description: "Hands-on deep dive into memory safety, bare-metal microcontroller drivers, and writing fast microservices.",
    image: "/images/events/rust_workshop.jpg",
  },
];
