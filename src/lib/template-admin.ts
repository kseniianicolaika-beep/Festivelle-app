import { sql } from "./db";
import { CATALOG, type TemplateDef } from "./catalog";

// Admin curation of the template catalog, stored in settings key 'templates' (edited at /admin/templates).
export type Collection = { id: string; name: string; blurb?: string; templateIds: string[]; active: boolean; starts?: string | null; ends?: string | null };
export type TemplateAdmin = { featured: string[]; hidden: string[]; order: string[]; collections: Collection[] };
export const EMPTY_TEMPLATE_ADMIN: TemplateAdmin = { featured: [], hidden: [], order: [], collections: [] };

const strs = (x: unknown) => (Array.isArray(x) ? x.filter((s): s is string => typeof s === "string").slice(0, 500) : []);

export function cleanTemplateAdmin(x: unknown): TemplateAdmin {
  const o = (x && typeof x === "object" ? x : {}) as Record<string, unknown>;
  const cols = Array.isArray(o.collections) ? o.collections : [];
  return {
    featured: strs(o.featured),
    hidden: strs(o.hidden),
    order: strs(o.order),
    collections: cols.slice(0, 50).flatMap((c) => {
      if (!c || typeof c !== "object") return [];
      const r = c as Record<string, unknown>;
      const name = String(r.name ?? "").trim().slice(0, 80);
      if (!name) return [];
      const id = String(r.id ?? "").trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const date = (v: unknown) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);
      return [{ id: id.slice(0, 60), name, blurb: String(r.blurb ?? "").slice(0, 240) || undefined, templateIds: strs(r.templateIds), active: r.active !== false, starts: date(r.starts), ends: date(r.ends) }];
    }),
  };
}

export async function getTemplateAdmin(): Promise<TemplateAdmin> {
  const r = (await sql`SELECT value FROM settings WHERE key = 'templates'`.catch(() => [])) as { value: unknown }[];
  return cleanTemplateAdmin(r[0]?.value);
}

export async function saveTemplateAdmin(v: unknown, by: string) {
  const clean = cleanTemplateAdmin(v);
  await sql`INSERT INTO settings (key, value, updated_by) VALUES ('templates', ${JSON.stringify(clean)}::jsonb, ${by})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = now()`;
  return clean;
}

/** Public catalog: hidden removed, admin order first, featured flagged. */
export function applyAdmin(a: TemplateAdmin, list: TemplateDef[] = CATALOG) {
  const hidden = new Set(a.hidden);
  const rank = (id: string) => { const i = a.order.indexOf(id); return i < 0 ? Number.MAX_SAFE_INTEGER : i; };
  return list.filter((t) => !hidden.has(t.id)).map((t, i) => ({ t, i })).sort((x, y) => rank(x.t.id) - rank(y.t.id) || x.i - y.i).map(({ t }) => t);
}

export async function publicCatalog() {
  return applyAdmin(await getTemplateAdmin());
}

export async function featuredTemplates(limit = 6) {
  const a = await getTemplateAdmin();
  const list = applyAdmin(a);
  const feat = a.featured.map((id) => list.find((t) => t.id === id)).filter((t): t is TemplateDef => !!t);
  return (feat.length ? feat : list).slice(0, limit);
}

export async function activeCollections() {
  const a = await getTemplateAdmin();
  const today = new Date().toISOString().slice(0, 10);
  const list = applyAdmin(a);
  return a.collections
    .filter((c) => c.active && (!c.starts || c.starts <= today) && (!c.ends || c.ends >= today))
    .map((c) => ({ ...c, templates: c.templateIds.map((id) => list.find((t) => t.id === id)).filter((t): t is TemplateDef => !!t) }))
    .filter((c) => c.templates.length);
}
