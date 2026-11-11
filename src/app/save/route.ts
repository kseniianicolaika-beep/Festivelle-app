import { currentUser } from "@/lib/auth/server";
import { sql } from "@/lib/db";
import { templateById } from "@/lib/catalog";

// "Save" heart on festivelle.love template pages → My Saved Templates (/studio/saved).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const to = (path: string) => Response.redirect(new URL(path, url.origin), 303);
  const t = templateById(url.searchParams.get("template") ?? "");
  const user = await currentUser();
  if (!user) return to(`/auth/sign-in?next=${encodeURIComponent(`/save${url.search}`)}`);
  if (t) await sql`INSERT INTO saved_templates (user_id, template_id) VALUES (${user.id}, ${t.id}) ON CONFLICT DO NOTHING`;
  return to(`/studio/saved${t ? `?added=${t.id}` : ""}`);
}
