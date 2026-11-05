import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { getWeddingForUser, sql } from "@/lib/db";
import type { Design } from "@/lib/templates";
import { VideoStudio } from "./VideoStudio";
import { isAdmin } from "@/lib/admin";

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) redirect(`/auth/sign-in?next=/studio/${id}/video`);
  const w = await getWeddingForUser(id, user);
  if (!w) notFound();
  const [first] = (await sql`SELECT design FROM documents WHERE wedding_id = ${id} ORDER BY position LIMIT 1`) as { design: Design }[];
  return <VideoStudio id={w.id} profile={w.profile} themeId={first?.design.theme ?? w.theme} motif={first?.design.motif} videoTier={isAdmin(user) ? "luxury" : w.video_tier ?? null} />;
}

export const instant = false;
