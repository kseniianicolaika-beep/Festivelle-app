import type { MusicId } from "../types";

// Server-safe music metadata (Music.tsx is a client module).
export const MUSIC_NAMES: Record<MusicId, string> = {
  "piano-romance": "Piano romance",
  "strings-waltz": "A strings waltz",
  "sitar-dawn": "Sitar at dawn",
  "music-box": "Music box lullaby",
  "lofi-glow": "Lo-fi glow",
  "folk-balalaika": "Balalaika evening",
  "ambient-sea": "The sea at dusk",
  "celebration-swing": "Celebration swing",
};

/** Sensible score when a template doesn't declare one. */
export function musicForOccasion(occasion?: string | null): MusicId {
  switch (occasion) {
    case "engagement":
    case "anniversary": return "strings-waltz";
    case "birthday": return "celebration-swing";
    case "kids":
    case "baby_shower": return "music-box";
    case "greeting": return "lofi-glow";
    default: return "piano-romance";
  }
}

