import { notFound, redirect } from "next/navigation";
import { sql } from "@/lib/db";

// Custom domains (attached via the Vercel API) are rewritten here by proxy.ts.
export default async function DomainSite({ params }: { params: Promise<{ host: string }> }) {
  const host = decodeURIComponent((await params).host).replace(/^www\./, "");
  const rows = (await sql`SELECT slug FROM weddings WHERE custom_domain = ${host} AND published`) as { slug: string }[];
  if (!rows[0]) notFound();
  redirect(`/w/${rows[0].slug}`);
}

// Per-request page (auth/DB) — render on demand.
export const instant = false;
