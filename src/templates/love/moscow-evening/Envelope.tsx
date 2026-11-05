import type { CSSProperties, ReactNode } from "react";
import { GRAIN } from "../_shared/kit";
import { Seal } from "./art";

const paper = "linear-gradient(160deg, color-mix(in oklab, var(--t-surface) 92%, var(--t-gold)), color-mix(in oklab, var(--t-bg) 88%, var(--t-gold)))";
const LINER = "repeating-radial-gradient(circle at 50% 0, transparent 0 7px, color-mix(in oklab, var(--t-gold) 45%, transparent) 7px 8px), radial-gradient(circle at 50% 0, #fff 0 30%, color-mix(in oklab, var(--t-surface) 70%, var(--t-gold)) 100%)";

/** Ivory envelope with lace liner + wax seal that opens and lets the letter rise. `opened` = final state (no motion). */
export function Envelope({ a, b, children, opened, className = "", style, seal = "15cqw" }: { a: string; b?: string; children: ReactNode; opened?: boolean; className?: string; style?: CSSProperties; seal?: string }) {
  return (
    <div className={`relative ${opened ? "opened" : ""} ${className}`} style={{ aspectRatio: "1.42", perspective: "1400px", ...style }}>
      {/* back + liner */}
      <div className="absolute inset-0 rounded-[1.2%] shadow-[0_30px_60px_-30px_rgba(60,40,20,.55)]" style={{ background: paper }} />
      <div className="absolute inset-[2%] top-0" style={{ background: LINER, clipPath: "polygon(0 0,100% 0,50% 56%)" }} />
      {/* the letter */}
      <div className="letter absolute inset-x-[6%] bottom-[5%] top-[5%] z-[1]">
        <div className="relative h-full w-full overflow-hidden rounded-[1%] bg-[var(--t-surface)] shadow-[0_4px_18px_-6px_rgba(60,40,20,.35)]" style={{ backgroundImage: GRAIN }}>{children}</div>
      </div>
      {/* front pocket */}
      <div className="pointer-events-none absolute inset-0 z-[2] rounded-[1.2%]" style={{ background: paper, clipPath: "polygon(0 0,50% 54%,100% 0,100% 100%,0 100%)", boxShadow: "inset 0 -2px 0 rgba(0,0,0,.04)" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(32deg, transparent 49.6%, rgba(90,70,40,.12) 50%, transparent 50.8%), linear-gradient(-32deg, transparent 49.6%, rgba(90,70,40,.12) 50%, transparent 50.8%)", backgroundImage: `${GRAIN}, linear-gradient(32deg, transparent 49.6%, rgba(90,70,40,.12) 50%, transparent 50.8%), linear-gradient(-32deg, transparent 49.6%, rgba(90,70,40,.12) 50%, transparent 50.8%)` }} />
      </div>
      {/* flap */}
      <div className="flap pointer-events-none absolute inset-x-0 top-0 z-[3] h-[58%]" style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute inset-0" style={{ background: paper, clipPath: "polygon(0 0,100% 0,50% 100%)", backfaceVisibility: "hidden", filter: "drop-shadow(0 2px 2px rgba(0,0,0,.15))" }} />
        <div className="absolute inset-0" style={{ background: LINER, clipPath: "polygon(0 0,100% 0,50% 100%)", transform: "rotateX(180deg)", backfaceVisibility: "hidden" }} />
      </div>
      <Seal a={a} b={b} className="seal-go absolute left-1/2 top-[57%] z-[4] -translate-x-1/2 -translate-y-1/2" style={{ width: seal, height: seal, fontSize: `calc(${seal} * .36)` }} />
    </div>
  );
}
