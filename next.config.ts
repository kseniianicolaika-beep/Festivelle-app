import type { NextConfig } from "next";

// festivelle.love is the public, canonical marketing site; the app (hugs.festivelle.love) keeps the studio.
// The app's old public pages forward there so the two never compete in search.
const SITE = (process.env.SITE_URL || "https://festivelle.love").replace(/\/$/, "");
const SEO: Record<string, string> = {
  "wedding-invitations": "/celebrate/weddings-engagements/wedding",
  "indian-wedding-invitations": "/celebrate/weddings-engagements/wedding",
  "russian-wedding-invitations": "/celebrate/weddings-engagements/wedding",
  "goa-wedding-invitations": "/celebrate/weddings-engagements/wedding",
  "muslim-wedding-invitations": "/celebrate/weddings-engagements/wedding",
  "engagement-invitations": "/celebrate/weddings-engagements/engagement-party",
  "anniversary-invitations": "/celebrate/weddings-engagements/wedding-anniversary",
  "birthday-invitations": "/celebrate/birthdays/adult-birthdays",
  "kids-party-invitations": "/celebrate/birthdays/kids-birthdays",
  "baby-shower-invitations": "/celebrate/baby-kids/baby-shower",
  "digital-greeting-cards": "/celebrate/holidays-seasonal",
};

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/templates", destination: `${SITE}/templates`, permanent: false },
      { source: "/templates/:id", destination: `${SITE}/template/:id`, permanent: false },
      { source: "/pricing", destination: `${SITE}/pricing`, permanent: false },
      ...Object.entries(SEO).map(([slug, to]) => ({ source: `/invitations/${slug}`, destination: `${SITE}${to}`, permanent: false })),
      { source: "/invitations/:slug", destination: `${SITE}/celebrate`, permanent: false },
    ];
  },
  /* config options here */
  cacheComponents: false,
  partialPrefetching: false,
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
