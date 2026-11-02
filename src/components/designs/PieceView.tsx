import type { Profile } from "@/lib/profile";
import { themeById } from "@/lib/themes";
import type { Doc } from "@/lib/templates";
import { Paper } from "./Paper";
import { WeddingSite } from "../WeddingSite";

const media = (k?: string | null) => (k ? `/api/media?key=${encodeURIComponent(k)}` : null);

// Renders any piece (website or paper) with the suite theme unless the piece overrides it.
export function PieceView({ doc, profile, suiteTheme, animate = true, rsvpSlot }: { doc: Doc; profile: Profile; suiteTheme: string; animate?: boolean; rsvpSlot?: React.ReactNode }) {
  const theme = themeById(doc.design.theme ?? suiteTheme);
  if (doc.kind === "website")
    return (
      <WeddingSite profile={profile} theme={theme} heroUrl={media(profile.heroKey)} layout={doc.layout} motif={doc.design.motif} compact>
        {rsvpSlot}
      </WeddingSite>
    );
  return <Paper kind={doc.kind} layout={doc.layout} design={doc.design} profile={profile} theme={theme} photoUrl={media(doc.design.photoKey ?? profile.heroKey)} animate={animate} />;
}
