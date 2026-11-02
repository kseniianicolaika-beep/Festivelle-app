import { neon } from "@neondatabase/serverless";
import { isAdmin } from "./admin";
import type { Role } from "./workspace";

// HTTP driver: ideal for Vercel serverless/edge — one round trip per query, no pool to manage.
export const sql = neon(process.env.DATABASE_URL!);

export type Wedding = {
  id: string;
  owner_id: string;
  workspace_id: string;
  client_name: string | null;
  slug: string;
  profile: import("./profile").Profile;
  theme: string;
  step: number;
  published: boolean;
  plan: string;
  custom_domain: string | null;
};

type U = { id: string } & Parameters<typeof isAdmin>[0];

// Access = membership of the wedding's workspace. Platform admins see everything (as owner).
export async function getWeddingForUser(id: string, user: U): Promise<(Wedding & { role: Role }) | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const admin = isAdmin(user);
  const rows = (await sql`
    SELECT w.*, COALESCE(m.role, CASE WHEN ${admin} THEN 'owner' END) AS role
    FROM weddings w LEFT JOIN members m ON m.workspace_id = w.workspace_id AND m.user_id = ${user!.id}
    WHERE w.id = ${id} AND (m.user_id IS NOT NULL OR ${admin})`) as (Wedding & { role: Role })[];
  return rows[0] ?? null;
}

export async function getWeddingBySlug(slug: string) {
  const rows = (await sql`SELECT * FROM weddings WHERE slug = ${slug}`) as Wedding[];
  return rows[0] ?? null;
}
