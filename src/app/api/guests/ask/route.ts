import { getWeddingBySlug, sql } from "@/lib/db";
import { isExpired, meter } from "@/lib/commerce";
import { answerGuest } from "@/lib/guest-ai";
import type { Design } from "@/lib/templates";

export const maxDuration = 45;

// Guest concierge: answers from the hosts' details only. Billed against the HOST's AI allowance.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const question = String(b.question ?? "").trim().slice(0, 500);
  if (!question) return Response.json({ error: "Ask anything about the celebration." }, { status: 400 });
  const w = await getWeddingBySlug(String(b.slug ?? ""));
  if (!w?.published || isExpired(w)) return Response.json({ error: "Not available." }, { status: 404 });
  if (!(await meter(w.owner_id, "text").catch(() => false))) return Response.json({ answer: null, fallback: true });
  const [site] = (await sql`SELECT design FROM documents WHERE wedding_id = ${w.id} AND kind = 'website' ORDER BY position LIMIT 1`) as { design: Design }[];
  const guest = typeof b.g === "string" && b.g ? ((await sql`SELECT name FROM guests WHERE wedding_id = ${w.id} AND token = ${b.g}`) as { name: string }[])[0]?.name : null;
  const answer = await answerGuest(w.profile, question, site?.design.texts?.body, guest);
  return Response.json({ answer, fallback: !answer });
}
