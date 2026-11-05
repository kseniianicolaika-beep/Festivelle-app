"use client";
import type { CSSProperties, ReactNode } from "react";
import { Bow, Seal } from "./art";

/**
 * The hero envelope: silk ribbon unties, the flap opens (liner inside), the letter rises.
 * Final state (static / reduced motion / print) = open envelope with the letter standing out of it.
 */
export function Envelope({ children, className = "", style, seal }: { children: ReactNode; className?: string; style?: CSSProperties; seal?: string }) {
  return (
    <div className={`bb-env ${className}`} style={{ containerType: "inline-size", ...style }}>
      <div className="bb-envback"><div className="bb-liner" /></div>
      <div className="bb-flap" aria-hidden><i /><i /></div>
      <div className="bb-clip" style={{ zIndex: 2 }}>
        <div className="bb-letter bb-letterpaper">{children}</div>
      </div>
      <svg className="bb-front" viewBox="0 0 145 100" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="bbfrontg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbe4e6" /><stop offset="1" stopColor="#f0c7cd" /></linearGradient>
          <linearGradient id="bbsideg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f4d2d6" /><stop offset="1" stopColor="#f8dfe1" /></linearGradient>
        </defs>
        <path d="M0 2L70 60Q72.5 62 75 60L145 2V100H0Z" fill="url(#bbsideg)" />
        <path d="M0 100L68 54Q72.5 51 77 54L145 100Z" fill="url(#bbfrontg)" />
        <path d="M0 100L68 54Q72.5 51 77 54L145 100" fill="none" stroke="#c98a96" strokeOpacity=".35" strokeWidth=".4" vectorEffect="non-scaling-stroke" />
        <path d="M0 2L70 60Q72.5 62 75 60L145 2" fill="none" stroke="#c98a96" strokeOpacity=".25" strokeWidth=".4" vectorEffect="non-scaling-stroke" />
      </svg>
      {seal && <div className="absolute left-1/2 top-[50%] z-[4] w-[13%] -translate-x-1/2 -translate-y-1/2"><Seal letter={seal} className="w-full drop-shadow-[0_3px_4px_rgba(120,40,60,.35)]" /></div>}
      <div className="bb-ribbon" aria-hidden />
      <div className="bb-bowwrap" aria-hidden><Bow className="w-full" /></div>
    </div>
  );
}
