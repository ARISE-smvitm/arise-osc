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
}

/**
 * Find-or-create the member for a verified Firebase profile.
 * memberId allocation uses a counter document inside a transaction, so
 * concurrent first sign-ins can never claim the same ARISE-XXXX.
 */
export async function provisionMember(input: ProvisionInput): Promise<Member> {
  const db = getDb();
  if (!db) throw new Error("Firestore is not configured — check FIREBASE_SERVICE_ACCOUNT_KEY");

  const email = input.email.trim().toLowerCase();
  const userRef = users(db).doc(input.uid);

  const existing = await userRef.get();
  if (existing.exists) {
    const handle = input.githubHandle?.toLowerCase() ?? null;
    const githubId = typeof input.githubId === "number" ? input.githubId : null;
    if (handle || githubId) {
      await userRef.set(
        { ...(handle ? { githubHandle: handle } : {}), ...(githubId ? { githubId } : {}), updatedAt: FieldValue.serverTimestamp() },
        { merge: true },
      );
    }
    const member = memberFromDoc(existing.id, { ...(existing.data() as MemberDoc), ...(handle ? { githubHandle: handle } : {}), ...(githubId ? { githubId } : {}) });
    if (!member) throw new Error("Stored member document is malformed");
    return member;
  }

  // A member with this email may already exist under another uid (e.g. Firebase project recreated).
  const byEmail = await users(db).where("email", "==", email).limit(1).get();
  if (!byEmail.empty) {
    const snap = byEmail.docs[0];
    await users(db).doc(input.uid).set(snap.data());
    return memberFromDoc(input.uid, snap.data() as MemberDoc)!;
  }

  const counterRef = db.collection("meta").doc("memberCounter");
  const admins = adminEmails();

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
      role: admins.includes(email) ? "ADMIN" : "MEMBER",
      githubHandle: input.githubHandle?.toLowerCase() ?? null,
      githubId: typeof input.githubId === "number" ? input.githubId : null,
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
