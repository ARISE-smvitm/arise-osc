# ARISE OSC Platform: Features and Site Structure

Oct 21, 2026

## Summary

The demo already has the right skeleton. The next step is turning it from a brochure into a working hub where a student can discover a project, join it, contribute, and be recognised for it, all on one site.

What the demo has today (checked on the live site):

- Home page with the tagline "Build. Launch. Scale.", two feature teasers (Structured Collaboration, Knowledge Base) and four technical organisations: GDSC, OSC, IEEE CS and ARC.
- Projects page that pulls from a database. It shows one project (the ARISE_osc website) with a status tag and a GitHub link, but no description.
- Newsroom with a single test post, and a Knowledge Base that says "No knowledge modules found".
- About page marked as placeholder, and a login button ("Init_Session") on every page.
- Footer links for "Rulebook of Open Source" and "Developers" that go nowhere yet.

The gap is not design, it is depth: projects, events, people and learning content need real structure behind them.

## Who the site is for

Five groups use the site, and each should reach their goal within two clicks of the home page.

| Audience                                   | What they want                      | What the site must give them                                                                 |
| ------------------------------------------ | ----------------------------------- | -------------------------------------------------------------------------------------------- |
| Newcomer / learner                         | Know where to start                 | "Good first issue" list, beginner guides, a simple Git and GitHub path                       |
| Contributor / coder                        | Find work and show it off           | Project pages with open issues, contribution guide, public profile with their PRs and commits |
| Project maintainer                         | Attract and manage helpers          | Project dashboard, issue assignment, contributor list                                        |
| Event participant                          | Join hackathons and sessions        | Event pages, registration, team formation, submissions, results                              |
| Visitor (faculty, principal, outside orgs) | See what the community has achieved | Clear stats, featured projects, news, about and contact                                      |

## Proposed site map

Four of the seven sections are in the demo; three are new (marked **NEW**).

```
Home
├── Projects ........... Filters · Project detail · Issues · Contributors
├── Events (NEW) ....... Calendar · Event detail · Register · Submissions
├── Newsroom ........... Posts · Categories · Photo galleries
├── Knowledge Base ..... Learning paths · Modules · Rulebook of Open Source
├── Organisations (NEW)  GDSC · OSC · IEEE CS · ARC, one page each
├── People (NEW) ....... Profiles · Leaderboard · My dashboard
└── About .............. Mission · Team · Contact · Privacy and Terms
```

Home leads to seven sections, and sign-in stays in the top bar on every page, as in the demo. Organisations are a section on the home page today; here each gets its own page.

## Page-by-page features

Built on the five pages you already have, plus a few new ones.

### Home

- Hero with two buttons: "Explore Projects" and "Join the community".
- Live counters: projects, contributors, merged PRs, events held. These can be pulled from GitHub automatically.
- "Featured projects" and "Up next" (the next 2–3 events with dates).
- "Start here" strip: three steps for a newcomer (sign in, pick a good-first-issue, open a PR).
- Organisations block (GDSC, OSC, IEEE CS, ARC), each linking to its own page.

### Projects (list)

- Cards showing name, one-line description, tech stack tags, status (Active, Seeking contributors, Completed), owning organisation, and contributor count.
- Filters: tech stack, status, organisation, "has good-first-issues".
- Search box and sort by newest or most active.

### Project detail

- Overview, problem statement, screenshots or demo link, GitHub link.
- Tech stack and how to run it locally.
- Open issues pulled from GitHub, with difficulty labels (beginner, intermediate, advanced).
- Contributors list with avatars, and a "Request to join" button.
- Roadmap or milestones, and a recent activity feed (commits, merged PRs).

### Events

- Upcoming and past events: hackathons, workshops, talks, open-source drives.
- Event page: schedule, rules, prizes, registration form, team formation, and a submission link.
- Past events show winners, photo gallery and the projects that came out of them.
- Calendar view and "add to calendar" button.

### Newsroom

- Announcements, event recaps and achievements, filterable by category.
- Image gallery per post (already in the demo).

### Knowledge Base

- Learning paths: Git and GitHub basics, first contribution, web, backend, AI/ML, DevOps.
- Each module has short lessons, links, and a small checklist. Student mentors can submit new modules.
- Home for the "Rulebook of Open Source": code of conduct, contribution rules, PR etiquette, licensing basics.

### Organisations

- One page per club or cell with about, team, its projects, its events and a join link.

### People and Profile

- Public profile: name, year and branch, skills, projects joined, PRs merged, real commit contributions.
- Leaderboard of top contributors, per month and per semester (ranked by merged PRs and commits).
- Private dashboard: my projects, my issues, my event registrations.

### About and Contact

- Mission, story, core team, faculty coordinators, how to reach the community.
- Contact or feedback form, and a link to the community's Discord, WhatsApp or other chat.

## How a newcomer becomes a contributor

This is the core journey the whole site should make easy:

