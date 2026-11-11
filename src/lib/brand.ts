// Working name — the client will rename. Change it here only.
export const BRAND = {
  name: "Festivelle",
  tagline: "Celebrate. Create. Belong.",
  home: "Goa",
};

/** The public marketing site. The app has no landing page of its own — browsing lives there. */
export const SITE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://festivelle.love").replace(/\/$/, "");
