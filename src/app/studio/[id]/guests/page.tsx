import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";
import { getWeddingForUser } from "@/lib/db";
import { canEdit } from "@/lib/workspace";
import { displayNames } from "@/lib/occasions";
import { emailEnabled } from "@/lib/email";
import { GuestManager } from "./GuestManager";

export default async function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) redirect(`/auth/sign-in?next=/studio/${id}/guests`);
  const w = await getWeddingForUser(id, user);
  if (!w) notFound();
  return (
    <main className="grain min-h-dvh bg-paper">
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-6 md:px-6">
        <Link href={`/studio/${id}`} className="text-sm text-muted hover:text-ink">← Back to the studio</Link>
        <p className="eyebrow mt-6 text-rose">{displayNames(w.profile)}</p>
        <h1 className="display mt-2 text-5xl">Your <em className="text-rose">guests</em></h1>
        <GuestManager
          weddingId={id}
          editable={canEdit(w.role)}
          published={w.published}
          events={(w.profile.events ?? []).map((e) => e.name)}
          names={displayNames(w.profile)}
          lang={w.profile.language ?? "en"}
          email={await emailEnabled()}
          guestPhotos={w.tier === "premium" || w.tier === "luxury"}
        />
      </div>
    </main>
  );
}

