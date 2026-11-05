import type { CSSProperties } from "react";
import { leaf } from "../_shared/botanic";
import { r2 } from "../_shared/kit";

const DOVE = "M14 62C18 54 26 50 34 52C44 54 52 60 64 62C84 64 104 60 124 52L150 40L144 52L160 47L147 59L162 61L140 68C120 80 92 86 66 84C46 82 30 74 22 68L14 66L6 64Z";
const WING = "M56 62C64 40 82 18 112 6C104 22 108 28 102 38C114 32 120 34 128 32C114 46 98 56 80 62M70 52C80 42 94 34 106 30M76 58C88 52 100 46 112 42";

/** Two doves carrying an olive branch — single-weight line, for drawing in. */
export function Doves({ className, style, stroke = "currentColor", sw = 1.4 }: { className?: string; style?: CSSProperties; stroke?: string; sw?: number }) {
  const leaves = Array.from({ length: 9 }, (_, i) => {
    const t = (i + 1) / 10;
    const x = 150 + t * 120;
    const y = 120 - Math.sin(t * Math.PI) * 18 + t * 6;
    return <path key={i} d={leaf(18 - t * 5, 6)} transform={`translate(${r2(x)} ${r2(y)}) rotate(${i % 2 ? 50 : 130})`} />;
  });
  return (
    <svg viewBox="0 0 420 200" className={className} style={style} aria-hidden fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <g className="wg-draw">
        <path d={DOVE} transform="translate(20 30)" />
        <path d={WING} transform="translate(20 30)" />
        <circle cx="44" cy="88" r="1.6" fill={stroke} />
        <path d={DOVE} transform="translate(400 36) scale(-1 1)" />
        <path d={WING} transform="translate(400 36) scale(-1 1)" />
        <circle cx="376" cy="94" r="1.6" fill={stroke} />
        <path d="M150 120Q210 96 270 126" />
        {leaves}
        <circle cx="232" cy="122" r="3.4" />
        <circle cx="196" cy="110" r="3" />
      </g>
    </svg>
  );
}

/** A single sprig of olive for rules. */
export function Olive({ className, style, stroke = "currentColor" }: { className?: string; style?: CSSProperties; stroke?: string }) {
  return (
    <svg viewBox="0 0 200 40" className={className} style={style} aria-hidden fill="none" stroke={stroke} strokeWidth="1.1" strokeLinecap="round">
      <path d="M0 20H62M138 20H200" />
      <path d="M72 22Q100 12 128 22" />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={leaf(11, 4)} transform={`translate(${80 + i * 8} ${19 - Math.sin(((i + 1) / 7) * Math.PI) * 4}) rotate(${i % 2 ? 50 : 130})`} />)}
    </svg>
  );
}
