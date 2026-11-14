import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { provisionMember } from "@/lib/members";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/session";

export const runtime = "nodejs";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
} as const;

/**
 * Best-effort lookup of the GitHub profile for the OAuth access token issued
 * alongside the Firebase credential. The token is used for exactly one GitHub
 * API call and is never stored. Failure here never blocks sign-in.
 */
async function fetchGithubIdentity(accessToken: string): Promise<{ login: string; id: number } | null> {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "arise-osc",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { login?: unknown; id?: unknown };
    if (typeof data.login === "string" && typeof data.id === "number") return { login: data.login.toLowerCase(), id: data.id };
    return null;
  } catch (error) {
    console.warn("GitHub identity lookup failed; continuing without it", error);
    return null;
  }
}

/** Create an httpOnly Firebase session cookie from a client ID token, and provision the member. */
export async function POST(request: Request) {
  const adminAuth = getAdminAuth();
  if (!adminAuth) {
    return NextResponse.json({ error: "Firebase Admin is not configured on the server" }, { status: 503 });
  }

  let idToken: string | undefined;
  let githubAccessToken: string | undefined;
  try {
    const body = (await request.json()) as { idToken?: unknown; githubAccessToken?: unknown };
    if (typeof body.idToken === "string" && body.idToken.length > 0) idToken = body.idToken;
    if (typeof body.githubAccessToken === "string" && body.githubAccessToken.length > 0) githubAccessToken = body.githubAccessToken;
  } catch {
    return NextResponse.json({ error: "Expected a JSON body with an idToken" }, { status: 400 });
  }
  if (!idToken) return NextResponse.json({ error: "Missing idToken" }, { status: 400 });

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch (error) {
    console.warn("ID token verification failed", error);
    return NextResponse.json({ error: "Invalid or expired sign-in token. Please try again." }, { status: 401 });
  }

  // GitHub users without a verified email get a stable synthetic address so the
  // member record still has a unique email.
  const email = (decoded.email ?? `github-${decoded.uid}@users.arise.local`).toLowerCase();
  const name = decoded.name?.trim() || "ARISE member";
  const image = typeof decoded.picture === "string" ? decoded.picture : null;

  // Capture githubHandle/githubId so the leaderboard cron can match contributions.
  const github = githubAccessToken ? await fetchGithubIdentity(githubAccessToken) : null;

  try {
    await provisionMember({
      uid: decoded.uid,
      email,
      name,
      image,
      githubHandle: github?.login ?? null,
      githubId: github?.id ?? null,
    });
  } catch (error) {
    console.error("Member provisioning failed", error);
    return NextResponse.json({ error: "Signed in, but could not provision your member profile" }, { status: 500 });
  }

  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_SECONDS * 1000 });
  const response = NextResponse.json({ ok: true, githubLinked: Boolean(github) });
  response.cookies.set(SESSION_COOKIE, sessionCookie, COOKIE_OPTIONS);
  return response;
}

/** Clear the session cookie (sign out). */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
  return response;
}
