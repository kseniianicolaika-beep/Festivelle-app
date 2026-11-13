import { sql } from "@/lib/db";
import { converse } from "@/lib/designer";
import { requireWedding } from "@/lib/guard";
import { createDoc, getDoc, patchDoc } from "@/lib/docs";
import { aiEnabled, withoutAI } from "@/lib/ai";
import { meter } from "@/lib/commerce";

export const maxDuration = 60;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireWedding(id);
  if ("error" in g) return g.error;
  const { message, docId, selectedPath } = await req.json();
  // "Point and ask": the element selected in the visual editor (e.g. texts.headline) gives the AI its "this/that".
  const selected = typeof selectedPath === "string" && /^[a-z0-9:._-]{1,60}$/i.test(selectedPath) ? selectedPath : undefined;
  if (typeof message !== "string" || !message.trim() || message.length > 2000) return Response.json({ error: "Message required" }, { status: 400 });

  const w = g.wedding;
  const doc = await getDoc(id, docId);
  const history = (await sql`SELECT role, content FROM messages WHERE wedding_id = ${id} ORDER BY created_at DESC LIMIT 16`).reverse() as { role: string; content: string }[];
  // Free daily AI allowance, then credits; when both are spent the (free) rule-based designer answers.
  const metered = (await aiEnabled()) ? await meter(g.user.id, "text").catch(() => true) : true;
  const run = () => converse(w.profile, w.step, message, w.theme, history, doc, selected);
  const turn = metered ? await run() : await withoutAI(run);
  if (!metered) turn.reply += "\n\n(You’ve used today’s free AI conversation — I’ll keep helping in simple mode. Add credits under Billing for the full designer.)";
  const theme = turn.theme ?? w.theme;
  await sql.transaction([
    sql`INSERT INTO messages (wedding_id, role, content) VALUES (${id}, 'user', ${message})`,
    sql`INSERT INTO messages (wedding_id, role, content, chips) VALUES (${id}, 'assistant', ${turn.reply}, ${JSON.stringify(turn.chips)}::jsonb)`,
    sql`UPDATE weddings SET profile = ${JSON.stringify(turn.profile)}::jsonb, step = ${turn.step}, theme = ${theme}, updated_at = now() WHERE id = ${id}`,
  ]);
  const updated = doc && turn.design ? await patchDoc(doc, turn.design) : null;
  const added = turn.addPiece ? await createDoc(id, turn.addPiece, turn.profile) : null;
  return Response.json({ reply: turn.reply, chips: turn.chips, profile: turn.profile, step: turn.step, theme, doc: updated, added });
}
