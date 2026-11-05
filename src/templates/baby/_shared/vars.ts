import type { CSSProperties } from "react";
import type { Theme } from "@/lib/themes";
import { designVars } from "@/lib/themes";
import type { Design } from "@/lib/templates";

/**
 * Theme + palette vars. design.fonts is honoured only when the couple picked a pairing different from the
 * catalog default (otherwise every bespoke template would be forced onto the generic pairing). When honoured,
 * --f-display / --f-script / --f-body are set and our CSS prefers them via var(--f-display, <own>).
 */
export function bxVars(theme: Theme, design: Design | undefined, catalogFonts: string): CSSProperties {
  const custom = design?.fonts && design.fonts !== catalogFonts ? design.fonts : undefined;
  const v = designVars(theme, { palette: design?.palette, fonts: custom }) as Record<string, string>;
  // "initial" = guaranteed-invalid, so var(--f-display, own) falls back even if an ancestor set a pairing.
  if (!custom) Object.assign(v, { "--f-display": "initial", "--f-script": "initial", "--f-body": "initial" });
  return v as CSSProperties;
}
