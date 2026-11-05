"use client";
import { useId, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { KINDS, sectionLayout, type Design, type Kind, type SectionId } from "@/lib/templates";
import type { Profile } from "@/lib/profile";
import type { Theme } from "@/lib/themes";
import { themeVars } from "@/lib/themes";
import { fontVars } from "@/lib/fonts";
import { templateById } from "@/lib/catalog";

/**
 * Template palette as --t-* vars. Our own palette is the default; a theme the couple switched to (≠ catalog theme),
 * design.palette, and a font pairing they picked (≠ catalog default) all win over it.
 */
export function tplVars(id: string, theme: Theme, design: Design | undefined, own: Record<string, string>) {
  const cat = templateById(id);
  const hex = (c?: string) => (c && /^#[0-9a-f]{3,8}$/i.test(c) ? c : undefined);
  const v: Record<string, string> = { ...own };
  if (cat && theme.id !== cat.theme) Object.assign(v, themeVars(theme) as Record<string, string>);
  const p = design?.palette;
  if (hex(p?.accent)) v["--t-accent"] = p!.accent!;
  if (hex(p?.bg)) { v["--t-bg"] = p!.bg!; v["--t-surface"] = p!.bg!; }
  if (hex(p?.ink)) v["--t-ink"] = p!.ink!;
  if (design?.fonts && design.fonts !== cat?.fonts) Object.assign(v, fontVars(design.fonts));
  return v;
}

/** The card sheet: exact aspect ratio, container-query sizing (cqw), theme vars, language. */
export function CardFrame({ kind, profile, className = "", style, children, vars }: { kind: Kind; profile: Profile; className?: string; style?: CSSProperties; children: ReactNode; vars: Record<string, string> }) {
  return (
    <div
      lang={profile.language ?? "en"}
      data-kind={kind}
      style={{ ...vars, aspectRatio: KINDS[kind].ratio, ...style } as CSSProperties}
      className={`@container relative w-full overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

type SectionRender = ReactNode | ((n: number) => ReactNode);
/** Ordered, hideable sections, each wrapped for the visual editor. A function gets its 1-based chapter number. */
export function Sections({ design, render, className }: { design?: Design; render: Partial<Record<SectionId, SectionRender | false | null | undefined | "">>; className?: string }) {
  const { order, hidden } = sectionLayout(design?.sections);
  const ids = order.filter((id) => !hidden.has(id) && render[id]);
  return (
    <div className={className}>
      {ids.map((id, i) => {
        const r = render[id];
        return <div key={id} data-section={id} data-edit-section={id}>{typeof r === "function" ? r(i + 1) : r}</div>;
      })}
    </div>
  );
}
export const roman = (n: number) => ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n] ?? String(n);

const noop = () => () => {};
/** Client-only countdown parts (null on server / after the day). */
export function useCountdown(date?: string) {
  return useSyncExternalStore(
    noop,
    () => {
      if (!date) return null;
      const ms = new Date(date + "T18:00:00").getTime() - Date.now();
      if (!(ms > 0)) return null;
      const d = Math.floor(ms / 864e5), h = Math.floor((ms % 864e5) / 36e5);
      return `${d}|${h}`;
    },
    () => null,
  );
}
export function Countdown({ date, children }: { date?: string; children: (d: number, h: number) => ReactNode }) {
  const v = useCountdown(date);
  if (!v) return null;
  const [d, h] = v.split("|").map(Number);
  return <>{children(d, h)}</>;
}

/** Paper fibre / film grain overlay (pure SVG, no assets). */
export function Grain({ opacity = 0.12, blend = "multiply", freq = 0.85, className = "" }: { opacity?: number; blend?: CSSProperties["mixBlendMode"]; freq?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} style={{ opacity, mixBlendMode: blend }}>
      <filter id={`g${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={3} stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.4 -0.2" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#g${id})`} />
    </svg>
  );
}

/** Hero photo slot — always marked for the editor. */
export function HeroPhoto({ url, className = "", style }: { url?: string | null; className?: string; style?: CSSProperties }) {
  // eslint-disable-next-line @next/next/no-img-element
  return url ? <img data-edit-photo="hero" src={url} alt="" className={className} style={style} /> : <div data-edit-photo="hero" className={className} style={style} />;
}
