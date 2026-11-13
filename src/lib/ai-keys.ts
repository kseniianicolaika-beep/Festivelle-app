import { sql } from "./db";

// AI provider keys. Env vars win (EXPLABS_API_KEY, OPENROUTER_API_KEY); otherwise they come from
// settings.integrations in Neon (explabs_api_key, openrouter_api_key) — that's how the Festivelle team's Vercel
// project serving hugs.festivelle.love gets them, since its env can't be edited from here. Server-only.
export type AIKeys = { explabs: string; openrouter: string };

let cached: { keys: AIKeys; at: number } | null = null;
export async function aiKeys(): Promise<AIKeys> {
  const envX = process.env.EXPLABS_API_KEY?.trim() ?? "";
  const envO = process.env.OPENROUTER_API_KEY?.trim() ?? "";
  if (envX && envO) return { explabs: envX, openrouter: envO };
  if (!cached || Date.now() - cached.at > 300_000) {
    const r = (await sql`SELECT value->>'explabs_api_key' AS x, value->>'openrouter_api_key' AS o FROM settings WHERE key = 'integrations'`.catch(() => [])) as { x: string | null; o: string | null }[];
    cached = { keys: { explabs: (r[0]?.x ?? "").trim(), openrouter: (r[0]?.o ?? "").trim() }, at: Date.now() };
  }
  return { explabs: envX || cached.keys.explabs, openrouter: envO || cached.keys.openrouter };
}
