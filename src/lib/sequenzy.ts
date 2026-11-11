// Sequenzy — every transactional email (auth codes, invitations, reminders, notifications) and the
// newsletter list. Company-scoped key: SEQUENZY_API_KEY (project "Festivelle"). Sender: EMAIL_FROM.
const API = "https://api.sequenzy.com/api/v1";

import { sql } from "./db";

// The key comes from SEQUENZY_API_KEY, or — for hosting projects whose env we can't edit (the Festivelle
// team's Vercel project serving hugs.festivelle.love) — from settings.integrations.sequenzy_api_key in Neon.
let cached: { key: string; at: number } | null = null;
export async function sequenzyKey(): Promise<string> {
  const env = process.env.SEQUENZY_API_KEY?.trim();
  if (env) return env;
  if (cached && Date.now() - cached.at < 300_000) return cached.key;
  const r = (await sql`SELECT value->>'sequenzy_api_key' AS k FROM settings WHERE key = 'integrations'`.catch(() => [])) as { k: string | null }[];
  cached = { key: (r[0]?.k ?? "").trim(), at: Date.now() };
  return cached.key;
}
export const sequenzyEnabled = async () => !!(await sequenzyKey());
export const OWNER_INBOX = () => process.env.OWNER_EMAIL?.trim() || "kseniia@festivelle.love";

/** Escape user text for HTML; Sequenzy fills {{…}} placeholders, so braces are escaped too. */
export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");

/** Festivelle's email shell: cream card, wine serif title. */
export function brandedEmail(title: string, bodyHtml: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f8efe7;font-family:Georgia,'Times New Roman',serif;color:#3b2228">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:36px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#fffaf5;border:1px solid #ecd6c6;border-radius:20px">
<tr><td style="padding:28px 32px 8px"><p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:26px;color:#7a1f35">Festivelle</p></td></tr>
<tr><td style="padding:12px 32px 32px"><h1 style="margin:0 0 20px;font-weight:400;font-size:28px;line-height:1.2;color:#7a1f35">${esc(title)}</h1>${bodyHtml}</td></tr>
<tr><td style="padding:18px 32px;border-top:1px solid #f0e0d4"><p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#9a7f78">Festivelle · Celebrate. Create. Belong. · festivelle.love</p></td></tr>
</table></td></tr></table></body></html>`;
}

export async function sendTransactional(opts: { to: string; subject: string; html: string; preview?: string; replyTo?: string; idempotencyKey?: string }) {
  const res = await fetch(`${API}/transactional/send`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await sequenzyKey()}`, "Content-Type": "application/json", ...(opts.idempotencyKey ? { "Idempotency-Key": opts.idempotencyKey } : {}) },
    body: JSON.stringify({
      to: opts.to, subject: opts.subject, body: opts.html, preview: opts.preview, emailType: "transactional",
      ...(process.env.EMAIL_FROM ? { from: process.env.EMAIL_FROM } : {}),
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Sequenzy ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
}

/** Upsert a newsletter subscriber (tags + attributes). */
export async function addSubscriber(opts: { email: string; firstName?: string; tags: string[]; attributes?: Record<string, string> }) {
  const res = await fetch(`${API}/subscribers`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await sequenzyKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email: opts.email, firstName: opts.firstName, tags: opts.tags, ...(opts.attributes ? { customAttributes: opts.attributes } : {}) }),
  });
  if (!res.ok) throw new Error(`Sequenzy ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
}
