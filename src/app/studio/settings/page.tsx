import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { sql } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { activeWorkspace, canManage, type Role } from "@/lib/workspace";
import { Aurora } from "@/components/fx/Aurora";
import { Reveal } from "@/components/fx/Reveal";
import { StudioNav } from "../StudioNav";
import { Settings } from "./Settings";
import { emailPrefs } from "@/lib/lifecycle";
import { saveEmailPrefs } from "./email-actions";

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/auth/sign-in?next=/studio/settings");
  const { current, list } = await activeWorkspace(user);
  const members = (await sql`SELECT user_id, email, role FROM members WHERE workspace_id = ${current.id} ORDER BY role = 'owner' DESC, created_at`) as { user_id: string; email: string; role: Role }[];
  const invites = (await sql`SELECT email, role, created_at FROM invites WHERE workspace_id = ${current.id} AND accepted_at IS NULL ORDER BY created_at DESC`) as { email: string; role: Role }[];
  const prefs = await emailPrefs(user.email).catch(() => ({ unsubscribed: false, anniversary: false }));
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
        <form action={saveEmailPrefs} className="glass mt-10 max-w-2xl rounded-[28px] p-7">
          <p className="eyebrow text-rose">Emails from us</p>
          <p className="mt-2 text-sm text-muted">A few helpful notes, never more than one a day: your saved draft, a week before your event, new replies, a thank-you card idea, and before your site goes offline.</p>
          <label className="mt-5 flex items-center gap-3 text-sm"><input type="checkbox" name="reminders" defaultChecked={!prefs.unsubscribed} className="h-4 w-4 accent-[#7a1f35]" /> Send me these reminders</label>
          <label className="mt-3 flex items-center gap-3 text-sm"><input type="checkbox" name="anniversary" defaultChecked={prefs.anniversary} className="h-4 w-4 accent-[#7a1f35]" /> Remind me of our wedding anniversary each year</label>
          <button className="btn btn-ghost mt-5 !px-5 !py-2 text-sm">Save</button>
        </form>
      </div>
    </main>
  );
}

