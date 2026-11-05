import { sql } from "@/lib/db";

// Outbound click to a partner (counts placements' performance).
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 });
  const [p] = (await sql`UPDATE partners SET clicks = clicks + 1 WHERE id = ${id} AND active RETURNING url`) as { url: string | null }[];
  if (!p?.url || !/^https?:\/\//.test(p.url)) return Response.redirect(new URL("/partners", req.url), 303);
  return Response.redirect(p.url, 302);
}
