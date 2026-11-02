import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { currentUser } from "@/lib/auth/server";
import { setActiveWorkspace } from "@/lib/workspace";
import { Aurora } from "@/components/fx/Aurora";
import { Petals } from "@/components/fx/Petals";
import { SupportHeart } from "@/components/SupportHeart";

// Accept a workspace invitation. The signed-in email must match the invited email.
export default async function Join({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [inv] = (await sql`SELECT i.workspace_id, i.email, i.role, i.accepted_at, w.name FROM invites i JOIN workspaces w ON w.id = i.workspace_id WHERE i.token = ${token}`) as { workspace_id: string; email: string; role: string; accepted_at: string | null; name: string }[];
  const user = await currentUser();
  if (inv && user && !inv.accepted_at && user.email.toLowerCase() === inv.email) {
    await sql.transaction([
      sql`INSERT INTO members (workspace_id, user_id, email, role) VALUES (${inv.workspace_id}, ${user.id}, ${user.email.toLowerCase()}, ${inv.role}) ON CONFLICT (workspace_id, user_id) DO UPDATE SET role = EXCLUDED.role`,
      sql`UPDATE invites SET accepted_at = now() WHERE token = ${token}`,
    ]);
    await setActiveWorkspace(inv.workspace_id);
    redirect("/studio");
  }
  const state = !inv ? "This invitation link isn’t valid." : inv.accepted_at ? "This invitation has already been used." : user ? `This invitation is for ${inv.email}. You’re signed in as ${user.email}.` : null;
  return (
    <main className="grain relative flex min-h-dvh items-center justify-center overflow-hidden px-5">
      <Aurora />
      <Petals count={14} />
      <div className="glass rise relative max-w-md rounded-[32px] p-9 text-center">
        <p className="eyebrow text-rose">You’re invited</p>
        <h1 className="display mt-3 text-4xl">{inv ? <>Join <em className="text-rose">{inv.name}</em></> : "Oh dear"}</h1>
        <p className="mt-4 text-muted">{state ?? `Sign in or create an account with ${inv!.email} to accept.`}</p>
        {inv && !inv.accepted_at && !user && (
          <div className="mt-8 grid gap-2">
            <Link href={`/auth/sign-up?next=/join/${token}`} className="btn btn-dark">Create my account</Link>
            <Link href={`/auth/sign-in?next=/join/${token}`} className="btn btn-ghost">I already have one</Link>
          </div>
        )}
        {user && <Link href="/studio" className="btn btn-ghost mt-8">Go to my studio</Link>}
      </div>
      <SupportHeart />
    </main>
  );
}

export const instant = false;
