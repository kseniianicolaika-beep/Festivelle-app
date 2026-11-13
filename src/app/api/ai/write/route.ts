import { currentUser } from "@/lib/auth/server";
import { aiEnabled, writeTexts } from "@/lib/ai";
import { meter } from "@/lib/commerce";

export const maxDuration = 60;

// AI writing: invitation texts, birthday wishes, personal greetings. Free allowance, then credits.
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const brief = String(b.brief ?? "").trim().slice(0, 1500);
  const lang = ["en", "ru", "hi"].includes(b.lang) ? b.lang : "en";
  if (!brief) return Response.json({ error: "Tell me who it’s for and the feeling you want." }, { status: 400 });
  if (!(await aiEnabled())) return Response.json({ error: "AI writing is resting right now — please try again shortly." }, { status: 503 });
  if (!(await meter(user.id, "text"))) return Response.json({ error: "You’ve used today’s free AI. Add credits under Billing to keep writing.", needs: "credits" }, { status: 402 });
  const options = await writeTexts(brief, lang);
  if (!options) return Response.json({ error: "The muse is busy — try again in a moment." }, { status: 503 });
  return Response.json({ options });
}
