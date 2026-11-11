import { customAlphabet } from "nanoid";
import { sql } from "./db";
import { opening } from "./designer";
import { isOccasion, OCCASIONS, starterFor, type OccasionId } from "./occasions";
import { defaultDesign, type Kind } from "./templates";
import { templateById } from "./catalog";
import { isTier, type Tier } from "./pricing";
import type { Profile } from "./profile";

const slugId = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 8);

// Products the marketing site sells separately; all three come from the same suite.
export const PRODUCTS = ["invite", "website", "video"] as const;
export type Product = (typeof PRODUCTS)[number];
export const isProduct = (p: unknown): p is Product => PRODUCTS.includes(p as Product);

export type CreateInput = { workspaceId: string; ownerId: string; template?: string | null; occasion?: string | null; client?: string | null; language?: "en" | "ru" | null; tradition?: string | null };

/** Create a celebration (occasion + optional catalog template styling the whole suite). Returns its id. */
export async function createCelebration(i: CreateInput): Promise<string> {
  const tpl = templateById(String(i.template ?? ""));
  const occasion: OccasionId = tpl?.occasion ?? (isOccasion(i.occasion) ? i.occasion : "wedding");
  const theme = tpl?.theme ?? OCCASIONS[occasion].theme;
  const profile: Profile = { occasion, ...(i.language ? { language: i.language } : {}), ...(i.tradition ? { tradition: i.tradition.slice(0, 60) } : {}) };
  const first = opening(occasion);
  const [w] = (await sql`
    INSERT INTO weddings (owner_id, workspace_id, client_name, slug, profile, theme)
    VALUES (${i.ownerId}, ${i.workspaceId}, ${i.client?.trim().slice(0, 120) || null}, ${slugId()}, ${JSON.stringify(profile)}::jsonb, ${theme}) RETURNING id`) as { id: string }[];
  const starter = starterFor(occasion);
  await sql.transaction([
    sql`INSERT INTO messages (wedding_id, role, content, chips) VALUES (${w.id}, 'assistant', ${(tpl ? `Lovely choice — “${tpl.name}”. ` : "") + first.reply}, ${JSON.stringify(first.chips)}::jsonb)`,
    ...starter.map((s, idx) => {
      // A catalog template styles the WHOLE suite: same theme, motif and fonts; card vs website layouts.
      const layout = tpl ? (s.kind === "website" ? tpl.siteLayout : tpl.paperLayout) : s.layout;
      const design = { ...defaultDesign(s.kind, profile), ...(tpl ? { motif: tpl.motif, fonts: tpl.fonts, template: tpl.id, ...(tpl.reveal ? { reveal: tpl.reveal } : {}) } : {}) };
      return sql`INSERT INTO documents (wedding_id, kind, layout, design, position) VALUES (${w.id}, ${s.kind}, ${layout}, ${JSON.stringify(design)}::jsonb, ${idx})`;
    }),
  ]);
  return w.id;
}

/** Where a fresh celebration opens: the right editor for the product, carrying the idea / tier hints. */
export function editorUrl(id: string, opts: { product?: string | null; idea?: string | null; tier?: string | null }) {
  const q = new URLSearchParams();
  const product = isProduct(opts.product) ? opts.product : null;
  const tier: Tier | null = isTier(opts.tier) ? opts.tier : null;
  if (product === "video") { if (tier) q.set("tier", tier); return `/studio/${id}/video${q.size ? `?${q}` : ""}`; }
  const piece: Kind | null = product === "website" ? "website" : product === "invite" ? "invite" : null;
  if (piece) q.set("piece", piece);
  if (opts.idea) q.set("idea", opts.idea.slice(0, 1000));
  if (tier) q.set("tier", tier);
  return `/studio/${id}${q.size ? `?${q}` : ""}`;
}
