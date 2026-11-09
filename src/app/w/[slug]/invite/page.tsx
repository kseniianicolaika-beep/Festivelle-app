import { notFound } from "next/navigation";
import { getWeddingBySlug } from "@/lib/db";
import { listDocs } from "@/lib/docs";
import { PieceView } from "@/components/designs/PieceView";
import { themeById } from "@/lib/themes";
import { Petals } from "@/components/fx/Petals";
import { Tilt } from "@/components/fx/Tilt";
import { PrintButton } from "./PrintButton";

// Public, printable invitation for guests (the wedding's first invitation piece).
export default async function Invite({ params }: { params: Promise<{ slug: string }> }) {
  const w = await getWeddingBySlug((await params).slug);
  if (!w?.published) notFound();
  const doc = (await listDocs(w.id)).find((d) => d.kind === "invite");
  if (!doc) notFound();
  const theme = themeById(doc.design.theme ?? w.theme);
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-10 overflow-hidden p-6" style={{ background: theme.bg }}>
      <div className="no-print"><Petals count={16} colors={theme.petals} /></div>
      <Tilt className="rise relative w-full max-w-[430px]"><PieceView doc={doc} profile={w.profile} suiteTheme={w.theme} /></Tilt>
      <PrintButton />
    </main>
  );
}

// Per-request page (DB) — render on demand.
