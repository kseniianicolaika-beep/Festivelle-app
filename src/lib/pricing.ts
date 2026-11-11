import { sql } from "./db";

// Every price, package, feature list, hosting window and AI allowance. Defaults live here; the admin
// dashboard (/admin/pricing) saves overrides to `settings.pricing`, so nothing needs a code change.
export const CURRENCIES = ["USD", "INR", "RUB"] as const;
export type Currency = (typeof CURRENCIES)[number];
export type Money = Record<Currency, number>; // major units (dollars, rupees, roubles)
export const TIERS = ["basic", "premium", "luxury"] as const;
export type Tier = (typeof TIERS)[number];
export const isTier = (t: unknown): t is Tier => TIERS.includes(t as Tier);

export type Package = { name: string; price: Money; features: string[]; sections: number; galleryPhotos: number; pieces: number; customDomain: boolean };
export type Pricing = {
  packages: Record<"wedding" | "celebration" | "greeting" | "business", Record<Tier, Package>>;
  video: Record<Tier, { name: string; price: Money; features: string[]; seconds: number; formats: string[] }>;
  hosting: { maxMonths: number; afterEventDays: number; extensions: { id: string; months: number; label: string; price: Money }[] };
  credits: { packs: { id: string; credits: number; price: Money }[]; freeTextPerDay: number; textCost: number; freeVisuals: number; visualCost: number; signupCredits: number };
  partners: { defaultCommissionPct: number; featuredMonthly: Money; sponsoredMonthly: Money };
};

const m = (USD: number, INR: number, RUB: number): Money => ({ USD, INR, RUB });

export const DEFAULT_PRICING: Pricing = {
  packages: {
    wedding: {
      basic: { name: "Essential", price: m(19, 999, 1490), sections: 5, galleryPhotos: 12, pieces: 3, customDomain: false, features: ["Your own link: names.festivelle.com", "5 website sections, 12-photo gallery", "RSVP with live replies", "Invitation + save-the-date"] },
      premium: { name: "Signature", price: m(39, 1999, 2990), sections: 8, galleryPhotos: 60, pieces: 12, customDomain: false, features: ["Everything in Essential", "All 8 sections, 60-photo gallery", "All 12 pieces: menus, signs, cards", "Guest concierge & email invitations"] },
      luxury: { name: "Heirloom", price: m(79, 3999, 5990), sections: 8, galleryPhotos: 300, pieces: 12, customDomain: true, features: ["Everything in Signature", "300-photo gallery & guest uploads", "Your own domain, connected for you", "Keepsake archive after the event"] },
    },
    celebration: {
      basic: { name: "Simple", price: m(7, 399, 590), sections: 4, galleryPhotos: 8, pieces: 2, customDomain: false, features: ["Your own link", "4 sections, 8-photo gallery", "RSVP"] },
      premium: { name: "Signature", price: m(15, 799, 1190), sections: 8, galleryPhotos: 40, pieces: 6, customDomain: false, features: ["All sections, 40-photo gallery", "Invitation, story & thank-you cards", "Email invitations"] },
      luxury: { name: "Grand", price: m(29, 1499, 2290), sections: 8, galleryPhotos: 150, pieces: 12, customDomain: true, features: ["150-photo gallery", "Every piece", "Custom domain"] },
    },
    business: {
      basic: { name: "Event", price: m(29, 1999, 2490), sections: 6, galleryPhotos: 20, pieces: 4, customDomain: false, features: ["Your own event link", "Invitation, event website & social post", "Registration with live replies", "Email invitations"] },
      premium: { name: "Professional", price: m(59, 3999, 4990), sections: 8, galleryPhotos: 60, pieces: 12, customDomain: false, features: ["Everything in Event", "Agenda, speakers & sponsors sections", "All 12 pieces: badges, signage, menus", "Guest reminders"] },
      luxury: { name: "Enterprise", price: m(119, 7999, 9990), sections: 8, galleryPhotos: 300, pieces: 12, customDomain: true, features: ["Everything in Professional", "Your own domain, connected for you", "Brand colours & fonts", "Priority concierge"] },
    },
    greeting: {
      basic: { name: "Card", price: m(3, 149, 249), sections: 1, galleryPhotos: 1, pieces: 1, customDomain: false, features: ["No watermark", "HD download & share link"] },
      premium: { name: "Keepsake card", price: m(5, 249, 390), sections: 3, galleryPhotos: 6, pieces: 2, customDomain: false, features: ["Photo collage", "Animated share page"] },
      luxury: { name: "Luxe card", price: m(9, 449, 690), sections: 5, galleryPhotos: 20, pieces: 3, customDomain: false, features: ["Everything + matching video greeting preview"] },
    },
  },
  video: {
    basic: { name: "Classic", price: m(12, 699, 990), seconds: 15, formats: ["9:16"], features: ["15-second animated invitation", "Names, date & venue"] },
    premium: { name: "Cinematic", price: m(24, 1299, 1890), seconds: 25, formats: ["9:16", "16:9"], features: ["Your photograph, slow-zoom", "Falling petals, two scenes", "Vertical & widescreen"] },
    luxury: { name: "Heirloom film", price: m(39, 2199, 2990), seconds: 40, formats: ["9:16", "16:9"], features: ["Wax-seal envelope opening", "Gold-foil shimmer, four scenes", "Vertical & widescreen"] },
  },
  hosting: {
    maxMonths: 12,
    afterEventDays: 30,
    extensions: [
      { id: "host_3", months: 3, label: "3 more months", price: m(9, 499, 690) },
      { id: "host_6", months: 6, label: "6 more months", price: m(15, 799, 1190) },
      { id: "host_12", months: 12, label: "12 more months", price: m(25, 1299, 1890) },
      { id: "host_keepsake", months: 1200, label: "Keepsake — forever", price: m(29, 1499, 2290) },
    ],
  },
  credits: {
    packs: [
      { id: "credits_20", credits: 20, price: m(5, 299, 390) },
      { id: "credits_60", credits: 60, price: m(12, 699, 990) },
    ],
    freeTextPerDay: 80,
    textCost: 1,
    freeVisuals: 3,
    visualCost: 2,
    signupCredits: 0,
  },
  partners: { defaultCommissionPct: 12, featuredMonthly: m(29, 1499, 2290), sponsoredMonthly: m(99, 4999, 7490) },
};

