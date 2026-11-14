import { applicationDefault, cert, getApps, initializeApp, type App, type Credential } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// Server-only Firebase Admin SDK. Never import this from client components.
// Credentials come from either:
//   FIREBASE_SERVICE_ACCOUNT_KEY — full service-account JSON on a single line, or
//   FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY (with \n escapes), or
//   GOOGLE_APPLICATION_CREDENTIALS — path to a JSON key file (application default).

let cachedApp: App | null | undefined; // undefined = not attempted yet
let warned = false;

function warnOnce(message: string, error?: unknown) {
  if (warned) return;
  warned = true;
  console.error(message, error ?? "");
}

function loadCredential(): Credential | null {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountJson) {
    try {
      return cert(JSON.parse(serviceAccountJson) as Parameters<typeof cert>[0]);
    } catch (error) {
      warnOnce(
        "FIREBASE_SERVICE_ACCOUNT_KEY is set but is not valid JSON. " +
        "Paste the full service-account JSON on ONE line (or use FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY).",
        error,
      );
      return null;
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (projectId && clientEmail && privateKey) {
    return cert({ projectId, clientEmail, privateKey });
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return applicationDefault();
  }

  return null;
}

function getAdminApp(): App | null {
  if (cachedApp !== undefined) return cachedApp;
  const existing = getApps()[0];
  if (existing) {
    cachedApp = existing;
    return cachedApp;
  }
  const credential = loadCredential();
  cachedApp = credential ? initializeApp({ credential }) : null; // null → not configured; pages degrade gracefully
  return cachedApp;
}

export function getAdminAuth(): Auth | null {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}

/** Firestore access for the backend. Lazy — never connects at import time. */
export function getDb(): Firestore | null {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}
