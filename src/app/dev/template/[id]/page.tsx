import { notFound } from "next/navigation";
import { templateById } from "@/lib/catalog";
import { themeById } from "@/lib/themes";
import { isKind, type Kind } from "@/lib/templates";
import type { Profile } from "@/lib/profile";
import { WeddingSite } from "@/components/WeddingSite";
import { Paper } from "@/components/designs/Paper";

// DEV ONLY: render any catalog template with its sample names for visual review/screenshots.
// /dev/template/<id>?kind=website|invite|save|story|thankyou|greeting&compact=1
export default async function DevTemplate({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ kind?: string; compact?: string; photo?: string }> }) {
  if (process.env.NODE_ENV === "production" && process.env.DEV_PREVIEW !== "1") notFound();
  const t = templateById((await params).id);
  if (!t) notFound();
  const sp = await searchParams;
  const kind: Kind = isKind(sp.kind) ? sp.kind : "website";
  const p: Profile = {
    occasion: t.occasion, partner1: t.sample.partner1, partner2: t.sample.partner2, date: t.sample.date, venue: t.sample.venue, city: t.sample.city,
    language: t.sample.language ?? "en", age: t.sample.age,
    story: "We met on a monsoon evening in Goa, sheltering under the same café awning. One conversation became a hundred, and here we are.",
    events: [{ name: "Welcome evening", date: t.sample.date, time: "6:00 pm", venue: t.sample.venue }, { name: "Ceremony", date: t.sample.date, time: "5:00 pm", venue: t.sample.venue }, { name: "Dinner & dancing", date: t.sample.date, time: "8:00 pm", venue: t.sample.venue }],
  };
  const theme = themeById(t.theme);
  const design = { template: t.id, motif: t.motif, fonts: t.fonts };
  const photo = sp.photo ?? "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
  if (kind === "website") return <WeddingSite profile={p} theme={theme} design={design} layout={t.siteLayout} heroUrl={photo} compact={sp.compact === "1"}><div className="rounded-2xl border p-6 text-center">[RSVP form]</div></WeddingSite>;
  return (
    <main className="grid min-h-dvh place-items-center bg-neutral-200 p-8">
      <div className="w-[min(92vw,520px)]"><Paper kind={kind} layout={t.paperLayout} profile={p} theme={theme} design={design} photoUrl={photo} /></div>
    </main>
  );
}
