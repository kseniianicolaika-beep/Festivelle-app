import type { Currency, Pricing, Tier } from "./pricing";

// Pure price helpers, safe to import from client components (pricing.ts itself touches the database).

/** Suite price: website + video of the same tier, less the suite discount, rounded to a whole unit. */
export function suitePrice(P: Pricing, group: keyof Pricing["packages"], tier: Tier, c: Currency) {
  const full = P.packages[group][tier].price[c] + P.video[tier].price[c];
  return { full, price: Math.round((full * (100 - P.suiteDiscountPct)) / 100) };
}
