import { Aurora } from "./Aurora";

// A soft aurora wash that dissolves into the page (no hard edge at the bottom of a section).
export function Wash({ colors, className = "" }: { colors?: string[]; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] ${className}`}>
      <Aurora colors={colors} />
    </div>
  );
}
