import type { BespokeGroup } from "../types";
import BalloonSite from "./balloon-parade/Site";
import BalloonCard from "./balloon-parade/Card";
import SeaSite from "./under-the-sea/Site";
import SeaCard from "./under-the-sea/Card";
import StarSite from "./starship/Site";
import StarCard from "./starship/Card";
import MoonSite from "./sleepy-moon/Site";
import MoonCard from "./sleepy-moon/Card";
import PicnicSite from "./sunshine-picnic/Site";
import PicnicCard from "./sunshine-picnic/Card";
import ArtistSite from "./little-artist/Site";
import ArtistCard from "./little-artist/Card";
import CastleSite from "./princess-castle/Site";
import CastleCard from "./princess-castle/Card";
import JungleSite from "./jungle-safari/Site";
import JungleCard from "./jungle-safari/Card";

// Bespoke template modules for this group. Key = catalog id (src/lib/catalog.ts).
export const GROUP: BespokeGroup = {
  "balloon-parade": { site: BalloonSite, card: BalloonCard, music: "celebration-swing", opening: "Pop the balloon" },
  "under-the-sea": { site: SeaSite, card: SeaCard, music: "ambient-sea", opening: "Bubble-up name" },
  starship: { site: StarSite, card: StarCard, music: "lofi-glow", opening: "3-2-1 rocket launch" },
  "sleepy-moon": { site: MoonSite, card: MoonCard, music: "music-box", opening: "Moonrise lullaby" },
  "sunshine-picnic": { site: PicnicSite, card: PicnicCard, music: "sitar-dawn", opening: "Kites take flight" },
  "little-artist": { site: ArtistSite, card: ArtistCard, music: "lofi-glow", opening: "Paint splash & brushstroke name" },
  "princess-castle": { site: CastleSite, card: CastleCard, music: "music-box", opening: "Castle doors swing open" },
  "jungle-safari": { site: JungleSite, card: JungleCard, music: "celebration-swing", opening: "Leaves part, animals peek" },
};
