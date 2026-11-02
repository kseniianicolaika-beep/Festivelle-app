import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { getWeddingForUser, sql } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { Studio, type Msg } from "./Studio";
import { emailEnabled } from "@/lib/email";
import { vercelEnabled } from "@/lib/vercel";


export default async function StudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) redirect(`/auth/sign-in?next=/studio/${id}`);
  const wedding = await getWeddingForUser(id, user);
  if (!wedding) notFound();
  const messages = (await sql`SELECT id, role, content, chips FROM messages WHERE wedding_id = ${id} ORDER BY created_at`) as Msg[];
  return (
    <Studio
      wedding={wedding}
      initialMessages={messages}
      realtimeUrl={process.env.NEON_REALTIME_URL ?? ""}
      capabilities={{ email: emailEnabled(), domains: vercelEnabled() }}
      adminView={isAdmin(user) && wedding.owner_id !== user.id}
    />
  );
}

// Per-request page (auth/DB) — render on demand.
export const instant = false;
