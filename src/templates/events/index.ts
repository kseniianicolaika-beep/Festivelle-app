import type { BespokeGroup } from "../types";
import PBSite from "./petal-brunch/Site";
import PBCard from "./petal-brunch/Card";
import MMSite from "./mehndi-mimosa/Site";
import MMCard from "./mehndi-mimosa/Card";
import FESite from "./fontainhas-eve/Site";
import FECard from "./fontainhas-eve/Card";
import MTSite from "./midnight-toast/Site";
import MTCard from "./midnight-toast/Card";
import PKSite from "./pink-or-blue/Site";
import PKCard from "./pink-or-blue/Card";
import SSSite from "./sealed-secret/Site";
import SSCard from "./sealed-secret/Card";
import CDSite from "./chapel-doves/Site";
import CDCard from "./chapel-doves/Card";
import KKSite from "./kupol-krestiny/Site";
import KKCard from "./kupol-krestiny/Card";

// Bespoke template modules for this group (bridal shower, rehearsal dinner, gender reveal, baptism).
// Key = catalog id (src/lib/catalog-events.ts). Shared skeleton: ./_shared/kit.tsx.
export const GROUP: BespokeGroup = {
  "petal-brunch": { site: PBSite, card: PBCard, music: "strings-waltz", opening: "Silk ribbon swings loose, petals fall" },
  "mehndi-mimosa": { site: MMSite, card: MMCard, music: "sitar-dawn", opening: "Marigold toran drops; henna inks itself across the palm" },
  "fontainhas-eve": { site: FESite, card: FECard, music: "piano-romance", opening: "Dusk falls; tapers light pair by pair down the table" },
  "midnight-toast": { site: MTSite, card: MTCard, music: "lofi-glow", opening: "Clock hands sweep to a minute to midnight; flutes clink" },
  "pink-or-blue": { site: PKSite, card: PKCard, music: "music-box", opening: "Balloons rise; the golden “?” spins in" },
  "sealed-secret": { site: SSSite, card: SSCard, music: "music-box", opening: "Envelope drifts in; the secret peeks out; wax seal presses down" },
  "chapel-doves": { site: CDSite, card: CDCard, music: "strings-waltz", opening: "Chapel doors open on golden light; doves rise" },
  "kupol-krestiny": { site: KKSite, card: KKCard, music: "folk-balalaika", opening: "Light sweeps the gilded domes; the bells swing" },
};
