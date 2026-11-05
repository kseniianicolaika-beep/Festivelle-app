import { useId } from "react";

/** SVG-safe unique id prefix (React's useId contains characters that break url(#…) in some browsers). */
export const useSvgId = (p: string) => p + useId().replace(/[^a-zA-Z0-9]/g, "");
