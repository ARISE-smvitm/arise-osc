#!/usr/bin/env node
/**
 * Promote (or demote) an ARISE member by email.
 *
 * Usage:
 *   node scripts/promote-admin.mjs member@example.com           # → ADMIN
 *   node scripts/promote-admin.mjs member@example.com --demote  # → MEMBER
 *
 * Credentials: set FIREBASE_SERVICE_ACCOUNT_KEY (single-line JSON) or
 * GOOGLE_APPLICATION_CREDENTIALS (path to a service-account key file).
 */
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const [email, flag] = process.argv.slice(2);
if (!email) {
  console.error("Usage: node scripts/promote-admin.mjs member@example.com [--demote]");
  process.exit(1);
}

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

const role = flag === "--demote" ? "MEMBER" : "ADMIN";
const db = getFirestore();
const query = await db.collection("users").where("email", "==", email.trim().toLowerCase()).limit(1).get();

if (query.empty) {
  console.error(`No member found with email ${email}. Sign in once first, then re-run.`);
  process.exit(1);
}

const doc = query.docs[0];
await doc.ref.update({ role, updatedAt: FieldValue.serverTimestamp() });
console.log(`${doc.data().memberId ?? doc.id} <${doc.data().email}> → ${role}`);
