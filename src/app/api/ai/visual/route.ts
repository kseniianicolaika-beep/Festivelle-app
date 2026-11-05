import { nanoid } from "nanoid";
import { sql, getWeddingForUser } from "@/lib/db";
import { currentUser } from "@/lib/auth/server";
import { meter } from "@/lib/commerce";
import { putObject } from "@/lib/storage";
import { canEdit } from "@/lib/workspace";

export const maxDuration = 120;

// AI visuals (illustrations for invitations/greetings). Image models aren't part of the free text plan, so this
// switches on only when IMAGE_MODEL is set (any OpenAI-compatible /images/generations endpoint). Each image
// uses the free trial first, then credits (admin-configurable). Results land in the workspace asset library.
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });
  const model = process.env.IMAGE_MODEL;
  const key = process.env.IMAGE_API_KEY || process.env.EXPLABS_API_KEY;
  if (!model || !key) return Response.json({ error: "AI illustrations are coming soon. Our hand-drawn motifs are here meanwhile." }, { status: 501 });
  const b = await req.json().catch(() => ({}));
  const w = typeof b.weddingId === "string" ? await getWeddingForUser(b.weddingId, user) : null;
  if (!w || !canEdit(w.role)) return Response.json({ error: "Not found" }, { status: 404 });
  const prompt = String(b.prompt ?? "").trim().slice(0, 800);
  if (!prompt) return Response.json({ error: "Describe the picture you’d love." }, { status: 400 });
  if (!(await meter(user.id, "visual"))) return Response.json({ error: "You’ve used your free illustrations. Add credits under Billing.", needs: "credits" }, { status: 402 });
  const base = process.env.IMAGE_BASE_URL || process.env.EXPLABS_BASE_URL || "https://api.experientiallabs.ai/v1";
  const res = await fetch(`${base}/images/generations`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, prompt: `Elegant, romantic invitation illustration, fine-art, soft light, no text. ${prompt}`, size: "1024x1024", response_format: "b64_json" }),
    signal: AbortSignal.timeout(110_000),
  });
  const j = await res.json().catch(() => ({}));
  const b64 = j?.data?.[0]?.b64_json;
  if (!res.ok || !b64) return Response.json({ error: "The illustration didn’t come out — please try again." }, { status: 502 });
  const k = `workspaces/${w.workspace_id}/ai-${nanoid(12)}.png`;
  await putObject(k, Buffer.from(b64, "base64"), "image/png");
  const [asset] = await sql`INSERT INTO assets (workspace_id, wedding_id, key, name, kind, content_type, created_by)
    VALUES (${w.workspace_id}, ${w.id}, ${k}, ${prompt.slice(0, 120)}, 'photo', 'image/png', ${user.id}) RETURNING id, key, name, kind`;
  return Response.json({ asset });
}
