import { isUnlimitedId } from "./admin";
import { sql, type Wedding } from "./db";
import { getPricing, isTier, TIERS, type Currency, type Pricing, type Tier } from "./pricing";
import { displayNames, priceGroup } from "./occasions";
import type { Profile } from "./profile";

// Products: site_<tier> · video_<tier> · host_<3|6|12|keepsake> · credits_<n>
export type Quote = { product: string; description: string; list: number; amount: number; currency: Currency; promo?: string; partnerId?: string | null; commissionPct: number; upgradeFrom?: Tier | null };

const rank = (t?: string | null) => (isTier(t) ? TIERS.indexOf(t) : -1);

export async function quote(product: string, currency: Currency, wedding: Pick<Wedding, "profile" | "tier" | "video_tier"> | null, promoCode?: string | null, refCode?: string | null): Promise<Quote | { error: string }> {
  const P = await getPricing();
  let list = 0;
  let description = "";
  let upgradeFrom: Tier | null = null;
  const [kind, arg] = [product.split("_")[0], product.slice(product.indexOf("_") + 1)];
  const names = wedding ? displayNames(wedding.profile) : "";

  if (kind === "site" || kind === "video") {
    if (!wedding) return { error: "Choose a celebration first." };
    if (!isTier(arg)) return { error: "Unknown package." };
    const table = kind === "site" ? P.packages[priceGroup(wedding.profile)] : P.video;
    const current = kind === "site" ? wedding.tier : wedding.video_tier;
    if (rank(current) >= rank(arg)) return { error: "You already have this package." };
    list = table[arg].price[currency];
    // Upgrades are charged the difference — nobody pays twice.
    if (isTier(current)) { list = Math.max(list - table[current].price[currency], 0); upgradeFrom = current; }
    description = `${kind === "site" ? "Website" : "Video"} · ${table[arg].name}${upgradeFrom ? ` (upgrade)` : ""} · ${names}`;
  } else if (kind === "host") {
    if (!wedding?.tier) return { error: "Hosting extensions apply to a published celebration." };
    const ext = P.hosting.extensions.find((e) => e.id === product);
    if (!ext) return { error: "Unknown extension." };
    list = ext.price[currency];
    description = `Hosting · ${ext.label} · ${names}`;
  } else if (kind === "credits") {
    const pack = P.credits.packs.find((p) => p.id === product);
    if (!pack) return { error: "Unknown credit pack." };
    list = pack.price[currency];
    description = `${pack.credits} AI credits`;
  } else return { error: "Unknown product." };

  let amount = list;
  let partnerId: string | null = null;
  let promo: string | undefined;
  if (promoCode) {
    const r = (await sql`SELECT code, percent_off, partner_id FROM promos WHERE code = ${promoCode.trim().toUpperCase()} AND active
      AND (expires_at IS NULL OR expires_at > now()) AND (max_uses IS NULL OR uses < max_uses)`) as { code: string; percent_off: number; partner_id: string | null }[];
    if (!r[0]) return { error: "That code isn’t valid any more." };
    promo = r[0].code;
    amount = Math.round(list * (100 - r[0].percent_off)) / 100;
    partnerId = r[0].partner_id;
  }
  let commissionPct = 0;
  const ref = partnerId ? sql`SELECT id, commission_pct FROM partners WHERE id = ${partnerId} AND active` : refCode ? sql`SELECT id, commission_pct FROM partners WHERE ref_code = ${refCode} AND active` : null;
  if (ref) {
    const r = (await ref) as { id: string; commission_pct: string }[];
    if (r[0]) { partnerId = r[0].id; commissionPct = Number(r[0].commission_pct); }
  }
  return { product, description, list, amount: Math.round(amount * 100) / 100, currency, promo, partnerId, commissionPct, upgradeFrom };
}

const addMonths = (d: Date, n: number) => { const x = new Date(d); x.setUTCMonth(x.getUTCMonth() + n); return x; };
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);

// Access window: up to 12 months from activation, but never past event + 30 days — whichever is first.
// (If the event is already behind us, guests still get a 7-day grace window.)
export function initialExpiry(p: Profile, activated: Date, P: Pricing) {
  const cap = addMonths(activated, P.hosting.maxMonths);
  const eventDate = p.date ? new Date(p.date + "T23:59:59Z") : null;
  if (!eventDate || Number.isNaN(eventDate.getTime())) return cap;
  const afterEvent = addDays(eventDate, P.hosting.afterEventDays);
  const end = afterEvent < cap ? afterEvent : cap;
  return end < addDays(activated, 7) ? addDays(activated, 7) : end;
}

export const isExpired = (w: Pick<Wedding, "expires_at">) => !!w.expires_at && new Date(w.expires_at) < new Date();

