import { setEmailPrefs, verifyUnsubscribe } from "@/lib/lifecycle";

const page = (title: string, text: string) =>
  new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f8efe7;font-family:Georgia,serif;color:#3b2228;padding:24px">
<main style="max-width:440px;text-align:center"><p style="font-style:italic;font-size:26px;color:#7a1f35;margin:0 0 24px">Festivelle</p>
<h1 style="font-weight:400;font-size:28px;color:#7a1f35;margin:0 0 12px">${title}</h1><p style="font-size:16px;line-height:1.55">${text}</p></main></body></html>`, { headers: { "content-type": "text/html; charset=utf-8" } });

async function handle(req: Request) {
  const u = new URL(req.url);
  const email = (u.searchParams.get("e") ?? "").trim().toLowerCase();
  if (!(await verifyUnsubscribe(email, u.searchParams.get("t") ?? ""))) return page("Link not valid", "This unsubscribe link isn't valid. You can turn reminders off in your studio settings.");
  await setEmailPrefs(email, { unsubscribed: true });
  return page("You're unsubscribed", "You won't receive reminder emails from Festivelle any more. Receipts and messages you ask for (like guest invitations) still arrive. You can turn reminders back on in your studio settings.");
}

// GET from the email link; POST for one-click unsubscribe from mail apps.
export const GET = handle;
export const POST = handle;
