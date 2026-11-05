import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { rootDomain } from "@/lib/commerce";
import { SiteBySlug } from "../../w/[slug]/SiteBySlug";

// proxy.ts rewrites personal subdomains (anna-mark.festivelle.com) and couples' own domains here.
export default async function DomainSite({ params }: { params: Promise<{ host: string }> }) {
  const host = decodeURIComponent((await params).host).toLowerCase().replace(/:\d+$/, "").replace(/^www\./, "");
  const root = rootDomain();
  const sub = root && host.endsWith(`.${root}`) ? host.slice(0, -root.length - 1) : null;
  const rows = (sub
    ? await sql`SELECT slug FROM weddings WHERE subdomain = ${sub}`
    : await sql`SELECT slug FROM weddings WHERE custom_domain = ${host}`) as { slug: string }[];
  if (!rows[0]) notFound();
  return <SiteBySlug slug={rows[0].slug} />;
}

export const instant = false;
