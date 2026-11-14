"use client";

import { GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

export type SignInResult = { ok: true } | { ok: false; error: string };

const NOT_CONFIGURED = "Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* variables and restart the dev server.";

function errorMessage(error: unknown): string {
  if (typeof error === "object" && error && "code" in error) {
    const code = String((error as { code: unknown }).code);
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
      return "The sign-in popup was closed before finishing.";
    }
    if (code === "auth/popup-blocked") return "Your browser blocked the sign-in popup. Allow popups for this site and try again.";
    if (code === "auth/account-exists-with-different-credential") return "This email is already linked to a different sign-in method.";
    if (code === "auth/unauthorized-domain") return "This domain is not authorized in the Firebase console (Authentication → Settings → Authorized domains).";
    if (code === "auth/invalid-api-key" || code === "auth/app-not-authorized") return NOT_CONFIGURED;
  }
  return "GitHub sign-in failed. Please try again.";
}

async function createSessionCookie(idToken: string, githubAccessToken?: string): Promise<SignInResult> {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken, ...(githubAccessToken ? { githubAccessToken } : {}) }),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, error: body?.error ?? "Could not create a session. Is the backend configured?" };
  }
  return { ok: true };
}

/** GitHub popup sign-in → Firebase ID token → httpOnly session cookie. */
export async function signInWithGithub(): Promise<SignInResult> {
  if (!isFirebaseConfigured()) return { ok: false, error: NOT_CONFIGURED };
  try {
    const provider = new GithubAuthProvider();
    provider.addScope("read:user");
    provider.addScope("user:email");
    const result = await signInWithPopup(getFirebaseAuth(), provider);
    const idToken = await result.user.getIdToken();
    const githubAccessToken = GithubAuthProvider.credentialFromResult(result)?.accessToken;
    return await createSessionCookie(idToken, githubAccessToken);
  } catch (error) {
    console.error("GitHub sign-in failed", error);
    return { ok: false, error: errorMessage(error) };
  }
}

/** Re-establish the httpOnly cookie from the locally persisted Firebase user (no popup). */
export async function refreshSessionCookie(): Promise<boolean> {
  try {
    if (!isFirebaseConfigured()) return false;
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (!user) return false;
    const idToken = await user.getIdToken();
    const result = await createSessionCookie(idToken);
    return result.ok;
  } catch (error) {
    console.error("Session refresh failed", error);
    return false;
  }
}

/** Clear the backend cookie and the local Firebase session. */
export async function signOutEverywhere(): Promise<void> {
  try {
    await fetch("/api/auth/session", { method: "DELETE" });
  } finally {
    if (isFirebaseConfigured()) {
      await signOut(getFirebaseAuth());
    }
  }
}
