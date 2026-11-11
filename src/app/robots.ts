import type { MetadataRoute } from "next";

// The app is not for search engines: public pages (templates, occasions, pricing) are indexed on
// festivelle.love, and celebration sites are private to their guests.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
