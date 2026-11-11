// Helpers for the JSON endpoints the marketing site (festivelle.love) posts to.
const ALLOWED = [/^https:\/\/(www\.)?festivelle\.love$/, /^https:\/\/[a-z0-9-]+\.vercel\.app$/, /^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/];

export function cors(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  return ALLOWED.some((r) => r.test(origin))
    ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Access-Control-Max-Age": "86400", Vary: "Origin" }
    : { Vary: "Origin" };
}

export const preflight = (req: Request) => new Response(null, { status: 204, headers: cors(req) });
export const reply = (req: Request, body: Record<string, unknown>, status = 200) => Response.json(body, { status, headers: { ...cors(req), "Cache-Control": "no-store" } });

export const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
export const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "").trim().slice(0, max) : "");

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  if (Number(req.headers.get("content-length") ?? 0) > 20_000) return null;
  try { const j = await req.json(); return j && typeof j === "object" ? (j as Record<string, unknown>) : null; } catch { return null; }
}