const slugify = (s: string) =>
  s.normalize("NFKD").toLowerCase().replace(/[̀-ͯ]/g, "").replace(/&/g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

// Cyrillic names become Latin for the subdomain: Анна & Марк → anna-mark
const CYR: Record<string, string> = { а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya" };
const latin = (s: string) => s.toLowerCase().replace(/[а-яё]/g, (c) => CYR[c] ?? "");

const RESERVED = new Set(["www", "app", "api", "admin", "studio", "mail", "blog", "help", "partners", "pricing"]);

export async function assignSubdomain(w: Pick<Wedding, "id" | "profile" | "slug" | "subdomain">) {
  if (w.subdomain) return w.subdomain;
  const base = slugify(latin(displayNames(w.profile))) || w.slug;
  for (let i = 0; i < 50; i++) {
    const cand = i ? `${base}-${i + 1}` : base;
    if (RESERVED.has(cand) || cand.length < 3) continue;
    const r = (await sql`UPDATE weddings SET subdomain = ${cand} WHERE id = ${w.id} AND subdomain IS NULL
      AND NOT EXISTS (SELECT 1 FROM weddings WHERE subdomain = ${cand}) RETURNING subdomain`) as { subdomain: string }[];
    if (r[0]) return r[0].subdomain;
  }
  return null;
}

export const rootDomain = () => (process.env.ROOT_DOMAIN ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "");
export function siteUrl(w: Pick<Wedding, "slug" | "subdomain" | "custom_domain">, origin: string) {
  if (w.custom_domain) return `https://${w.custom_domain}`;
  if (w.subdomain && rootDomain()) return `https://${w.subdomain}.${rootDomain()}`;
  return `${origin}/w/${w.slug}`;
}

// Publishing = activation. Starts the hosting window the first time only.
export async function activate(weddingId: string) {
  const [w] = (await sql`SELECT * FROM weddings WHERE id = ${weddingId}`) as Wedding[];
  if (!w) return null;
  const P = await getPricing();
  await assignSubdomain(w);
  if (!w.activated_at) {
    const now = new Date();
    const forever = await isUnlimitedId(w.owner_id);
    await sql`UPDATE weddings SET published = true, activated_at = ${now.toISOString()}, expires_at = ${forever ? null : initialExpiry(w.profile, now, P).toISOString()}, updated_at = now() WHERE id = ${weddingId}`;
  } else await sql`UPDATE weddings SET published = true, updated_at = now() WHERE id = ${weddingId}`;
  return true;
}

type Order = { id: string; user_id: string; wedding_id: string | null; product: string; status: string; promo_code: string | null };

// Idempotent: only the first caller that flips pending→paid applies the purchase.
export async function fulfil(orderId: string) {
  const [o] = (await sql`UPDATE orders SET status = 'paid', paid_at = now() WHERE id = ${orderId} AND status = 'pending' RETURNING *`) as Order[];
  if (!o) return false;
  const [kind, arg] = [o.product.split("_")[0], o.product.slice(o.product.indexOf("_") + 1)];
  if (o.promo_code) await sql`UPDATE promos SET uses = uses + 1 WHERE code = ${o.promo_code}`;
  if (kind === "site" && o.wedding_id) {
    await sql`UPDATE weddings SET tier = ${arg} WHERE id = ${o.wedding_id}`;
    await activate(o.wedding_id);
  } else if (kind === "video" && o.wedding_id) {
    await sql`UPDATE weddings SET video_tier = ${arg} WHERE id = ${o.wedding_id}`;
  } else if (kind === "host" && o.wedding_id) {
    const P = await getPricing();
    const ext = P.hosting.extensions.find((e) => e.id === o.product);
    if (ext) await sql`UPDATE weddings SET expires_at = GREATEST(COALESCE(expires_at, now()), now()) + make_interval(months => ${ext.months}), published = true WHERE id = ${o.wedding_id}`;
  } else if (kind === "credits") {
    const P = await getPricing();
    const pack = P.credits.packs.find((p) => p.id === o.product);
    if (pack) await addCredits(o.user_id, pack.credits);
  }
  return true;
}

export async function addCredits(userId: string, n: number) {
  await sql`INSERT INTO credits (user_id, balance) VALUES (${userId}, ${n}) ON CONFLICT (user_id) DO UPDATE SET balance = credits.balance + ${n}, updated_at = now()`;
}
export async function creditBalance(userId: string) {
  const r = (await sql`SELECT balance FROM credits WHERE user_id = ${userId}`) as { balance: number }[];
  return r[0]?.balance ?? 0;
}

// AI metering: a free daily allowance, then credits. Returns false when the user is out of both.
export async function meter(userId: string, kind: "text" | "visual") {
  if (await isUnlimitedId(userId)) return true;
  const P = await getPricing();
  const free = kind === "text" ? P.credits.freeTextPerDay : P.credits.freeVisuals;
  const cost = kind === "text" ? P.credits.textCost : P.credits.visualCost;
  // Visual trial is lifetime; text allowance resets daily.
  const used = (await (kind === "text"
    ? sql`SELECT COALESCE(SUM(n),0)::int AS n FROM ai_usage WHERE user_id = ${userId} AND kind = 'text' AND day = current_date`
    : sql`SELECT COALESCE(SUM(n),0)::int AS n FROM ai_usage WHERE user_id = ${userId} AND kind = 'visual'`)) as { n: number }[];
  if (used[0].n >= free) {
    const r = (await sql`UPDATE credits SET balance = balance - ${cost}, updated_at = now() WHERE user_id = ${userId} AND balance >= ${cost} RETURNING balance`) as unknown[];
    if (!r.length) return false;
  }
  await sql`INSERT INTO ai_usage (user_id, kind, n) VALUES (${userId}, ${kind}, 1) ON CONFLICT (user_id, day, kind) DO UPDATE SET n = ai_usage.n + 1`;
  return true;
}
