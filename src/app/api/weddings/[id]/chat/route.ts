import { sql } from "@/lib/db";
import { converse } from "@/lib/designer";
import { requireOwner } from "@/lib/guard";

export const maxDuration = 60;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireOwner(id);
  if ("error" in g) return g.error;
  const { message } = await req.json();
  if (typeof message !== "string" || !message.trim() || message.length > 2000) return Response.json({ error: "Message required" }, { status: 400 });

  const w = g.wedding;
  const history = (await sql`SELECT role, content FROM messages WHERE wedding_id = ${id} ORDER BY created_at DESC LIMIT 16`).reverse() as { role: string; content: string }[];
  const turn = await converse(w.profile, w.step, message, w.theme, history);
  const theme = turn.theme ?? w.theme;
  await sql.transaction([
    sql`INSERT INTO messages (wedding_id, role, content) VALUES (${id}, 'user', ${message})`,
    sql`INSERT INTO messages (wedding_id, role, content, chips) VALUES (${id}, 'assistant', ${turn.reply}, ${JSON.stringify(turn.chips)}::jsonb)`,
    sql`UPDATE weddings SET profile = ${JSON.stringify(turn.profile)}::jsonb, step = ${turn.step}, theme = ${theme}, updated_at = now() WHERE id = ${id}`,
  ]);
  return Response.json({ ...turn, theme });
}
