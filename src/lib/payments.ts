import { createHmac, timingSafeEqual } from "node:crypto";
import type { Currency } from "./pricing";

// Payment providers. Russia needs a local acquirer because Stripe/PayPal don't serve Russian cards:
//  • YooKassa  — Russian cards, МИР, SberPay, СБП, YooMoney (RUB). Needs a Russian legal entity / ИП / самозанятый.
//  • Razorpay  — UPI, Indian cards, netbanking (INR) and international cards (USD).
//  • NOWPayments — crypto (USDT etc.) priced in USD; works from anywhere, including Russia.
//  • test      — instant success, only when PAYMENTS_TEST_MODE=1 (and for admins). Never in real use.
// Every provider is verified server-to-server before fulfilment, so a forged redirect/webhook can't unlock anything.

export type ProviderId = "yookassa" | "razorpay" | "nowpayments" | "test";
export type OrderForPayment = { id: string; currency: Currency; amount_minor: number; description: string; email?: string | null; provider_ref?: string | null };
type Created = { url: string; ref: string };

const basic = (u: string, p: string) => "Basic " + Buffer.from(`${u}:${p}`).toString("base64");
const major = (minor: number) => (minor / 100).toFixed(2);

export const PROVIDERS: Record<ProviderId, { label: string; note: string; currencies: Currency[]; enabled: () => boolean }> = {
  yookassa: { label: "Банковская карта, СБП, SberPay", note: "Russian cards & МИР · YooKassa", currencies: ["RUB"], enabled: () => !!(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY) },
  razorpay: { label: "UPI, cards, netbanking", note: "India & international cards · Razorpay", currencies: ["INR", "USD"], enabled: () => !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) },
  nowpayments: { label: "Crypto (USDT, BTC, TON…)", note: "Works worldwide · NOWPayments", currencies: ["USD"], enabled: () => !!process.env.NOWPAYMENTS_API_KEY },
  test: { label: "Test payment", note: "Sandbox — no money moves", currencies: ["USD", "INR", "RUB"], enabled: () => process.env.PAYMENTS_TEST_MODE === "1" },
};

export function providersFor(currency: Currency, admin = false): ProviderId[] {
  return (Object.keys(PROVIDERS) as ProviderId[]).filter((p) => PROVIDERS[p].currencies.includes(currency) && (PROVIDERS[p].enabled() || (p === "test" && admin && process.env.NODE_ENV !== "production")));
}

export async function createPayment(provider: ProviderId, o: OrderForPayment, base: string): Promise<Created> {
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
        headers: { authorization: basic(process.env.RAZORPAY_KEY_ID!, process.env.RAZORPAY_KEY_SECRET!), "content-type": "application/json" },
        body: JSON.stringify({ amount: o.amount_minor, currency: o.currency, description: o.description.slice(0, 2048), reference_id: o.id, callback_url: back, callback_method: "get", notes: { order_id: o.id }, ...(o.email ? { customer: { email: o.email } } : {}) }),
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
  switch (provider) {
    case "yookassa": {
      if (!o.provider_ref) return false;
      const r = await fetch(`https://api.yookassa.ru/v3/payments/${o.provider_ref}`, { headers: { authorization: basic(process.env.YOOKASSA_SHOP_ID!, process.env.YOOKASSA_SECRET_KEY!) } });
      const j = await r.json();
      return j.status === "succeeded" && j.metadata?.order_id === o.id && Math.round(Number(j.amount?.value) * 100) === o.amount_minor;
    }
    case "razorpay": {
      if (!o.provider_ref) return false;
      const r = await fetch(`https://api.razorpay.com/v1/payment_links/${o.provider_ref}`, { headers: { authorization: basic(process.env.RAZORPAY_KEY_ID!, process.env.RAZORPAY_KEY_SECRET!) } });
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

export function verifyRazorpaySignature(raw: string, sig: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
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
