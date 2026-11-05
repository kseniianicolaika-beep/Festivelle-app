import type { MetadataRoute } from "next";
import { publicCatalog } from "@/lib/template-admin";
import { SEO_PAGES, siteOrigin } from "@/components/marketing/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const o = siteOrigin();
  const list = await publicCatalog().catch(() => []);
  const now = new Date();
  return [
    { url: `${o}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${o}/templates`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${o}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${o}/partners`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    ...SEO_PAGES.map((p) => ({ url: `${o}/invitations/${p.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...list.map((t) => ({ url: `${o}/templates/${t.id}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
