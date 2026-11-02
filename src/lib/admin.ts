// Platform owners. Hard-coded so access survives env/config changes and project transfers.
// An owner email only grants admin when the email is VERIFIED (e.g. Google sign-in), so nobody can
// claim admin by signing up with this address and a password. The Neon Auth "admin" role also grants it.
export const OWNER_EMAILS = ["akshay@lyvena.xyz"];

type U = { email?: string | null; emailVerified?: boolean | null; role?: string | null } | null | undefined;

export function isAdmin(user: U) {
  if (!user) return false;
  if (String(user.role ?? "").split(",").map((r) => r.trim()).includes("admin")) return true;
  const extra = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  const email = (user.email ?? "").toLowerCase();
  return !!user.emailVerified && [...OWNER_EMAILS, ...extra].includes(email);
}
