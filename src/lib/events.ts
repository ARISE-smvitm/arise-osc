import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";
import { EVENT_TYPES, type EventType } from "@/lib/validation";

export { EVENT_TYPES, type EventType };

export interface CommunityEvent {
  id: string;
  title: string;
  type: EventType;
  /** ISO date string, e.g. "2026-11-12" — used for sorting and storage. */
  startsAt: string;
  /** ISO date string for registration close; empty when not applicable. */
  registrationDeadline: string;
  venue: string;
  organisation: string;
  registrationOpen: boolean;
  description: string;
  createdAt: Date | null;
}

interface EventDoc {
  title?: string;
  type?: string;
  startsAt?: string;
  registrationDeadline?: string;
  venue?: string;
  organisation?: string;
  registrationOpen?: boolean;
  description?: string;
  createdAt?: Timestamp | null;
}

function isEventType(value: unknown): value is EventType {
  return typeof value === "string" && (EVENT_TYPES as readonly string[]).includes(value);
}

function eventFromDoc(id: string, data: EventDoc | undefined): CommunityEvent | null {
  if (!data?.title || !isEventType(data.type) || !data.startsAt) return null;
  return {
    id,
    title: data.title,
    type: data.type,
    startsAt: data.startsAt,
    registrationDeadline: data.registrationDeadline ?? "",
    venue: data.venue ?? "",
    organisation: data.organisation ?? "",
    registrationOpen: data.registrationOpen !== false,
    description: data.description ?? "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
  };
}

const events = (db: FirebaseFirestore.Firestore) => db.collection("events");

export interface EventInput {
  title: string;
  type: EventType;
  startsAt: string;
  registrationDeadline: string;
  venue: string;
  organisation: string;
  registrationOpen: boolean;
  description: string;
}

/** Upcoming events, chronological. */
export async function listUpcomingEvents(limit = 50): Promise<CommunityEvent[]> {
  const db = getDb();
  if (!db) return [];
  const today = new Date().toISOString().slice(0, 10);
  const query = await events(db).where("startsAt", ">=", today).orderBy("startsAt").limit(limit).get();
  return query.docs.map((doc) => eventFromDoc(doc.id, doc.data() as EventDoc)).filter((event): event is CommunityEvent => Boolean(event));
}

/** All events, chronological (admin view — includes past events). */
export async function listAllEvents(limit = 200): Promise<CommunityEvent[]> {
  const db = getDb();
  if (!db) return [];
  const query = await events(db).orderBy("startsAt").limit(limit).get();
  return query.docs.map((doc) => eventFromDoc(doc.id, doc.data() as EventDoc)).filter((event): event is CommunityEvent => Boolean(event));
}

export async function getEvent(id: string): Promise<CommunityEvent | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await events(db).doc(id).get();
  return snap.exists ? eventFromDoc(snap.id, snap.data() as EventDoc) : null;
}

export async function createEvent(input: EventInput): Promise<string> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured");
  const ref = await events(db).add({ ...input, createdAt: FieldValue.serverTimestamp() });
  return ref.id;
}

export async function updateEvent(id: string, input: Partial<EventInput>): Promise<boolean> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured");
  const ref = events(db).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.set({ ...input, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  return true;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured");
  const ref = events(db).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.delete();
  return true;
}

/** ISO date → "Nov 12, 2026" display label. Falls back to the raw string if unparseable. */
export function formatEventDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
