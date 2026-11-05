// Platform owners. Hard-coded so access survives env/config changes and project transfers.
// An owner email only grants admin when the email is VERIFIED (e.g. Google sign-in), so nobody can
// claim admin by signing up with this address and a password. The Neon Auth "admin" role also grants it.
export const OWNER_EMAILS = ["akshay@lyvena.xyz", "kseniia@festivelle.love"];

type U = { email?: string | null; emailVerified?: boolean | null; role?: string | null } | null | undefined;

export function isAdmin(user: U) {
  if (!user) return false;
  if (String(user.role ?? "").split(",").map((r) => r.trim()).includes("admin")) return true;
  const extra = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  const email = (user.email ?? "").toLowerCase();
  return !!user.emailVerified && [...OWNER_EMAILS, ...extra].includes(email);
}

// Unlimited, forever: platform owners never hit a paywall, AI limit, watermark or hosting expiry.
export async function isUnlimitedId(userId: string) {
  const { sql } = await import("./db");
  const r = (await sql`SELECT email, "emailVerified", role FROM neon_auth."user" WHERE id::text = ${userId}`.catch(() => [])) as { email: string; emailVerified: boolean; role: string | null }[];
  return !!r[0] && isAdmin(r[0]);
}