1. Land on the home page and click "Explore Projects".
2. Filter by "Seeking contributors" and the tech they know.
3. Open a project page and read the overview and contribution guide.
4. Sign in with GitHub, which also creates their profile automatically.
5. Pick an issue tagged "good first issue" and click "Request to work on this".
6. A maintainer assigns it, and the contributor opens a pull request on GitHub.
7. When the PR is merged, the site records it, updates their profile and contribution metrics.

Signing in with GitHub is the key choice: it removes a separate sign-up, ties contributions to real accounts, and lets the site read issues and PRs without manual updates.

## Suggested phases

Ship in small steps so something real is live early. The demo's own About page already refers to a "Phase 2", so this fits the plan you have.

1. **Phase 1: Make it real (core content).** Fill every existing page with real content. Rich project cards and detail pages, GitHub login, real About page, the Rulebook page, 3–5 real projects, first newsroom posts, first 3 knowledge modules. Fix the dead footer links.
2. **Phase 2: Make it work (participation).** Issue listing from GitHub, "Request to work on this" flow, contributor profiles, events with registration, organisation pages, search and filters.
3. **Phase 3: Make it grow (recognition and community).** Leaderboard, event submissions and judging, maintainer dashboards, notifications by email or chat, analytics for the principal and faculty, alumni and mentor sections.

A good rule: do not start Phase 2 until Phase 1 has real content, since an empty projects page does more harm than a missing feature.

## Design Directives & Visual Identity

- **Light Mode Only**: Crisp, high-contrast, editorial layout. Deep ink typography (`#0F172A` / `#111827`) on clean porcelain and white surfaces (`#FFFFFF`, `#F8F9FA`) with hairline neutral borders (`#E5E7EB`).
- **Logo Reference Aesthetic**: Sharp ink typography, editorial precision, and refined crimson / cherry accents (`#E11D48` / `#BE123C`). No literal katana / sword graphics anywhere on the website.
- **Minimal Sakura Petals**: Subtle, tasteful micro-accents (minimal petal motifs or delicate ambient elements), avoiding clutter.
- **No AI Slop & No Badges**: 100% authentic developer craft, real code, real metrics. No gamified badges or synthetic graphics.

## Data and tech notes

The site runs on Next.js hosted on Vercel, with files and images stored in Google Drive. The database is Firebase (Firestore), and each data type below becomes a collection.

| Data type           | Key fields                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------- |
| User                | name, email, GitHub username, year and branch, skills, role (member, maintainer, admin)     |
| Organisation        | name, short name, description, logo, lead members                                           |
| Project             | name, description, tech stack, status, repo URL, demo URL, owning organisation, maintainers |
| Contribution        | user, project, issue or PR link, status, merged date                                        |
| Event               | title, type, dates, venue or link, rules, registration limit, organisation                  |
| Registration / Team | event, user or team, members, submission link, score                                        |
| Post (news)         | title, date, body, images, category                                                         |
| Module (knowledge)  | title, path, lessons, level, author                                                         |

Tech suggestions:

- Use GitHub login through Firebase Auth for sign-in, and the GitHub API (called from the backend) to read issues, PRs and contributors, cached so the site stays fast.
- Keep Google Drive as the file storage, but access it only from the backend (Drive API with a service account). Store the Drive file IDs in Firestore and serve images through a backend route or cache, since direct Drive thumbnail links can break or get rate-limited.
- Add an admin area so organisation leads can add events, posts and modules without touching code.
- Check text contrast and mobile layout, since most students will open it on a phone.

### Rule: all database calls are backend only

The frontend never talks to the database directly. Every read and write goes through our own backend.

- All Firestore and Google Drive access happens on the server (Next.js API routes or server actions), using the Firebase Admin SDK for Firestore and the Drive API for files.
- No Firestore or Drive calls in browser code. The frontend only calls our own API endpoints.
- The one client-side Firebase use is signing in with Firebase Auth. The resulting ID token is sent to the backend, which verifies it and checks the user's role (member, maintainer, admin) before touching any data.
- Set Firestore security rules to deny all client access, as a safety net in case a client call is ever added by mistake. Where possible, share Drive files only with the service account and let the backend serve them.
- Keep service account credentials (Firebase and Google Drive) in server-only environment variables on Vercel. Never use a `NEXT_PUBLIC_` variable for anything that grants database or file access.
- Validate and sanitise all input on the server. File uploads also go through the backend, which checks type and size before sending them to Drive.

## Questions for the team

- [ ] Who approves new projects: any member, or the club leads? - club leads add the projects
- [ ] Should sign-in be open to anyone with GitHub, or limited to SMVITM students (college email)? - open to anyone with github
- [ ] Does each club (GDSC, OSC, IEEE CS, ARC) manage its own page, or does one admin team run everything? - admin team
- [ ] Which events are planned for this semester, so the events page launches with real content? - events will be added later
- [ ] Do the faculty or principal want reports (contributors, events, projects per semester)? - faculty wants reports
- [ ] Where will the Rulebook of Open Source come from, and who owns it? - rulebook will be added later
