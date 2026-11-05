"use client";
import type { CSSProperties, ReactNode } from "react";
import type { Kind } from "@/lib/templates";
import type { SectionId } from "@/lib/templates";
import { ratioOf } from "./words";
import { useDaysUntil } from "./motion";

/** The card surface: fills its container width, holds the kind's aspect, and is a size container (use cqw). */
export function CardFrame({ kind, animate = true, className = "", style, children, id }: { kind: Kind; animate?: boolean; className?: string; style?: CSSProperties; children: ReactNode; id: string }) {
  return (
    <div
      data-bx={id}
      data-anim={animate ? "1" : "0"}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: ratioOf(kind), containerType: "inline-size", isolation: "isolate", ...style }}
    >
      {children}
    </div>
  );
}

/** Cotton-paper grain + soft deckle, as an absolutely positioned overlay. */
export function Grain({ opacity = 0.35, seed = 3, freq = 0.9, blend = "multiply" as CSSProperties["mixBlendMode"] }) {
  const id = `bxg${seed}`;
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity, mixBlendMode: blend }}>
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={3} seed={seed} stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.36  0 0 0 0.55 0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}

/** Wraps a website section with the editor hook. */
export const Sec = ({ id, className = "", style, children }: { id: SectionId; className?: string; style?: CSSProperties; children: ReactNode }) => (
  <section data-edit-section={id} id={`s-${id}`} className={`relative ${className}`} style={style}>{children}</section>
);

/** "42 days to go" — renders a stable placeholder on the server. */
export function DaysToGo({ iso, render }: { iso?: string; render: (n: number | null) => ReactNode }) {
  const n = useDaysUntil(iso);
  return <>{render(n)}</>;
}

export const Photo = ({ src, alt = "", className = "", style, slot = "hero" }: { src?: string | null; alt?: string; className?: string; style?: CSSProperties; slot?: "hero" | "photo" | "gallery" }) =>
  src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-edit-photo={slot} src={src} alt={alt} className={`h-full w-full object-cover ${className}`} style={style} />
  ) : (
    <div data-edit-photo={slot} className={`h-full w-full ${className}`} style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--t-accent) 25%, white), color-mix(in oklab, var(--t-gold) 30%, white))", ...style }} />
  );
