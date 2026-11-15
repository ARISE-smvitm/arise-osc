import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";

export type MemberRole = "MEMBER" | "ADMIN";

export interface Member {
  /** Firebase auth uid — also the Firestore document ID. */
  id: string;
  memberId: string;
  email: string;
  name: string;
  image: string | null;
  role: MemberRole;
  githubHandle: string | null;
  githubId: number | null;
  /** Verified emails reported by the GitHub provider — union-matched against ADMIN_EMAILS. */
  githubEmails: string[];
  contributionScore: number;
  bio: string;
  college: string;
  branch: string;
  year: number | null;
  skills: string[];
  interests: string[];
  linkedin: string;
  website: string;
  onboardedAt: Date | null;
  createdAt: Date | null;
}

interface MemberDoc {
  memberId?: string;
  email?: string;
  name?: string;
  image?: string | null;
  role?: string;
  githubHandle?: string | null;
  githubId?: number | null;
  githubEmails?: string[];
  contributionScore?: number;
  bio?: string;
  college?: string;
  branch?: string;
  year?: number | null;
  skills?: string[];
  interests?: string[];
  linkedin?: string;
  website?: string;
  onboardedAt?: Timestamp | null;
  createdAt?: Timestamp | null;
}

function asDate(value: Timestamp | null | undefined): Date | null {
  return value instanceof Timestamp ? value.toDate() : null;
}

function memberFromDoc(id: string, data: MemberDoc | undefined): Member | null {
  if (!data || !data.memberId || !data.email || !data.name) return null;
  const role: MemberRole = data.role === "ADMIN" ? "ADMIN" : "MEMBER";
  return {
    id,
    memberId: data.memberId,
    email: data.email,
    name: data.name,
    image: data.image ?? null,
    role,
    githubHandle: data.githubHandle ?? null,
    githubId: typeof data.githubId === "number" ? data.githubId : null,
    githubEmails: Array.isArray(data.githubEmails) ? data.githubEmails : [],
    contributionScore: typeof data.contributionScore === "number" ? data.contributionScore : 0,
    bio: data.bio ?? "",
    college: data.college ?? "",
    branch: data.branch ?? "",
    year: typeof data.year === "number" ? data.year : null,
    skills: Array.isArray(data.skills) ? data.skills : [],
    interests: Array.isArray(data.interests) ? data.interests : [],
    linkedin: data.linkedin ?? "",
    website: data.website ?? "",
    onboardedAt: asDate(data.onboardedAt),
    createdAt: asDate(data.createdAt),
  };
}

const users = (db: FirebaseFirestore.Firestore) => db.collection("users");

export async function getMemberByUid(uid: string): Promise<Member | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await users(db).doc(uid).get();
  return snap.exists ? memberFromDoc(snap.id, snap.data() as MemberDoc) : null;
}

export async function getMemberByMemberId(memberId: string): Promise<Member | null> {
  const db = getDb();
  if (!db) return null;
  const query = await users(db).where("memberId", "==", memberId).limit(1).get();
  const snap = query.docs[0];
  return snap ? memberFromDoc(snap.id, snap.data() as MemberDoc) : null;
}

export async function listTopMembers(limit = 100): Promise<Array<Pick<Member, "memberId" | "name" | "image" | "githubHandle" | "contributionScore">>> {
  const db = getDb();
  if (!db) return [];
  const query = await users(db).orderBy("contributionScore", "desc").limit(limit).get();
  return query.docs.map((doc) => {
    const data = doc.data() as MemberDoc;
    return {
      memberId: data.memberId ?? doc.id,
      name: data.name ?? "Unknown member",
      image: data.image ?? null,
      githubHandle: data.githubHandle ?? null,
      contributionScore: data.contributionScore ?? 0,
    };
  });
}

export async function updateMember(
  uid: string,
  data: Partial<Omit<Member, "id" | "memberId" | "email" | "role" | "createdAt" | "contributionScore" | "onboardedAt">> & { onboardedAt?: boolean },
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured");
  const { onboardedAt, ...rest } = data;
  const update: Record<string, unknown> = { ...rest, updatedAt: FieldValue.serverTimestamp() };
  if (onboardedAt === true) update.onboardedAt = FieldValue.serverTimestamp();
  await users(db).doc(uid).set(update, { merge: true });
}

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export interface ProvisionInput {
  uid: string;
  email: string;
  name: string;
  image: string | null;
  githubHandle?: string | null;
  githubId?: number | null;
  githubEmails?: string[];
}

