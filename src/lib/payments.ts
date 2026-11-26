import { createHmac, timingSafeEqual } from "node:crypto";
import type { Currency } from "./pricing";
import { sql } from "./db";

// Payment providers. Russia needs a local acquirer because Stripe/PayPal don't serve Russian cards:
//  • YooKassa  — Russian cards, МИР, SberPay, СБП, YooMoney (RUB). Needs a Russian legal entity / ИП / самозанятый.
//  • Razorpay  — UPI, Indian cards, netbanking (INR) and international cards (USD).
//  • NOWPayments — crypto (USDT etc.) priced in USD; works from anywhere, including Russia.
//  • test      — instant success, only when PAYMENTS_TEST_MODE=1 (and for admins). Never in real use.
// Every provider is verified server-to-server before fulfilment, so a forged redirect/webhook can't unlock anything.

export type ProviderId = "yookassa" | "razorpay" | "nowpayments" | "test";
export type OrderForPayment = { id: string; currency: Currency; amount_minor: number; description: string; email?: string | null; name?: string | null; phone?: string | null; provider_ref?: string | null };

/** Razorpay refuses international (USD) payment links without the customer's name, email and phone. */
export const needsPhone = (provider: ProviderId, currency: Currency) => provider === "razorpay" && currency === "USD";
/** Loose international phone check: optional +, 8–15 digits once spaces, dashes and brackets are dropped. */
export const cleanPhone = (v: unknown) => { const s = typeof v === "string" ? v.replace(/[\s().-]/g, "") : ""; return /^\+?\d{8,15}$/.test(s) ? s : null; };
type Created = { url: string; ref: string };

// Razorpay keys: env vars win (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET); otherwise they come from
// settings.integrations in Neon (razorpay_key_id, razorpay_key_secret, razorpay_webhook_secret) — the Festivelle team's
// Vercel project serving hugs.festivelle.love gets them that way, like the AI keys (ai-keys.ts). Server-only.
type RzKeys = { id: string; secret: string; webhook: string };
let rzCache: { keys: RzKeys; at: number } | null = null;
const rzEnv = (): RzKeys => ({ id: process.env.RAZORPAY_KEY_ID?.trim() ?? "", secret: process.env.RAZORPAY_KEY_SECRET?.trim() ?? "", webhook: process.env.RAZORPAY_WEBHOOK_SECRET?.trim() ?? "" });
/** Current Razorpay keys (env, else the last database read). Call loadPaymentKeys() first in a request. */
function rz(): RzKeys {
  const e = rzEnv(), c = rzCache?.keys;
  return { id: e.id || c?.id || "", secret: e.secret || c?.secret || "", webhook: e.webhook || c?.webhook || "" };
}
/** Refresh database-held payment keys (cached 5 min). Cheap to call at the start of every payment request. */
export async function loadPaymentKeys() {
  const e = rzEnv();
  if (e.id && e.secret && e.webhook) return;
  if (rzCache && Date.now() - rzCache.at < 300_000) return;
  const r = (await sql`SELECT value->>'razorpay_key_id' AS id, value->>'razorpay_key_secret' AS secret, value->>'razorpay_webhook_secret' AS webhook FROM settings WHERE key = 'integrations'`.catch(() => [])) as { id: string | null; secret: string | null; webhook: string | null }[];
  rzCache = { keys: { id: (r[0]?.id ?? "").trim(), secret: (r[0]?.secret ?? "").trim(), webhook: (r[0]?.webhook ?? "").trim() }, at: Date.now() };
}

const basic = (u: string, p: string) => "Basic " + Buffer.from(`${u}:${p}`).toString("base64");
const major = (minor: number) => (minor / 100).toFixed(2);

export const PROVIDERS: Record<ProviderId, { label: string; note: string; currencies: Currency[]; enabled: () => boolean }> = {
  yookassa: { label: "Банковская карта, СБП, SberPay", note: "Russian cards & МИР · YooKassa", currencies: ["RUB"], enabled: () => !!(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY) },
  razorpay: { label: "UPI, cards, netbanking", note: "India & international cards · Razorpay", currencies: ["INR", "USD"], enabled: () => !!(rz().id && rz().secret) },
  nowpayments: { label: "Crypto (USDT, BTC, TON…)", note: "Works worldwide · NOWPayments", currencies: ["USD"], enabled: () => !!process.env.NOWPAYMENTS_API_KEY },
  test: { label: "Test payment", note: "Sandbox — no money moves", currencies: ["USD", "INR", "RUB"], enabled: () => process.env.PAYMENTS_TEST_MODE === "1" },
};

export async function providersFor(currency: Currency, admin = false): Promise<ProviderId[]> {
  await loadPaymentKeys();
  return (Object.keys(PROVIDERS) as ProviderId[]).filter((p) => PROVIDERS[p].currencies.includes(currency) && (PROVIDERS[p].enabled() || (p === "test" && admin && process.env.NODE_ENV !== "production")));
}

