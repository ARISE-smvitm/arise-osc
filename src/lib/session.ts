import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAuth } from "@/lib/firebase-admin";
import { getMemberByUid, type Member, type MemberRole } from "@/lib/members";

export const SESSION_COOKIE = "arise_session";
/** 5 days — Firebase allows up to 14. */
export const SESSION_MAX_AGE_SECONDS = 5 * 24 * 60 * 60;

export type SessionMember = Member;

/**
 * Verify the httpOnly Firebase session cookie and load the member from Firestore.
 * Returns null when signed out, misconfigured, or the member record is missing.
 * Cached per request so pages and layouts can call it repeatedly.
 */
export const getSessionUser = cache(async (): Promise<SessionMember | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  const adminAuth = getAdminAuth();
  if (!adminAuth) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!decoded.uid) return null;
    return await getMemberByUid(decoded.uid);
  } catch (error) {
    console.warn("Session cookie verification failed", error);
    return null;
  }
});

/** Pages: require a signed-in member, redirect to /login otherwise. */
export async function requireUser(callbackUrl: string): Promise<SessionMember> {
  const user = await getSessionUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return user;
}

/** Pages: require a specific role, redirect non-admins to /dashboard. */
export async function requireRole(role: MemberRole, callbackUrl: string): Promise<SessionMember> {
  const user = await requireUser(callbackUrl);
  if (user.role !== role) redirect("/dashboard?error=forbidden");
  return user;
}

/** API routes: simple admin predicate for 403 responses. */
export function isAdmin(user: SessionMember | null): user is SessionMember {
  return user?.role === "ADMIN";
}
