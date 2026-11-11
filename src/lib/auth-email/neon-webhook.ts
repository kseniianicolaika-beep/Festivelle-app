import { base64url, compactVerify, createRemoteJWKSet, decodeProtectedHeader, errors } from "jose";
import { z } from "zod";

const MAX_BODY_BYTES = 64 * 1024;
const MAX_CLOCK_SKEW_MS = 5 * 60_000;
// Stay inside Resend's 24-hour deduplication retention, even for freshly signed retries.
const MAX_EVENT_LIFETIME_MS = 23 * 3600_000;
let cachedKeys: { url: string; keys: ReturnType<typeof createRemoteJWKSet> } | undefined;

export class NeonWebhookError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}

export function webhookUrls() {
  try {
    const authBase = new URL(process.env.NEON_AUTH_BASE_URL ?? "");
    const jwks = new URL(process.env.NEON_AUTH_JWKS_URL ?? "");
    for (const url of [authBase, jwks]) {
      if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) throw new Error();
    }
    return { authBase, jwks };
  } catch {
    throw new NeonWebhookError(503, "Auth email configuration unavailable");
  }
}

const emailKind = z.enum(["sign-in", "email-verification", "forget-password"]);
const eventSchema = z.object({
  event_id: z.uuid(),
  timestamp: z.iso.datetime({ offset: true }),
  user: z.object({ email: z.email().max(254), name: z.string().max(200).optional() }),
}).and(z.discriminatedUnion("event_type", [
  z.object({
    event_type: z.literal("send.otp"),
    event_data: z.object({
      otp_code: z.string().regex(/^[0-9]{6}$/),
      otp_type: emailKind,
      delivery_preference: z.literal("email").optional(),
      expires_at: z.iso.datetime({ offset: true }),
    }),
  }),
  z.object({
    event_type: z.literal("send.magic_link"),
    event_data: z.object({
      link_url: z.string().min(1).max(4096),
      link_type: emailKind,
      expires_at: z.iso.datetime({ offset: true }),
    }),
  }),
]));

/** Verify Neon's detached JWS over timestamp + base64url(raw bytes), before parsing JSON. */
export async function verifyNeonWebhook(request: Request, urls: ReturnType<typeof webhookUrls>) {
  const signature = request.headers.get("x-neon-signature") ?? "";
  const kid = request.headers.get("x-neon-signature-kid") ?? "";
  const timestamp = request.headers.get("x-neon-timestamp") ?? "";
  const eventId = request.headers.get("x-neon-event-id");
  const eventType = request.headers.get("x-neon-event-type");
  if (!/^[A-Za-z0-9_-]+\.\.[A-Za-z0-9_-]+$/.test(signature) || signature.length > 2048 ||
      !kid || kid.length > 128 || !/^\d{13}$/.test(timestamp) ||
      Math.abs(Date.now() - Number(timestamp)) > MAX_CLOCK_SKEW_MS || !eventId || !eventType) {
    throw new NeonWebhookError(401, "Invalid webhook signature");
  }
  const [header, , signed] = signature.split(".");
  try {
    const protectedHeader = decodeProtectedHeader(signature);
    if (protectedHeader.alg !== "EdDSA" || protectedHeader.kid !== kid || protectedHeader.b64 === false ||
        protectedHeader.jku || protectedHeader.jwk || protectedHeader.x5u) throw new Error();
  } catch {
    throw new NeonWebhookError(401, "Invalid webhook signature");
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new NeonWebhookError(415, "Expected application/json");
  }
  const length = request.headers.get("content-length");
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_BODY_BYTES)) {
    throw new NeonWebhookError(413, "Webhook body too large");
  }
  if (!request.body) throw new NeonWebhookError(400, "Missing webhook body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new NeonWebhookError(408, "Webhook body timeout")), 2000);
  });
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), deadline]);
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) throw new NeonWebhookError(413, "Webhook body too large");
      chunks.push(value);
    }
  } finally {
    clearTimeout(timer);
    void reader.cancel().catch(() => {});
  }
  const raw = Buffer.concat(chunks, size);
  const payload = base64url.encode(`${timestamp}.${base64url.encode(raw)}`);
  const jwksUrl = urls.jwks.href;
  if (cachedKeys?.url !== jwksUrl) {
    cachedKeys = { url: jwksUrl, keys: createRemoteJWKSet(urls.jwks, {
      timeoutDuration: 2000, cooldownDuration: 30_000, cacheMaxAge: 600_000,
    }) };
  }
  const keys = cachedKeys.keys;
  try {
    await compactVerify(`${header}.${payload}.${signed}`, async (protectedHeader, token) => {
      const key = await keys(protectedHeader, token);
      if (key.algorithm.name !== "Ed25519") throw new NeonWebhookError(401, "Invalid webhook signature");
      return key;
    }, { algorithms: ["EdDSA"] });
  } catch (error) {
    if (error instanceof NeonWebhookError) throw error;
    if (error instanceof errors.JWSSignatureVerificationFailed || error instanceof errors.JWSInvalid ||
        error instanceof errors.JOSENotSupported || error instanceof errors.JOSEAlgNotAllowed ||
        error instanceof errors.JWKSNoMatchingKey) {
      throw new NeonWebhookError(401, "Invalid webhook signature");
    }
    throw new NeonWebhookError(503, "Webhook verification unavailable");
  }

  let parsed: unknown;
  try { parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(raw)); }
  catch { throw new NeonWebhookError(400, "Invalid webhook JSON"); }
  const result = eventSchema.safeParse(parsed);
  if (!result.success) throw new NeonWebhookError(400, "Invalid auth email event");
  const event = result.data;
  // Routing headers are not independently signed; trust them only when the signed body agrees.
  if (event.event_id !== eventId || event.event_type !== eventType) {
    throw new NeonWebhookError(401, "Webhook event headers do not match");
  }
  const now = Date.now();
  const created = Date.parse(event.timestamp);
  const expires = Date.parse(event.event_data.expires_at);
  if (Math.abs(now - Number(timestamp)) > MAX_CLOCK_SKEW_MS || created > now + MAX_CLOCK_SKEW_MS ||
      now - created >= MAX_EVENT_LIFETIME_MS || expires <= now || expires <= created ||
      expires - created > MAX_EVENT_LIFETIME_MS) {
    throw new NeonWebhookError(400, "Expired or invalid auth email event");
  }
  if (event.event_type === "send.magic_link") {
    try {
      const link = new URL(event.event_data.link_url);
      const basePath = urls.authBase.pathname.replace(/\/$/, "");
      if (link.protocol !== "https:" || link.username || link.password || link.hash ||
          /[\s\\]/.test(event.event_data.link_url) || /%(?:2f|5c|2e|25)/i.test(link.pathname) ||
          link.origin !== urls.authBase.origin ||
          !(link.pathname === basePath || link.pathname.startsWith(`${basePath}/`))) throw new Error();
    } catch {
      throw new NeonWebhookError(400, "Untrusted auth email link");
    }
  }
  return event;
}
