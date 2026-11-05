"use client";
import { useState, type CSSProperties } from "react";
import { Chubby, Rattle, Spark, LS } from "./art";

/** Tap-to-twinkle star: spins and throws a little burst of sparkles. */
export function TapStar({ c, face, className = "", style }: { c?: string; face?: boolean; className?: string; style?: CSSProperties }) {
  const [n, setN] = useState(0);
  const tones = [LS.butter, LS.peach, LS.mint, LS.sky, LS.lilac];
  return (
    <button type="button" aria-label="twinkle" className={`ls-tap absolute ${className}`} style={style} onClick={() => setN((x) => x + 1)}>
      <span key={n} className={`block ${n ? "ls-spun" : ""}`}><Chubby c={c} face={face} className="w-full" /></span>
      {n > 0 && Array.from({ length: 7 }, (_, i) => {
        const t = (i / 7) * Math.PI * 2;
        return <Spark key={`${n}-${i}`} c={tones[i % 5]} className="ls-burst left-1/2 top-1/2 w-[45%]" style={{ "--x": `${Math.cos(t) * 140}%`, "--y": `${Math.sin(t) * 140}%` } as CSSProperties} />;
      })}
    </button>
  );
}

/** Rattle that shakes when tapped. */
export function TapRattle({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const [n, setN] = useState(0);
  return (
    <button type="button" aria-label="shake the rattle" className={`absolute ${className}`} style={style} onClick={() => setN((x) => x + 1)}>
      <span className="ls-wiggle block" style={{ "--dl": "1.4s" } as CSSProperties}>
        <span key={n} className={`block ${n ? "ls-shake" : ""}`} style={{ transformOrigin: "50% 85%", transform: "rotate(-6deg)" }}><Rattle className="w-full" /></span>
      </span>
    </button>
  );
}

/** Two-letter overlapping monogram. */
export function Monogram({ a, b, size }: { a: string; b: string; size: string }) {
  const i1 = [...(a || "")][0]?.toUpperCase() ?? "";
  const i2 = [...(b || "")][0]?.toUpperCase() ?? "";
  return (
    <div className="d ls-stamp relative flex items-center justify-center leading-none" style={{ fontSize: size, "--dl": "1.5s" } as CSSProperties}>
      <span className="relative z-[1] text-[var(--ls-navy)]">{i1}</span>
      {i2 && <span className="h relative z-[2] mx-[.02em] translate-y-[.12em] text-[.42em] font-bold text-[var(--ls-peach)]">&amp;</span>}
      {i2 && <span className="relative translate-y-[.18em] text-[var(--ls-butter)]" style={{ WebkitTextStroke: "0.025em var(--ls-navy)" }}>{i2}</span>}
    </div>
  );
}
