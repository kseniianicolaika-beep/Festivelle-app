// Neon Auth email webhook (send.otp, send.magic_link): sign-up codes, password-reset codes and
// sign-in links, delivered through Sequenzy (Resend only as a fallback when configured).
// Verifies Neon's Ed25519 signature over the raw body before reading anything, accepts only links on
// the auth origin, and never logs recipients, codes or links.
import { createHash } from "node:crypto";
import { z } from "zod";
import { NeonWebhookError, verifyNeonWebhook, webhookUrls } from "./neon-webhook";
import { brandedEmail, esc, sequenzyKey } from "@/lib/sequenzy";

const SEQUENZY_URL = "https://api.sequenzy.com/api/v1/transactional/send";
const RESEND_URL = "https://api.resend.com/emails";
/** Neon waits 5s per attempt (and retries twice); answer before it gives up. */
const PROVIDER_BUDGET_MS = 4000;

type Provider = "sequenzy" | "resend";
type Rendered = { from: string; to: string; subject: string; html: string; text: string; preview: string };

function configuredKey(name: string): string | null {
  const key = process.env[name]?.trim();
  return key && !/[\s\x00-\x1f\x7f]/.test(key) ? key : null;
}

let seqKey = "";
export async function authEmailProviders(): Promise<Provider[]> {
  seqKey = (await sequenzyKey()).replace(/[\s\x00-\x1f\x7f]/g, "");
  return [
    ...(seqKey ? ["sequenzy" as const] : []),
    ...(configuredKey("RESEND_API_KEY") ? ["resend" as const] : []),
  ];
}

function requestFor(provider: Provider, email: Rendered, idem: { eventId: string; hash: string }) {
  if (provider === "sequenzy") {
    return {
      url: SEQUENZY_URL,
      key: seqKey,
      idempotencyKey: `festivelle-auth-${idem.eventId}-${idem.hash}`,
      body: JSON.stringify({
        to: email.to, from: email.from, subject: email.subject, body: email.html, preview: email.preview,
        emailType: "transactional",
        // Codes must arrive unchanged: no redirect wrapping, no tracking pixel.
        trackingSettings: { clickTracking: false, openTracking: false },
      }),
    };
  }
  return {
    url: RESEND_URL,
    key: configuredKey("RESEND_API_KEY")!,
    idempotencyKey: `festivelle-auth/${idem.eventId}/${idem.hash}`,
    body: JSON.stringify({ from: email.from, to: email.to, subject: email.subject, html: email.html, text: email.text }),
  };
}

async function deliver(provider: Provider, email: Rendered, idem: { eventId: string; hash: string }, deadline: number) {
  const { url, key, idempotencyKey, body } = requestFor(provider, email, idem);
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const response = await Promise.race([
      fetch(url, { method: "POST", redirect: "error", signal: controller.signal, headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey }, body }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(new NeonWebhookError(503, "Auth email delivery unavailable")); }, Math.max(0, deadline - Date.now()));
      }),
    ]);
    void response.body?.cancel().catch(() => {});
    if (!response.ok) throw Object.assign(new NeonWebhookError(503, "Auth email delivery unavailable"), { providerStatus: response.status });
  } finally { clearTimeout(timer); }
}

function logFailure(provider: Provider, eventId: string, error: unknown) {
  const status = (error as { providerStatus?: number })?.providerStatus;
  console.error(JSON.stringify({ event: "auth_email_failed", provider, status: status ?? "no_response", event_id: eventId }));
}

export const fromAddress = () => process.env.EMAIL_FROM?.trim() || "Festivelle <hello@festivelle.sequenzymail.com>";

export async function handleAuthEmail(request: Request): Promise<Response> {
  const respond = (body: Record<string, unknown>, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (request.method !== "GET" && request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "GET, POST" } });
  try {
    const urls = webhookUrls();
    const providers = await authEmailProviders();
    const from = fromAddress();
    const sender = from.match(/^[^<>]*<([^<>]+)>$/)?.[1] ?? from;
    if (!providers.length || /[\x00-\x1f\x7f]/.test(from) || !z.email().safeParse(sender).success) throw new NeonWebhookError(503, "Auth email configuration unavailable");
    if (request.method === "GET") return respond({ ok: true, provider: providers[0], fallback: providers[1] ?? null });

    const event = await verifyNeonWebhook(request, urls);
    const isOtp = event.event_type === "send.otp";
    const kind = isOtp ? event.event_data.otp_type : event.event_data.link_type;
    const title = kind === "forget-password" ? "Reset your password" : kind === "email-verification" ? "Verify your email" : "Sign in to Festivelle";
    const expiry = new Date(event.event_data.expires_at).toISOString().replace("T", " ").slice(0, 16);
    const greeting = `Hello ${event.user.name || "there"},`;
    const content = isOtp
      ? `<p style="margin:0 0 16px;font-size:16px;line-height:1.6">Enter this code to continue:</p><p style="margin:0 0 24px;padding:18px;border:1px solid #e8cdb9;border-radius:14px;background:#fff8f1;font-family:Georgia,serif;font-size:34px;letter-spacing:10px;text-align:center;color:#7a1f35">${esc(event.event_data.otp_code)}</p>`
      : `<p style="margin:0 0 24px"><a href="${esc(event.event_data.link_url)}" style="display:inline-block;padding:14px 30px;background:#7a1f35;color:#fff;text-decoration:none;border-radius:999px;font-family:Helvetica,Arial,sans-serif;font-size:14px">${esc(title)}</a></p>`;
    const email: Rendered = {
      from, to: event.user.email, subject: `${title}${isOtp ? " — your code" : ""}`,
      html: brandedEmail(title, `<p style="margin:0 0 18px;font-size:16px">${esc(greeting)}</p>${content}<p style="margin:0;font-size:13px;color:#8a6f68">Expires ${esc(expiry)} UTC. Never share this ${isOtp ? "code" : "link"}. If you didn't ask for it, you can ignore this email.</p>`),
      text: `${title}\n\n${greeting}\n${isOtp ? `Your code: ${event.event_data.otp_code}` : `Continue: ${event.event_data.link_url}`}\n\nExpires ${expiry} UTC. Never share this ${isOtp ? "code" : "link"}.\n\nFestivelle`,
      preview: isOtp ? "Your Festivelle code" : title,
    };
    const idem = { eventId: event.event_id, hash: createHash("sha256").update(JSON.stringify(email)).digest("hex") };
    const deadline = Date.now() + PROVIDER_BUDGET_MS;
    let lastError: unknown;
    for (const [i, provider] of providers.entries()) {
      try {
        await deliver(provider, email, idem, i < providers.length - 1 ? Math.min(deadline, Date.now() + 2500) : deadline);
        return respond({ ok: true });
      } catch (error) {
        lastError = error;
        logFailure(provider, event.event_id, error);
        if (Date.now() >= deadline) break;
      }
    }
    throw lastError instanceof NeonWebhookError ? lastError : new NeonWebhookError(503, "Auth email unavailable");
  } catch (error) {
    return respond({ error: error instanceof NeonWebhookError ? error.message : "Auth email unavailable" }, error instanceof NeonWebhookError ? error.status : 503);
  }
}
