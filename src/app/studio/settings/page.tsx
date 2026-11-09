import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { sql } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { activeWorkspace, canManage, type Role } from "@/lib/workspace";
import { Aurora } from "@/components/fx/Aurora";
import { Reveal } from "@/components/fx/Reveal";
import { StudioNav } from "../StudioNav";
import { Settings } from "./Settings";

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio/settings");
  const { current, list } = await activeWorkspace(user);
  const members = (await sql`SELECT user_id, email, role FROM members WHERE workspace_id = ${current.id} ORDER BY role = 'owner' DESC, created_at`) as { user_id: string; email: string; role: Role }[];
  const invites = (await sql`SELECT email, role, created_at FROM invites WHERE workspace_id = ${current.id} AND accepted_at IS NULL ORDER BY created_at DESC`) as { email: string; role: Role }[];
  const logos = (await sql`SELECT id, key, name FROM assets WHERE workspace_id = ${current.id} AND kind = 'logo' ORDER BY created_at DESC`) as { id: string; key: string; name: string }[];
  return (
    <main className="grain relative min-h-dvh overflow-hidden">
      <Aurora />
      <StudioNav current={current} list={list} email={user.email} admin={isAdmin(user)} active="settings" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-28 pt-6 md:px-6">
        <Reveal>
          <p className="eyebrow text-rose">Workspace</p>
          <h1 className="display mt-3 text-[2.6rem] leading-[1.05] md:text-6xl">{current.name}</h1>
        </Reveal>
        <Settings ws={current} members={members} invites={invites} logos={logos} me={user.id} manage={canManage(current.role)} />
      </div>
    </main>
  );
}

