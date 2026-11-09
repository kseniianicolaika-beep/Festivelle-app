import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { sql } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { activeWorkspace, canEdit } from "@/lib/workspace";
import { Aurora } from "@/components/fx/Aurora";
import { Reveal } from "@/components/fx/Reveal";
import { StudioNav } from "../StudioNav";
import { Library } from "./Library";
import type { Asset } from "@/lib/upload-client";

export default async function LibraryPage() {
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio/library");
  const { current, list } = await activeWorkspace(user);
  const assets = (await sql`SELECT id, key, name, kind FROM assets WHERE workspace_id = ${current.id} ORDER BY created_at DESC LIMIT 300`) as Asset[];
  return (
    <main className="grain relative min-h-dvh overflow-hidden">
      <Aurora />
      <StudioNav current={current} list={list} email={user.email} admin={isAdmin(user)} active="library" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-28 pt-6 md:px-6">
        <Reveal>
          <p className="eyebrow text-rose">Asset library</p>
          <h1 className="display mt-3 text-[2.6rem] leading-[1.05] md:text-6xl">Every <em className="text-rose">treasured</em> detail</h1>
          <p className="mt-3 max-w-xl text-muted">Photographs, logos and our hand-drawn motif collection — shared across every wedding in {current.name}.</p>
        </Reveal>
        <Library workspaceId={current.id} initial={assets} editable={canEdit(current.role)} />
      </div>
    </main>
  );
}

