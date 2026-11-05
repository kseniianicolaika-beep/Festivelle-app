import type { BespokeGroup } from "../types";
import GatsbySite from "./gatsby-vows/Site";
import GatsbyCard from "./gatsby-vows/Card";
import VologdaSite from "./vologda-lace/Site";
import VologdaCard from "./vologda-lace/Card";
import GzhelSite from "./gzhel-garden/Site";
import GzhelCard from "./gzhel-garden/Card";
import MehendiSite from "./mehendi-ambi/Site";
import MehendiCard from "./mehendi-ambi/Card";
import SageSite from "./sage-linen/Site";
import SageCard from "./sage-linen/Card";
import TerracottaSite from "./terracotta-table/Site";
import TerracottaCard from "./terracotta-table/Card";
import LotusSite from "./lotus-vows/Site";
import LotusCard from "./lotus-vows/Card";
import PolaroidSite from "./our-polaroids/Site";
import PolaroidCard from "./our-polaroids/Card";

// Bespoke template modules for this group. Key = catalog id (src/lib/catalog.ts).
export const GROUP: BespokeGroup = {
  "gatsby-vows": { site: GatsbySite, card: GatsbyCard, music: "celebration-swing", opening: "The Gilded Gates" },
  "vologda-lace": { site: VologdaSite, card: VologdaCard, music: "strings-waltz", opening: "The Lifted Lace Veil" },
  "gzhel-garden": { site: GzhelSite, card: GzhelCard, music: "folk-balalaika", opening: "The Painted Plate" },
  "mehendi-ambi": { site: MehendiSite, card: MehendiCard, music: "sitar-dawn", opening: "The Henna Cone" },
  "sage-linen": { site: SageSite, card: SageCard, music: "piano-romance", opening: "The Growing Sprig" },
  "terracotta-table": { site: TerracottaSite, card: TerracottaCard, music: "strings-waltz", opening: "Golden-Hour Letterbox" },
  "lotus-vows": { site: LotusSite, card: LotusCard, music: "sitar-dawn", opening: "The Lotus-Seal Envelope" },
  "our-polaroids": { site: PolaroidSite, card: PolaroidCard, music: "lofi-glow", opening: "The Developing Polaroid" },
};