// Deep-merge saved overrides onto defaults so new fields always have values.
function merge<T>(base: T, over: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(over) ? over : base) as T;
  if (base && typeof base === "object") {
    const o = (over && typeof over === "object" ? over : {}) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(base).map(([k, v]) => [k, merge(v, o[k])])) as T;
  }
  return (typeof over === typeof base ? over : base) as T;
}

export async function getPricing(): Promise<Pricing> {
  const r = (await sql`SELECT value FROM settings WHERE key = 'pricing'`.catch(() => [])) as { value: unknown }[];
  return merge(DEFAULT_PRICING, r[0]?.value);
}

export async function savePricing(p: unknown, by: string) {
  const clean = merge(DEFAULT_PRICING, p);
  await sql`INSERT INTO settings (key, value, updated_by) VALUES ('pricing', ${JSON.stringify(clean)}::jsonb, ${by})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = now()`;
  return clean;
}

const SYMBOL: Record<Currency, string> = { USD: "$", INR: "₹", RUB: "₽" };
export const fmt = (amount: number, c: Currency) =>
  c === "RUB" ? `${amount.toLocaleString("ru-RU")} ₽` : `${SYMBOL[c]}${amount.toLocaleString(c === "INR" ? "en-IN" : "en-US")}`;

// Guess a sensible display currency from the visitor's country (Vercel geo header) or language.
export function currencyFor(country?: string | null, lang?: string | null): Currency {
  const c = (country ?? "").toUpperCase();
  if (["RU", "BY", "KZ", "AM", "KG", "UZ"].includes(c) || lang === "ru") return "RUB";
  if (c === "IN" || lang === "hi") return "INR";
  return "USD";
}
