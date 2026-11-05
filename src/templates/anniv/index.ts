import type { BespokeGroup } from "../types";
import PearlSite from "./pearl-years/Site";
import PearlCard from "./pearl-years/Card";
import RubySite from "./ruby-devotion/Site";
import RubyCard from "./ruby-devotion/Card";
import GoldSite from "./golden-jubilee/Site";
import GoldCard from "./golden-jubilee/Card";
import TnSite from "./then-and-now/Site";
import TnCard from "./then-and-now/Card";
import SbSite from "./silver-birch/Site";
import SbCard from "./silver-birch/Card";
import CdSite from "./champagne-decade/Site";
import CdCard from "./champagne-decade/Card";

// Bespoke template modules for this group. Key = catalog id (src/lib/catalog.ts).
export const GROUP: BespokeGroup = {
  "pearl-years": { site: PearlSite, card: PearlCard, music: "piano-romance", opening: "The Strand — thirty pearls thread themselves, one per year" },
  "ruby-devotion": { site: RubySite, card: RubyCard, music: "strings-waltz", opening: "The Velvet Curtain — claret drapes part and a faceted ruby turns into the light" },
  "golden-jubilee": { site: GoldSite, card: GoldCard, music: "sitar-dawn", opening: "The Palace Doors — carved jaali doors swing open onto a sun-lit jharokha, diyas and gold dust" },
  "then-and-now": { site: TnSite, card: TnCard, music: "music-box", opening: "The Developing Print — the wedding photo develops in sepia as the year rolls forward to today, tied by a red ribbon" },
  "silver-birch": { site: SbSite, card: SbCard, music: "folk-balalaika", opening: "The Unfolding Letter — a folded letter opens as silver birches grow from the snow and a frosted 25 appears" },
  "champagne-decade": { site: CdSite, card: CdCard, music: "celebration-swing", opening: "The Iris — a gold deco sunburst irises open on a giant 10 while a coupe tower fills from the top" },
};
