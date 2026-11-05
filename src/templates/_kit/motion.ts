// Festivelle motion language — one shared vocabulary for the product shell and the bespoke templates.
// Philosophy: "ink settling on paper". Slow in, soft land; nothing bounces unless it's a child's party.

// Cubic-bézier curves (CSS strings + arrays for motion/react, + gsap names).
export const EASE = {
  /** The house curve: a long, silken settle. Use for most entrances. */
  silk: [0.2, 0.7, 0.2, 1] as const,
  /** Expo-out: confident, editorial. Headlines, masks, curtains. */
  expo: [0.16, 1, 0.3, 1] as const,
  /** In-out for things that travel (sheets, page turns, device swaps). */
  drift: [0.65, 0, 0.35, 1] as const,
  /** A breath: symmetric, gentle. Loops, ambient pulses. */
  breath: [0.45, 0, 0.55, 1] as const,
  /** Playful overshoot — kids, birthdays, pop-to-reveal only. */
  pop: [0.34, 1.56, 0.64, 1] as const,
} as const;

export const css = (e: readonly number[]) => `cubic-bezier(${e.join(",")})`;

export const GSAP_EASE = {
  silk: "power3.out",
  expo: "expo.out",
  drift: "power2.inOut",
  breath: "sine.inOut",
  pop: "back.out(1.6)",
} as const;

// Durations in seconds. Pair: micro (UI feedback), short (UI), base (content), long (hero), epic (openings).
export const DUR = { micro: 0.18, short: 0.35, base: 0.7, long: 1.1, epic: 1.8 } as const;

// Stagger rhythm for lists, lines, letters.
export const STAGGER = { letters: 0.028, words: 0.05, lines: 0.09, cards: 0.07 } as const;

/** True when the visitor asked for less motion (SSR-safe: false on the server). */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** Shared presets for motion/react components. */
export const REVEAL = {
  initial: { opacity: 0, y: 28, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: DUR.long, ease: EASE.silk },
} as const;