export async function createPayment(provider: ProviderId, o: OrderForPayment, base: string): Promise<Created> {
  await loadPaymentKeys();
  const back = `${base}/api/payments/return?order=${o.id}`;
  switch (provider) {
    case "yookassa": {
      const res = await fetch("https://api.yookassa.ru/v3/payments", {
        method: "POST",
        headers: { authorization: basic(process.env.YOOKASSA_SHOP_ID!, process.env.YOOKASSA_SECRET_KEY!), "content-type": "application/json", "Idempotence-Key": o.id },
        body: JSON.stringify({
          amount: { value: major(o.amount_minor), currency: "RUB" },
          capture: true,
          confirmation: { type: "redirect", return_url: back },
          description: o.description.slice(0, 128),
          metadata: { order_id: o.id },
          ...(o.email && process.env.YOOKASSA_RECEIPTS === "1"
            ? { receipt: { customer: { email: o.email }, items: [{ description: o.description.slice(0, 128), quantity: "1.00", amount: { value: major(o.amount_minor), currency: "RUB" }, vat_code: Number(process.env.YOOKASSA_VAT_CODE ?? 1), payment_mode: "full_payment", payment_subject: "service" }] } }
            : {}),
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(`YooKassa: ${j.description ?? res.status}`);
      return { url: j.confirmation.confirmation_url, ref: j.id };
    }
    case "razorpay": {
      const res = await fetch("https://api.razorpay.com/v1/payment_links", {
        method: "POST",
        headers: { authorization: basic(rz().id, rz().secret), "content-type": "application/json" },
        body: JSON.stringify({ amount: o.amount_minor, currency: o.currency, description: o.description.slice(0, 2048), reference_id: o.id, callback_url: back, callback_method: "get", notes: { order_id: o.id }, customer: { ...(o.email ? { email: o.email } : {}), ...(o.name ? { name: o.name.slice(0, 100) } : {}), ...(o.phone ? { contact: o.phone } : {}) } }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(`Razorpay: ${j.error?.description ?? res.status}`);
      return { url: j.short_url, ref: j.id };
    }
    case "nowpayments": {
      const res = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: { "x-api-key": process.env.NOWPAYMENTS_API_KEY!, "content-type": "application/json" },
        body: JSON.stringify({ price_amount: Number(major(o.amount_minor)), price_currency: "usd", order_id: o.id, order_description: o.description, ipn_callback_url: `${base}/api/payments/nowpayments`, success_url: back, cancel_url: back }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(`NOWPayments: ${j.message ?? res.status}`);
      return { url: j.invoice_url, ref: String(j.id) };
    }
    case "test":
      return { url: `${back}&test=1`, ref: `test_${o.id}` };
  }
}

// Ask the provider whether this order is paid. `hint` is a provider payment id from a webhook (crypto).
export async function isPaid(provider: ProviderId, o: OrderForPayment, hint?: string): Promise<boolean> {
  await loadPaymentKeys();
  switch (provider) {
    case "yookassa": {
      if (!o.provider_ref) return false;
      const r = await fetch(`https://api.yookassa.ru/v3/payments/${o.provider_ref}`, { headers: { authorization: basic(process.env.YOOKASSA_SHOP_ID!, process.env.YOOKASSA_SECRET_KEY!) } });
      const j = await r.json();
      return j.status === "succeeded" && j.metadata?.order_id === o.id && Math.round(Number(j.amount?.value) * 100) === o.amount_minor;
    }
    case "razorpay": {
      if (!o.provider_ref) return false;
      const r = await fetch(`https://api.razorpay.com/v1/payment_links/${o.provider_ref}`, { headers: { authorization: basic(rz().id, rz().secret) } });
      const j = await r.json();
      return j.status === "paid" && j.reference_id === o.id && Number(j.amount_paid) >= o.amount_minor;
    }
    case "nowpayments": {
      if (!hint || !/^\d+$/.test(hint)) return false;
      const r = await fetch(`https://api.nowpayments.io/v1/payment/${hint}`, { headers: { "x-api-key": process.env.NOWPAYMENTS_API_KEY! } });
      const j = await r.json();
      return ["finished", "confirmed"].includes(j.payment_status) && String(j.order_id) === o.id;
    }
    case "test":
      return PROVIDERS.test.enabled() || process.env.NODE_ENV !== "production";
  }
}

/** Refund the captured payment behind a paid Razorpay order, in full. Returns the Razorpay refund id. */
export async function refundRazorpay(o: OrderForPayment): Promise<string> {
  await loadPaymentKeys();
  if (!o.provider_ref) throw new Error("This order has no Razorpay payment link.");
  const auth = basic(rz().id, rz().secret);
  const link = await (await fetch(`https://api.razorpay.com/v1/payment_links/${o.provider_ref}`, { headers: { authorization: auth } })).json();
  if (link.reference_id !== o.id) throw new Error("The Razorpay link doesn't belong to this order.");
  const pay = ((link.payments ?? []) as { payment_id: string; amount: number; status: string }[]).find((p) => p.status === "captured");
  if (!pay) throw new Error("No captured payment on this link (already refunded, or not paid).");
  const res = await fetch(`https://api.razorpay.com/v1/payments/${pay.payment_id}/refund`, {
    method: "POST",
    headers: { authorization: auth, "content-type": "application/json" },
    body: JSON.stringify({ amount: pay.amount, speed: "normal", receipt: o.id.slice(0, 40), notes: { order_id: o.id } }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`Razorpay: ${j.error?.description ?? res.status}`);
  return j.id as string;
}

export async function verifyRazorpaySignature(raw: string, sig: string | null) {
  await loadPaymentKeys();
  const secret = rz().webhook;
  if (!secret || !sig) return false;
  const exp = createHmac("sha256", secret).update(raw).digest("hex");
  return exp.length === sig.length && timingSafeEqual(Buffer.from(exp), Buffer.from(sig));
}

const sortKeys = (v: unknown): unknown =>
  Array.isArray(v) ? v.map(sortKeys) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys((v as Record<string, unknown>)[k])])) : v;

export function verifyNowpaymentsSignature(body: unknown, sig: string | null) {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!secret || !sig) return false;
  const exp = createHmac("sha512", secret).update(JSON.stringify(sortKeys(body))).digest("hex");
  return exp.length === sig.length && timingSafeEqual(Buffer.from(exp), Buffer.from(sig));
}
