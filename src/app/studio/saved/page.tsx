import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth/server";
import { sql } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { activeWorkspace } from "@/lib/workspace";
import { templateById, type TemplateDef } from "@/lib/catalog";
import { OCCASIONS } from "@/lib/occasions";
import { Wash } from "@/components/fx/Wash";
import { Reveal } from "@/components/fx/Reveal";
import { PosterWall } from "@/components/marketing/landing/PosterWall";
import { StudioNav } from "../StudioNav";

const SITE = (process.env.SITE_URL || "https://festivelle.love").replace(/\/$/, "");

async function unsave(form: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio/saved");
  await sql`DELETE FROM saved_templates WHERE user_id = ${user.id} AND template_id = ${String(form.get("template") ?? "")}`;
  revalidatePath("/studio/saved");
}

// My Saved Templates — hearts from festivelle.love (/save?template=…). Each opens straight into the editor.
export default async function Saved() {
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio/saved");
  const { current, list } = await activeWorkspace(user);
  const rows = (await sql`SELECT template_id FROM saved_templates WHERE user_id = ${user.id} ORDER BY created_at DESC`) as { template_id: string }[];
  const saved = rows.map((r) => templateById(r.template_id)).filter(Boolean) as TemplateDef[];
  return (
    <main className="relative min-h-dvh overflow-x-clip">
      <Wash />
      <StudioNav current={current} list={list} email={user.email} admin={isAdmin(user)} active="saved" />
      <div className="relative z-10 mx-auto max-w-[1320px] px-5 pb-28 pt-10 md:px-10">
        <Reveal>
          <p className="kicker text-rose">Your shortlist</p>
          <h1 className="t-h1 mt-5">Saved <em className="text-rose">templates</em></h1>
          <p className="t-lede mt-4 max-w-xl">Designs you hearted on Festivelle. Open one to start — it loads straight into the editor.</p>
        </Reveal>
        {saved.length ? (
          <>
            <div className="mt-12"><PosterWall list={saved} cols="three" hrefs={Object.fromEntries(saved.map((t) => [t.id, `/start?template=${t.id}`]))} empty="" /></div>
            <ul className="mt-10 flex flex-wrap gap-2">
              {saved.map((t) => (
                <li key={t.id}>
                  <form action={unsave} className="flex items-center gap-2 rounded-full border border-line px-4 py-1.5 text-sm">
                    <input type="hidden" name="template" value={t.id} />
                    <span>{t.name} <span className="text-muted">· {OCCASIONS[t.occasion].name}</span></span>
                    <button className="text-muted hover:text-rose" aria-label={`Remove ${t.name}`}>✕</button>
                  </form>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Reveal><p className="mt-16 font-display text-2xl italic text-muted">Nothing saved yet. <Link className="link-u text-rose" href={`${SITE}/templates`}>Browse templates</Link> and tap the heart on any you love.</p></Reveal>
        )}
      </div>
    </main>
  );
}
