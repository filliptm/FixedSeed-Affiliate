/**
 * Reads the custom roles claim that the Auth0 Post-Login Action injects into
 * the ID token. Kept in sync with the server-side claim namespace
 * (src/middleware/auth0.ts -> ROLES_CLAIM).
 */
const ROLES_CLAIM = "https://fixedseed.com/roles";

export function getRoles(user: unknown): string[] {
  if (!user || typeof user !== "object") return [];
  const claim = (user as Record<string, unknown>)[ROLES_CLAIM];
  if (!Array.isArray(claim)) return [];
  return claim.filter((r): r is string => typeof r === "string");
}

export function isAdmin(user: unknown): boolean {
  return getRoles(user).includes("admin");
}
