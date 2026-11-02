import { sql } from "./db";
import type { Profile } from "./profile";
import { defaultDesign, isKind, KINDS, PAPER_LAYOUTS, SITE_LAYOUTS, type Design, type Doc, type Kind } from "./templates";

export async function listDocs(weddingId: string) {
  return (await sql`SELECT id, kind, layout, design, position FROM documents WHERE wedding_id = ${weddingId} ORDER BY position, created_at`) as Doc[];
}

export async function getDoc(weddingId: string, docId?: string | null) {
  if (!docId || !/^[0-9a-f-]{36}$/i.test(docId)) return null;
  const r = (await sql`SELECT id, kind, layout, design, position FROM documents WHERE id = ${docId} AND wedding_id = ${weddingId}`) as Doc[];
  return r[0] ?? null;
}

export const validLayout = (kind: Kind, layout?: string) =>
  !!layout && (kind === "website" ? layout in SITE_LAYOUTS : layout in PAPER_LAYOUTS);

export async function createDoc(weddingId: string, kind: Kind, profile: Profile, layout?: string, design: Design = {}) {
  if (!isKind(kind)) throw new Error("Unknown piece");
  const l = validLayout(kind, layout) ? layout! : kind === "website" ? "romance" : "classic";
  const d = { ...defaultDesign(kind, profile), ...design };
  const [doc] = (await sql`
    INSERT INTO documents (wedding_id, kind, layout, design, position)
    VALUES (${weddingId}, ${kind}, ${l}, ${JSON.stringify(d)}::jsonb, (SELECT COALESCE(MAX(position), -1) + 1 FROM documents WHERE wedding_id = ${weddingId}))
    RETURNING id, kind, layout, design, position`) as Doc[];
  return doc;
}

// Merge a design patch; `layout` lives in its own column. null values remove a key.
export async function patchDoc(doc: Doc, patch: Partial<Design> & { layout?: string }) {
  const { layout, ...rest } = patch;
  const design: Record<string, unknown> = { ...doc.design };
  for (const [k, v] of Object.entries(rest)) {
    if (v === null || v === undefined) delete design[k];
    else if (k === "texts") design.texts = { ...(doc.design.texts ?? {}), ...(v as object) };
    else design[k] = v;
  }
  const nextLayout = validLayout(doc.kind, layout) ? layout! : doc.layout;
  const [d] = (await sql`UPDATE documents SET layout = ${nextLayout}, design = ${JSON.stringify(design)}::jsonb, updated_at = now() WHERE id = ${doc.id} RETURNING id, kind, layout, design, position`) as Doc[];
  return d;
}

export const STARTER: { kind: Kind; layout: string }[] = [
  { kind: "invite", layout: "classic" },
  { kind: "website", layout: "romance" },
  { kind: "save", layout: "classic" },
];
export { KINDS };
