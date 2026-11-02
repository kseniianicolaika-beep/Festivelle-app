import { neon } from "@neondatabase/serverless";

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

export async function getWeddingForOwner(id: string, ownerId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = (await sql`SELECT * FROM weddings WHERE id = ${id} AND owner_id = ${ownerId}`) as Wedding[];
  return rows[0] ?? null;
}

export async function getWeddingBySlug(slug: string) {
  const rows = (await sql`SELECT * FROM weddings WHERE slug = ${slug}`) as Wedding[];
  return rows[0] ?? null;
}
