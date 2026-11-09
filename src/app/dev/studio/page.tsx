import { notFound } from "next/navigation";
import { Studio, type Msg } from "@/app/studio/[id]/Studio";
import { templateById } from "@/lib/catalog";
import { defaultDesign, type Doc, type Kind } from "@/lib/templates";
import { sampleProfile } from "@/components/marketing/TemplatePreview";
import type { Wedding } from "@/lib/db";
import type { Profile } from "@/lib/profile";

// DEV ONLY: the studio UI with mock data (no auth, no DB; saving/chat calls will simply fail).
// /dev/studio?template=ashwem-dusk&kind=website|invite&named=0
export default async function DevStudio({ searchParams }: { searchParams: Promise<{ template?: string; kind?: string; named?: string }> }) {
  if (process.env.NODE_ENV === "production" && process.env.DEV_PREVIEW !== "1") notFound();
  const sp = await searchParams;
  const t = templateById(sp.template ?? "ashwem-dusk") ?? templateById("ashwem-dusk")!;
  const named = sp.named !== "0";
  const profile: Profile = named ? sampleProfile(t) : { occasion: t.occasion };
  const kinds: Kind[] = ["website", "invite", "save", "story", "thankyou"];
  const first = sp.kind === "invite" ? 1 : 0;
  const docs: Doc[] = kinds.map((k, i) => ({ id: `doc-${k}`, kind: k, layout: k === "website" ? t.siteLayout : t.paperLayout, design: { ...(k === "website" ? {} : defaultDesign(k, profile)), template: t.id, motif: t.motif, fonts: t.fonts }, position: (i - first + kinds.length) % kinds.length })).sort((a, b) => a.position - b.position);
  const wedding = { id: "00000000-0000-0000-0000-000000000000", owner_id: "dev", workspace_id: "dev", client_name: null, slug: "preview", profile, theme: t.theme, step: 0, published: false, plan: "free", custom_domain: null, tier: null, video_tier: null, activated_at: null, expires_at: null, subdomain: named ? "anya-rohan" : null, role: "owner" } as Wedding;
  const messages: Msg[] = named
    ? [
        { id: "m1", role: "assistant", content: `Lovely choice — “${t.name}”. Congratulations! What are your names?`, chips: [] },
        { id: "m2", role: "user", content: `${profile.partner1} & ${profile.partner2}`, chips: [] },
        { id: "m3", role: "assistant", content: "What beautiful names together. When is the big day, and where will it be?", chips: ["February 2027 in Goa", "We haven't decided yet"] },
      ]
    : [{ id: "m1", role: "assistant", content: `Lovely choice — “${t.name}”. Congratulations! First things first — what are your names?`, chips: ["Anya & Rohan", "Just one name"] }];
  return <Studio wedding={wedding} initialMessages={messages} initialDocs={docs} initialPhotos={[]} realtimeUrl="" capabilities={{ email: false, domains: false }} editable />;
}