function normalizeEmails(emails: Array<string | undefined | null>): string[] {
  return emails
    .filter((email): email is string => typeof email === "string")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/** Lowercased verified GitHub emails + the token email — the set ADMIN_EMAILS is matched against. */
function adminCandidates(input: ProvisionInput): string[] {
  return [...new Set(normalizeEmails([input.email, ...(input.githubEmails ?? [])]))];
}

/** True when any candidate is in ADMIN_EMAILS. */
function wantsAdmin(input: ProvisionInput): boolean {
  const admins = adminEmails();
  if (admins.length === 0) return false;
  return adminCandidates(input).some((email) => admins.includes(email));
}

/**
 * Find-or-create the member for a verified Firebase profile.
 * memberId allocation uses a counter document inside a transaction, so
 * concurrent first sign-ins can never claim the same ARISE-XXXX.
 * ADMIN_EMAILS is union-matched against the token email and every verified
 * GitHub email on every sign-in — list membership promotes (never demotes).
 */
export async function provisionMember(input: ProvisionInput): Promise<Member> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured — check FIREBASE_SERVICE_ACCOUNT_KEY");

  const email = input.email.trim().toLowerCase();
  const githubEmails = normalizeEmails(input.githubEmails ?? []);
  const promote = wantsAdmin({ ...input, email, githubEmails });
  const userRef = users(db).doc(input.uid);

  const existing = await userRef.get();
  if (existing.exists) {
    const data = existing.data() as MemberDoc;
    const handle = input.githubHandle?.toLowerCase() ?? null;
    const githubId = typeof input.githubId === "number" ? input.githubId : null;
    await userRef.set(
      {
        ...(githubEmails.length ? { githubEmails } : {}),
        ...(handle ? { githubHandle: handle } : {}),
        ...(githubId ? { githubId } : {}),
        ...(promote && data.role !== "ADMIN" ? { role: "ADMIN" } : {}),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    const merged = {
      ...data,
      githubEmails: githubEmails.length ? githubEmails : data.githubEmails,
      githubHandle: handle ?? data.githubHandle ?? null,
      githubId: githubId ?? data.githubId ?? null,
      role: promote ? "ADMIN" : data.role,
    };
    const member = memberFromDoc(existing.id, merged);
    if (!member) throw new Error("Stored member document is malformed");
    return member;
  }

  // A member with this email may already exist under another uid (e.g. Firebase project recreated).
  const byEmail = await users(db).where("email", "==", email).limit(1).get();
  if (!byEmail.empty) {
    const snap = byEmail.docs[0];
    const current = snap.data() as MemberDoc;
    const linked = {
      ...current,
      githubEmails: githubEmails.length ? githubEmails : current.githubEmails,
      githubHandle: input.githubHandle?.toLowerCase() ?? current.githubHandle ?? null,
      githubId: typeof input.githubId === "number" ? input.githubId : current.githubId ?? null,
      role: promote ? "ADMIN" : current.role,
    };
    await users(db).doc(input.uid).set({ ...linked, updatedAt: FieldValue.serverTimestamp() });
    return memberFromDoc(input.uid, linked)!;
  }

  const counterRef = db.collection("meta").doc("memberCounter");

  const created = await db.runTransaction(async (tx) => {
    const counterSnap = await tx.get(counterRef);
    const current = counterSnap.exists && typeof counterSnap.data()?.value === "number" ? (counterSnap.data()!.value as number) : 0;
    const next = current + 1;
    const memberId = `ARISE-${String(next).padStart(4, "0")}`;
    const doc: MemberDoc = {
      memberId,
      email,
      name: input.name.trim() || "ARISE member",
      image: input.image,
      role: promote ? "ADMIN" : "MEMBER",
      githubHandle: input.githubHandle?.toLowerCase() ?? null,
      githubId: typeof input.githubId === "number" ? input.githubId : null,
      githubEmails,
      contributionScore: 0,
      bio: "",
      college: "",
      branch: "",
      year: null,
      skills: [],
      interests: [],
      linkedin: "",
      website: "",
      onboardedAt: null,
      createdAt: Timestamp.now(),
    };
    tx.set(counterRef, { value: next }, { merge: true });
    tx.set(userRef, { ...doc, createdAt: FieldValue.serverTimestamp() });
    return doc;
  });

  return memberFromDoc(input.uid, created as MemberDoc)!;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date | null;
}

export async function listNews(limit = 100): Promise<NewsArticle[]> {
  const db = getDb();
  if (!db) return [];
  const query = await db.collection("news").orderBy("createdAt", "desc").limit(limit).get();
  return query.docs.map((doc) => toNewsArticle(doc));
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await db.collection("news").doc(id).get();
  return snap.exists ? toNewsArticle(snap) : null;
}

function toNewsArticle(doc: FirebaseFirestore.DocumentSnapshot): NewsArticle {
  const data = doc.data() ?? {};
  return {
    id: doc.id,
    title: data.title ?? "",
    content: data.content ?? "",
    authorId: data.authorId ?? "",
    authorName: data.authorName ?? "ARISE",
    createdAt: asDate(data.createdAt as Timestamp | undefined),
  };
}

export async function updateNews(id: string, input: { title?: string; content?: string }): Promise<boolean> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured");
  const ref = db.collection("news").doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.set({ ...input, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  return true;
}

export async function deleteNews(id: string): Promise<boolean> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured");
  const ref = db.collection("news").doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.delete();
  return true;
}

export async function createNews(input: { title: string; content: string; authorId: string; authorName: string }): Promise<string> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured");
  const ref = await db.collection("news").add({
    title: input.title,
    content: input.content,
    authorId: input.authorId,
    authorName: input.authorName,
    createdAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

/** Document count for a collection (Firestore count() aggregation). 0 when unconfigured. */
export async function countCollection(name: string): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  const snap = await db.collection(name).count().get();
  return snap.data().count;
}

/** Apply aggregated GitHub contribution scores to matching members (by lowercase handle). */
export async function applyContributionScores(scores: Map<string, number>): Promise<{ updated: number }> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured");
  const handles = [...scores.keys()].map((handle) => handle.toLowerCase()).filter(Boolean);
  let updated = 0;
  // Firestore `in` supports up to 30 values per query.
  for (let start = 0; start < handles.length; start += 30) {
    const chunk = handles.slice(start, start + 30);
    const query = await users(db).where("githubHandle", "in", chunk).get();
    if (query.empty) continue;
    const batch = db.batch();
    for (const doc of query.docs) {
      const handle = String((doc.data() as MemberDoc).githubHandle ?? "").toLowerCase();
      const score = scores.get(handle);
      if (typeof score === "number") {
        batch.update(doc.ref, { contributionScore: score, updatedAt: FieldValue.serverTimestamp() });
        updated += 1;
      }
    }
    await batch.commit();
  }
  return { updated };
}
