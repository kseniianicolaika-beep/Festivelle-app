import { runLifecycle } from "@/lib/lifecycle";

export const maxDuration = 60;

// Vercel Cron (vercel.json) calls this once a day. With CRON_SECRET set in Vercel, Vercel sends
// `Authorization: Bearer $CRON_SECRET` and nothing else is accepted. Without it, only Vercel's scheduler
// (user agent vercel-cron) may trigger a real run — harmless if repeated, because every email is claimed once
// in email_log. `?dry=1` (lists recipients) always needs the secret.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const authed = !!secret && req.headers.get("authorization") === `Bearer ${secret}`;
  const dry = new URL(req.url).searchParams.get("dry") === "1";
  const fromScheduler = !secret && (req.headers.get("user-agent") ?? "").startsWith("vercel-cron/");
  if (!authed && (dry || !fromScheduler)) return new Response("Unauthorized", { status: 401 });
  const out = await runLifecycle({ dry });
  console.log("cron daily", dry ? "dry" : "run", JSON.stringify(out).slice(0, 500));
  return Response.json(out);
}
