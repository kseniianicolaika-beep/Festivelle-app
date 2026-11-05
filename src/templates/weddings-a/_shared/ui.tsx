"use client";
import { forwardRef, useRef, type CSSProperties, type ReactNode } from "react";
import type { Theme } from "@/lib/themes";
import { designVars } from "@/lib/themes";
import { FONT_PAIRS, isFontPair } from "@/lib/fonts";
import { templateById } from "@/lib/catalog";
import type { Design, Kind } from "@/lib/templates";
import type { Profile } from "@/lib/profile";
import { ratioOf } from "./data";
import { useScene, type SceneKit } from "./motion";
import "./wa.css";

export type Faces = { display: string; script: string; body: string };

/** Theme/palette vars + this template's typography. A couple's font pairing wins only if they changed it. */
export function rootVars(theme: Theme, design: Design | undefined, tplId: string, mine: Faces): CSSProperties {
  const v = designVars(theme, { palette: design?.palette }) as Record<string, string>;
  const own = templateById(tplId)?.fonts;
  const f = design?.fonts && design.fonts !== own && isFontPair(design.fonts) && design.fonts !== "classic" ? FONT_PAIRS[design.fonts] : null;
  v["--wa-display"] = f ? f.display : mine.display;
  v["--wa-script"] = f ? f.script : mine.script;
  v["--wa-body"] = f ? f.body : mine.body;
  return v as CSSProperties;
}
export const ff = { display: { fontFamily: "var(--wa-display)" }, script: { fontFamily: "var(--wa-script)" }, body: { fontFamily: "var(--wa-body)" } } as const;

type CardRootProps = {
  kind: Kind; theme: Theme; design: Design; profile: Profile; tplId: string; faces: Faces; fonts: string;
  animate: boolean; className?: string; style?: CSSProperties; children: ReactNode;
  scene?: (k: SceneKit) => void;
};
/** Paper root: aspect ratio, container queries, theme + type vars, static/animate handling. */
export function CardRoot({ kind, theme, design, profile, tplId, faces, fonts, animate, className = "", style, children, scene }: CardRootProps) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useScene(ref, (k) => {
    scene?.(k);
    const els = k.q("[data-in]");
    if (els.length && !scene) k.gsap.from(els, { opacity: 0, y: 14, filter: "blur(4px)", duration: 1.2, ease: "power3.out", stagger: 0.12, delay: 0.15 });
  }, [animate, kind], animate);
  return (
    <div
      ref={ref}
      lang={profile.language ?? "en"}
      style={{ ...rootVars(theme, design, tplId, faces), aspectRatio: ratioOf(kind), fontFamily: "var(--wa-body)", ...style }}
      className={`@container relative w-full overflow-hidden ${fonts} ${animate ? (ready ? "" : "wa-pre") : "wa-static"} ${className}`}
    >
      {children}
    </div>
  );
}

/** Photo slot (editable in the studio). */
export const Photo = forwardRef<HTMLImageElement, { src?: string | null; slot?: "hero" | "photo" | "gallery"; className?: string; style?: CSSProperties; galleryKey?: string; fallback?: ReactNode }>(
  function Photo({ src, slot = "hero", className, style, galleryKey, fallback }, ref) {
    if (!src) return <div data-edit-photo={slot} className={className} style={style}>{fallback}</div>;
    // eslint-disable-next-line @next/next/no-img-element
    return <img ref={ref} data-edit-photo={slot} data-gallery-key={galleryKey} src={src} alt="" className={className} style={style} loading={slot === "gallery" ? "lazy" : undefined} />;
  },
);

/** Website section wrapper with the editor's hooks. */
export function Sec({ id, className = "", style, children }: { id: string; className?: string; style?: CSSProperties; children: ReactNode }) {
  return <section data-section={id} data-edit-section={id} className={`relative ${className}`} style={style}>{children}</section>;
}
