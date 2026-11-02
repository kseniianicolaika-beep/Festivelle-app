import { neon } from "@neondatabase/serverless";
import { isAdmin } from "./admin";

// HTTP driver: ideal for Vercel serverless/edge — one round trip per query, no pool to manage.
export const sql = neon(process.env.DATABASE_URL!);

export type Wedding = {
  id: string;
  owner_id: string;
  slug: string;
  profile: import("./profile").Profile;
  theme: string;
  step: number;
  published: boolean;
  plan: string;
  custom_domain: string | null;
};

// Owners see their own weddings; platform admins see every wedding.
export async function getWeddingForUser(id: string, user: { id: string } & Parameters<typeof isAdmin>[0]) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const admin = isAdmin(user);
  const rows = (await sql`SELECT * FROM weddings WHERE id = ${id} AND (owner_id = ${user!.id} OR ${admin})`) as Wedding[];
  return rows[0] ?? null;
}

export async function getWeddingBySlug(slug: string) {
  const rows = (await sql`SELECT * FROM weddings WHERE slug = ${slug}`) as Wedding[];
  return rows[0] ?? null;
}
