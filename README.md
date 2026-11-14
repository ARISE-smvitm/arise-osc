# ARISE — Open Source Community | SMVITM

Platform for the ARISE open-source community at SMVITM: projects, events, newsroom, learning paths and a GitHub contribution leaderboard.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Firebase Auth (GitHub, browser) · Firestore via firebase-admin (backend only) · Tailwind CSS v4

## How the pieces fit

- **Auth (frontend):** Firebase Auth, GitHub provider only. The browser gets a Firebase ID token — nothing else.
- **Auth (backend):** `POST /api/auth/session` verifies the ID token with firebase-admin, provisions the member in Firestore (`users/{uid}`, allocates `ARISE-XXXX` from a transactional counter), auto-captures the GitHub handle via `api.github.com/user`, and sets an httpOnly `arise_session` cookie (5 days).
- **Database:** Firestore, accessed **only** from the backend (`src/lib/members.ts`). The frontend never talks to Firestore — see `firestore.rules`.
- **RBAC:** role lives in Firestore (`users/{uid}.role` = `MEMBER` | `ADMIN`). The proxy (`src/proxy.ts`) only checks cookie presence; real enforcement is server-side via `getSessionUser()` / `requireRole()` in pages and `isAdmin()` in API routes. Bootstrap admins via `ADMIN_EMAILS` (comma-separated) — they get `ADMIN` on first sign-in. Promote/demote later with `node scripts/promote-admin.mjs someone@example.com [--demote]`.

### Firestore data model

| Collection | Doc ID | Contents |
|---|---|---|
| `users` | Firebase uid | memberId, email, name, image, role, githubHandle, githubId, contributionScore, onboarding fields (college/branch/year/skills/interests/bio/links), `onboardedAt`, timestamps |
| `news` | auto-id | title, content, authorId, authorName, createdAt |
| `events` | auto-id | title, type (`Hackathon` \| `Workshop` \| `Open Source Sprint` \| `Tech Talk`), `startsAt` (ISO), venue, organisation, registrationOpen, registrationDeadline (ISO, optional), description, createdAt |
| `meta` | `memberCounter` | `{ value: n }` — transactional source for `ARISE-XXXX` memberIds |

## Admin console

`/admin` (role `ADMIN` required): overview counts and shortcuts. Manage **events** at `/admin/events` (create/edit/delete — the public `/events` page reads from Firestore), **dispatches** at `/admin/news` (edit/delete; publish at `/newsroom/new`). Seed two sample events with `node scripts/seed-events.mjs`. Admins see an "Admin" link in the navbar and on their dashboard.

## Getting started

1. `npm install`
2. Copy `.env.example` to `.env` and fill in the values (see below).
3. `npm run build && npm run dev` (or `npm run dev`).

### Firebase Auth setup (GitHub provider)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com) → add a **Web app** → copy the config into the `NEXT_PUBLIC_FIREBASE_*` variables.
2. Authentication → Sign-in method → enable **GitHub**.
3. Create a GitHub OAuth app at <https://github.com/settings/developers>:
   - Homepage URL: your site URL (e.g. `http://localhost:3000`)
   - Authorization callback URL: the handler shown in the Firebase console, e.g. `https://YOUR-PROJECT.firebaseapp.com/__/auth/handler`
   - Paste the GitHub **Client ID** and **Client Secret** into the Firebase GitHub provider settings and save.
4. Authentication → Settings → **Authorized domains**: add your dev and production domains.
5. Server-side verification: Firebase console → Project settings → **Service accounts** → *Generate new private key*. Paste the JSON (single line) as `FIREBASE_SERVICE_ACCOUNT_KEY`, or use the discrete `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` variables.
6. Firestore: create a Firestore database in the same project, then deploy the locked-down rules: `firebase deploy --only firestore:rules` (see `firestore.rules`; the client SDK should never read or write data).
7. Set `ADMIN_EMAILS` to a comma-separated list of founding admins before their first sign-in.

Members sign in → land on `/dashboard` → optionally complete `/onboarding` (skippable; GitHub handle is captured automatically at sign-in) → the leaderboard matches contributions by handle.

## GitHub-powered sections

`GITHUB_TOKEN` (classic PAT with `repo` + `read:org`, or a fine-grained PAT with **Metadata/Contents/Issues: Read** on the org's repos) powers:

- **`/projects`** — public org repositories (stars, forks, open issues, language), live on every visit, linked to detail pages
- **`/projects/[repo]`** — repo sidebar (stars/forks/issues/license/branch/topics), the rendered README (sanitized), and open issues with good-first-issue highlighting — PRs excluded
- **Homepage contributor panel** — top 3 org contributors (authenticated, 5000 req/h)
- **`/leaderboard`** — scores computed live from org-repo contributor walks (hourly cache) overlaid on cron-persisted Firestore scores; `GET /api/cron/leaderboard` (daily, `CRON_SECRET` bearer) persists them

If the org has no public repos yet, all of these render designed empty states. `node scripts/seed-events.mjs` seeds sample events if needed.

## Scripts

- `npm run dev` / `npm run build` / `npm start`
- `npm test` / `npm run test:coverage`
- `npm run lint`
- `node scripts/promote-admin.mjs member@example.com [--demote]` — grant/revoke ADMIN
