import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { getWeddingForUser } from "@/lib/db";
import { getDoc } from "@/lib/docs";
import { PieceView } from "@/components/designs/PieceView";
import { themeById } from "@/lib/themes";
import { KINDS } from "@/lib/templates";
import { PrintButton } from "@/app/w/[slug]/invite/PrintButton";

// Print-ready view of any piece (browser "Save as PDF" gives a vector PDF).
export default async function Print({ params }: { params: Promise<{ id: string; docId: string }> }) {
  const { id, docId } = await params;
  const user = await currentUser();
  if (!user) redirect(`/auth/sign-in?next=/studio/${id}/print/${docId}`);
  const w = await getWeddingForUser(id, user);
  const doc = w && (await getDoc(id, docId));
  if (!w || !doc || doc.kind === "website") notFound();
  const theme = themeById(doc.design.theme ?? w.theme);
  const wide = KINDS[doc.kind].ratio === "7/5";
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 p-6 print:p-0" style={{ background: theme.bg }}>
      <style>{`@media print { @page { margin: 0; size: auto; } main { background: white !important; } [data-sheet] { box-shadow: none !important; width: 100vw !important; max-width: none !important; } }`}</style>
      <div data-sheet className={`w-full ${wide ? "max-w-[640px]" : "max-w-[480px]"}`}>
        <PieceView doc={doc} profile={w.profile} suiteTheme={w.theme} animate={false} />
      </div>
      <PrintButton />
    </main>
  );
}

export const instant = false;
