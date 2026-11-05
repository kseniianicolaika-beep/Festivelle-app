import type { Look } from "../_shared/kit";
import { F } from "../_shared/fonts";

// Gzhel Garden — glazed white porcelain, cobalt brushwork and a hairline of gold.
export const GZ = { white: "#fbfcff", porcelain: "#f1f5fd", cobalt: "#1c3f94", deep: "#11286a", bright: "#2a5bd7", pale: "#a9bfee", mist: "#dbe5fa", navy: "#0f1f4d", muted: "#5d6b8f", gold: "#c3a265" } as const;

export const GZHEL_LOOK: Look = { bg: GZ.white, surface: "#ffffff", ink: GZ.navy, muted: GZ.muted, accent: GZ.cobalt, gold: GZ.gold, foilA: "#9c7c3e", foilB: "#ecd59f", display: F.yeseva, script: F.yeseva, body: F.manrope };
