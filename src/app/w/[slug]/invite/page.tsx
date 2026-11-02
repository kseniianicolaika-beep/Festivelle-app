import { notFound } from "next/navigation";
import { getWeddingBySlug } from "@/lib/db";
import { InvitationCard } from "@/components/InvitationCard";
import { petalColors, themeById } from "@/lib/themes";
import { Petals } from "@/components/fx/Petals";
import { Tilt } from "@/components/fx/Tilt";
import { PrintButton } from "./PrintButton";

export default async function Invite({ params }: { params: Promise<{ slug: string }> }) {
  const w = await getWeddingBySlug((await params).slug);
  if (!w?.published) notFound();
  const theme = themeById(w.theme);
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-10 overflow-hidden p-6" style={{ background: theme.bg }}>
      <div className="no-print"><Petals count={16} colors={petalColors(theme)} /></div>
      <Tilt className="rise relative w-full max-w-[430px]"><InvitationCard profile={w.profile} theme={theme} /></Tilt>
      <PrintButton />
    </main>
  );
}

// Per-request page (DB) — render on demand.
export const instant = false;
