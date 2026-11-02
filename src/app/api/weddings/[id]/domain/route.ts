import { sql } from "@/lib/db";
import { requireOwner } from "@/lib/guard";
import { addDomain, vercelEnabled } from "@/lib/vercel";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireOwner(id);
  if ("error" in g) return g.error;
  const { domain } = await req.json();
  if (typeof domain !== "string" || !/^(?!-)[a-z0-9-]{1,63}(\.[a-z0-9-]{1,63})+$/.test(domain)) return Response.json({ error: "That doesn't look like a domain." }, { status: 400 });
  if (!vercelEnabled()) return Response.json({ error: "Custom domains aren't enabled on this deployment yet." }, { status: 501 });
  try {
    const r = await addDomain(domain);
    await sql`UPDATE weddings SET custom_domain = ${domain} WHERE id = ${id}`;
    const dns = r.verified ? "" : "\nAdd these DNS records at your registrar:\n" + (r.verification ?? []).map((v) => `${v.type} ${v.domain} → ${v.value}`).join("\n");
    return Response.json({ message: `Connected ${domain}. Point an A record to 76.76.21.21 (or CNAME to cname.vercel-dns.com).${dns}` });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
