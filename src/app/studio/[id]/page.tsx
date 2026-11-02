import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { getWeddingForOwner, sql } from "@/lib/db";
import { Studio, type Msg } from "./Studio";
import { emailEnabled } from "@/lib/email";
import { vercelEnabled } from "@/lib/vercel";


export default async function StudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) redirect(`/auth/sign-in?next=/studio/${id}`);
  const wedding = await getWeddingForOwner(id, user.id);
  if (!wedding) notFound();
  const messages = (await sql`SELECT id, role, content, chips FROM messages WHERE wedding_id = ${id} ORDER BY created_at`) as Msg[];
  return (
    <Studio
      wedding={wedding}
      initialMessages={messages}
      realtimeUrl={process.env.NEON_REALTIME_URL ?? ""}
      capabilities={{ email: emailEnabled(), domains: vercelEnabled() }}
    />
  );
}

// Per-request page (auth/DB) — render on demand.
export const instant = false;
