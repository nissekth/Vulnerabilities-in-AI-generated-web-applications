import { auth } from "./firebase";

/**
 * We use custom claims for admin/owner.
 * - owner: true
 * - admin: true
 *
 * Claims are set by Cloud Functions (owner-only).
 */
export async function getClaims(): Promise<{ admin: boolean; owner: boolean }> {
  const user = auth.currentUser;
  if (!user) return { admin: false, owner: false };

  const token = await user.getIdTokenResult(true);
  const admin = Boolean(token.claims.admin);
  const owner = Boolean(token.claims.owner);
  return { admin, owner };
}

