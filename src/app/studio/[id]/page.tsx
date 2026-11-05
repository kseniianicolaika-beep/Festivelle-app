import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { getWeddingForUser, sql } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { canEdit } from "@/lib/workspace";
import { listDocs } from "@/lib/docs";
import { Studio, type Msg } from "./Studio";
import { PurchaseBridge } from "./PurchaseBridge";
import { emailEnabled } from "@/lib/email";
import { vercelEnabled } from "@/lib/vercel";
import type { Asset } from "@/lib/upload-client";

export default async function StudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) redirect(`/auth/sign-in?next=/studio/${id}`);
  const wedding = await getWeddingForUser(id, user);
  if (!wedding) notFound();
  const [messages, docs, photos] = await Promise.all([
    sql`SELECT id, role, content, chips, kind FROM messages WHERE wedding_id = ${id} ORDER BY created_at` as unknown as Promise<Msg[]>,
    listDocs(id),
    sql`SELECT id, key, name, kind FROM assets WHERE workspace_id = ${wedding.workspace_id} AND kind <> 'logo' ORDER BY (wedding_id = ${id}) DESC NULLS LAST, created_at DESC LIMIT 120` as unknown as Promise<Asset[]>,
  ]);
  return (
    <>
    <PurchaseBridge weddingId={id} />
    <Studio
      wedding={isAdmin(user) ? { ...wedding, tier: wedding.tier ?? "luxury", video_tier: "luxury", expires_at: null } : wedding}
      initialMessages={messages}
      initialDocs={docs}
      initialPhotos={photos}
      realtimeUrl={process.env.NEON_REALTIME_URL ?? ""}
      capabilities={{ email: emailEnabled(), domains: vercelEnabled() }}
      editable={canEdit(wedding.role)}
      adminView={isAdmin(user) && wedding.owner_id !== user.id}
    />
    </>
  );
}

// Per-request page (auth/DB) — render on demand.
export const instant = false;
