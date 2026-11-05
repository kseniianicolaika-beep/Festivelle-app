import type { MetadataRoute } from "next";
import { siteOrigin } from "@/components/marketing/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/admin", "/api", "/w/", "/d/", "/join", "/auth", "/r/", "/go/"] }],
    sitemap: `${siteOrigin()}/sitemap.xml`,
  };
}
