#!/usr/bin/env node
/**
 * Seed the two sample events from src/data/mockData.ts into Firestore.
 * Run once after firebase is configured:  node scripts/seed-events.mjs
 * Credentials: FIREBASE_SERVICE_ACCOUNT_KEY (single-line JSON) or GOOGLE_APPLICATION_CREDENTIALS.
 */
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const SAMPLE_EVENTS = [
  {
    title: "Hacktoberfest Sprint 2026: SMVITM Upstream",
    type: "Open Source Sprint",
    startsAt: "2026-11-12",
    registrationDeadline: "2026-11-10",
    venue: "Central Computing Lab 3 & Online",
    organisation: "OSC",
    registrationOpen: true,
    description: "A 12-hour guided contribution sprint. Pick verified beginner issues, open PRs, and get code merged into active club repositories.",
  },
  {
    title: "Rust for Systems & Embedded Nodes",
    type: "Workshop",
    startsAt: "2026-11-22",
    registrationDeadline: "2026-11-20",
    venue: "Seminar Hall 2",
    organisation: "IEEE CS x ARC",
    registrationOpen: true,
    description: "Hands-on deep dive into memory safety, bare-metal microcontroller drivers, and writing fast microservices.",
  },
];

const credential = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
  : process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? applicationDefault()
    : null;

if (!credential) {
  console.error("Set FIREBASE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS first.");
  process.exit(1);
}

if (!getApps().length) initializeApp({ credential });
const db = getFirestore();
const existing = await db.collection("events").limit(1).get();
if (!existing.empty) {
  console.log("events collection is not empty — skipping seed to avoid duplicates.");
  process.exit(0);
}
for (const event of SAMPLE_EVENTS) {
  const ref = await db.collection("events").add({ ...event, createdAt: FieldValue.serverTimestamp() });
  console.log(`created ${ref.id}: ${event.title}`);
}
console.log(`Seeded ${SAMPLE_EVENTS.length} sample events.`);
