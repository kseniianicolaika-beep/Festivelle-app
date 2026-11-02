import { notFound } from "next/navigation";
import { getWeddingBySlug } from "@/lib/db";
import { InvitationCard } from "@/components/InvitationCard";
import { themeById } from "@/lib/themes";
import { PrintButton } from "./PrintButton";


export default async function Invite({ params }: { params: Promise<{ slug: string }> }) {
  const w = await getWeddingBySlug((await params).slug);
  if (!w?.published) notFound();
  const theme = themeById(w.theme);
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 p-6" style={{ background: theme.bg }}>
      <InvitationCard profile={w.profile} theme={theme} />
      <PrintButton />
    </main>
  );
}

// Per-request page (auth/DB) — render on demand.
export const instant = false;
