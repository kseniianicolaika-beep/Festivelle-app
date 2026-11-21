// Working name — the client will rename. Change it here only.
export const BRAND = {
  name: "Festivelle",
  tagline: "Celebrate. Create. Belong.",
  home: "Goa",
};

/** The public marketing site. The app has no landing page of its own — browsing lives there. */
export const SITE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://festivelle.love").replace(/\/$/, "");

/** Festivelle's social profiles — mirrored in the marketing site's src/lib/site.ts (SOCIAL). Change both together. */
export const SOCIAL = [
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/festivelle_lover/" },
  { id: "facebook", label: "Facebook", url: "https://www.facebook.com/people/Festivelle-Love/61596169816202/" },
  { id: "pinterest", label: "Pinterest", url: "https://www.pinterest.com/kseniia0274/" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/kseniia-kalendarova-51746744a" },
  { id: "youtube", label: "YouTube", url: "https://www.youtube.com/@festivelle" },
] as const;
