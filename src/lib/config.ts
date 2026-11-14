import { getAdminAuth, getDb } from "@/lib/firebase-admin";

/** True when Firebase Admin credentials are present so the backend can verify sessions and read Firestore. */
export function isBackendConfigured(): boolean {
  return Boolean(getAdminAuth()) && Boolean(getDb());
}
