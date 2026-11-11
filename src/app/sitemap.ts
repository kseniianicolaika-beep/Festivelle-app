import type { MetadataRoute } from "next";

// Public pages (templates, occasions, pricing) are indexed on festivelle.love; the app has nothing to list.
export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}
