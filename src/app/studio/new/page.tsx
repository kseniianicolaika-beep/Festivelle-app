import { redirect } from "next/navigation";
import { customAlphabet } from "nanoid";
import { currentUser } from "@/lib/auth/server";
import { sql } from "@/lib/db";
import { opening } from "@/lib/designer";
import { isAdmin } from "@/lib/admin";
import { activeWorkspace, canEdit } from "@/lib/workspace";
import { isOccasion, OCCASIONS, starterFor, type OccasionId } from "@/lib/occasions";
import { defaultDesign } from "@/lib/templates";
import { templateById } from "@/lib/catalog";
import type { Profile } from "@/lib/profile";
import { NewCelebrationView, type NewQuery } from "./View";

const slugId = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 8);

// Create a celebration from the catalog: occasion + (optional) template, then straight into the conversation.
async function create(form: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio/new");
  const { current } = await activeWorkspace(user);
  if (!canEdit(current.role)) redirect("/studio");
  const tpl = templateById(String(form.get("template") ?? ""));
  const o = String(form.get("occasion"));
  const occasion: OccasionId = tpl?.occasion ?? (isOccasion(o) ? o : "wedding");
  const theme = tpl?.theme ?? OCCASIONS[occasion].theme;
  const client = String(form.get("client") ?? "").trim().slice(0, 120) || null;
  const profile: Profile = { occasion };
  const first = opening(occasion);
  const [w] = (await sql`
    INSERT INTO weddings (owner_id, workspace_id, client_name, slug, profile, theme)
    VALUES (${user.id}, ${current.id}, ${client}, ${slugId()}, ${JSON.stringify(profile)}::jsonb, ${theme}) RETURNING id`) as { id: string }[];
  const starter = starterFor(occasion);
  await sql.transaction([
    sql`INSERT INTO messages (wedding_id, role, content, chips) VALUES (${w.id}, 'assistant', ${(tpl ? `Lovely choice — “${tpl.name}”. ` : "") + first.reply}, ${JSON.stringify(first.chips)}::jsonb)`,
    ...starter.map((s, i) => {
      // A catalog template styles the WHOLE suite: same theme, motif and fonts; card vs website layouts.
      const layout = tpl ? (s.kind === "website" ? tpl.siteLayout : tpl.paperLayout) : s.layout;
      const design = { ...defaultDesign(s.kind, profile), ...(tpl ? { motif: tpl.motif, fonts: tpl.fonts, template: tpl.id, ...(tpl.reveal ? { reveal: tpl.reveal } : {}) } : {}) };
      return sql`INSERT INTO documents (wedding_id, kind, layout, design, position) VALUES (${w.id}, ${s.kind}, ${layout}, ${JSON.stringify(design)}::jsonb, ${i})`;
    }),
  ]);
  redirect(`/studio/${w.id}`);
}


export default async function NewCelebration({ searchParams }: { searchParams: Promise<NewQuery> }) {
  const q = await searchParams;
  const user = await currentUser();
  if (!user) redirect(`/auth/sign-in?next=${encodeURIComponent(`/studio/new?${new URLSearchParams(Object.entries(q).filter(([, v]) => typeof v === "string") as [string, string][])}`)}`);
  const { current, list } = await activeWorkspace(user);
  if (!canEdit(current.role)) redirect("/studio");
  return <NewCelebrationView q={q} current={current} list={list} email={user.email} admin={isAdmin(user)} create={create} />;
}

export const instant = false;
