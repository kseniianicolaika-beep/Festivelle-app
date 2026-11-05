import type { BespokeGroup } from "../types";
import CNSite from "./champagne-noir/Site";
import CNCard from "./champagne-noir/Card";
import DTSite from "./dirty-thirty/Site";
import DTCard from "./dirty-thirty/Card";
import FFSite from "./forty-fabulous/Site";
import FFCard from "./forty-fabulous/Card";
import FGSite from "./fifty-garden/Site";
import FGCard from "./fifty-garden/Card";
import SBSite from "./sixty-blessings/Site";
import SBCard from "./sixty-blessings/Card";
import SDSite from "./sundowner/Site";
import SDCard from "./sundowner/Card";
import DRSite from "./den-rozhdeniya/Site";
import DRCard from "./den-rozhdeniya/Card";
import VCSite from "./velvet-cake/Site";
import VCCard from "./velvet-cake/Card";

// Bespoke template modules for this group. Key = catalog id (src/lib/catalog.ts).
export const GROUP: BespokeGroup = {
  "champagne-noir": { site: CNSite, card: CNCard, music: "celebration-swing", opening: "Letterbox & cork pop" },
  "dirty-thirty": { site: DTSite, card: DTCard, music: "celebration-swing", opening: "Disco drop" },
  "forty-fabulous": { site: FFSite, card: FFCard, music: "celebration-swing", opening: "Gilded deco doors" },
  "fifty-garden": { site: FGSite, card: FGCard, music: "piano-romance", opening: "Ink-drawn eucalyptus" },
  "sixty-blessings": { site: SBSite, card: SBCard, music: "sitar-dawn", opening: "Thoranam & the lit lamp" },
  sundowner: { site: SDSite, card: SDCard, music: "ambient-sea", opening: "Sun sinks into the Arabian Sea" },
  "den-rozhdeniya": { site: DRSite, card: DRCard, music: "folk-balalaika", opening: "Porcelain letter unfolds" },
  "velvet-cake": { site: VCSite, card: VCCard, music: "strings-waltz", opening: "Iris on candlelight" },
};
