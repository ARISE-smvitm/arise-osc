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
 * Best-effort GitHub profile + full verified email list for the OAuth access
 * token issued alongside the Firebase credential. The token is used for these
 * two GitHub API calls and is never stored. Failure never blocks sign-in.
 */
async function fetchGithubProfile(accessToken: string): Promise<{ login: string; id: number; emails: string[] } | null> {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "arise-osc",
    Authorization: `Bearer ${accessToken}`,
  };
  try {
    const [userResponse, emailsResponse] = await Promise.all([
      fetch("https://api.github.com/user", { headers, cache: "no-store" }),
      fetch("https://api.github.com/user/emails", { headers, cache: "no-store" }),
    ]);
    if (!userResponse.ok) return null;
    const user = (await userResponse.json()) as { login?: unknown; id?: unknown };
    if (typeof user.login !== "string" || typeof user.id !== "number") return null;
    let emails: string[] = [];
    if (emailsResponse.ok) {
      const list = (await emailsResponse.json()) as unknown;
      emails = (Array.isArray(list) ? list : [])
        .filter((entry): entry is { email?: string; verified?: boolean } => typeof entry === "object" && entry !== null)
        .filter((entry) => entry.verified === true && typeof entry.email === "string")
        .map((entry) => (entry.email as string).trim().toLowerCase());
    }
    return { login: user.login.toLowerCase(), id: user.id, emails };
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

  // Capture handle + ALL verified emails so ADMIN_EMAILS can match any of them.
  const github = githubAccessToken ? await fetchGithubProfile(githubAccessToken) : null;

  try {
    await provisionMember({
      uid: decoded.uid,
      email,
      name,
      image,
      githubHandle: github?.login ?? null,
      githubId: github?.id ?? null,
      githubEmails: github?.emails ?? [],
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
