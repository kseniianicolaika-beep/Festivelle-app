"use client";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { TemplateDef } from "@/lib/catalog";
import type { Profile } from "@/lib/profile";
import type { Kind } from "@/lib/templates";
import { themeById } from "@/lib/themes";
import { Paper } from "@/components/designs/Paper";
import { WeddingSite } from "@/components/WeddingSite";
import { posterKind, sampleDesign, sampleProfile } from "./TemplatePreview";

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Fires once when the element comes near the viewport (and keeps reporting whether it's visible). */
export function useInView<T extends Element>(margin = "0px", once = false) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setSeen(true); setVisible(true); return; }
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (e.isIntersecting) { setSeen(true); if (once) io.disconnect(); }
    }, { rootMargin: margin, threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, [margin, once]);
  return { ref, seen, visible };
}

/**
 * Renders children at a fixed virtual width (e.g. a 390px phone or a 1280px laptop) and scales it to fit the
 * container — crisp, responsive previews of full websites. `scroll` lets visitors scroll inside the frame.
 */
export function ScaledFrame({ width, children, className = "", scroll = false, style }: { width: number; children: ReactNode; className?: string; scroll?: boolean; style?: React.CSSProperties }) {
  const box = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState<{ s: number; h: number } | null>(null);
  useIso(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setDim({ s: el.clientWidth / width, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={box} className={`relative overflow-hidden ${className}`} style={style}>
      {dim && (
        <div
          className={`absolute left-0 top-0 origin-top-left ${scroll ? "scroll-hide overflow-y-auto overscroll-contain" : "overflow-hidden"}`}
          style={{ width, height: dim.h / dim.s, transform: `scale(${dim.s})` }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/** A live website preview inside a phone. */
export function Phone({ children, className = "", width = 390, scroll = false }: { children: ReactNode; className?: string; width?: number; scroll?: boolean }) {
  return (
    <div className={`device-phone ${className}`}>
      <ScaledFrame width={width} scroll={scroll} className="screen aspect-[9/19.2]">{children}</ScaledFrame>
    </div>
  );
}

/** A live website preview inside a quiet browser window. */
export function Browser({ children, className = "", width = 1280, url, scroll = false, aspect = "aspect-[16/10]" }: { children: ReactNode; className?: string; width?: number; url?: string; scroll?: boolean; aspect?: string }) {
  return (
    <div className={`device-browser ${className}`}>
      <div className="device-bar"><i /><i /><i />{url && <span className="mx-auto max-w-[60%] truncate rounded-full bg-white/80 px-4 py-0.5 text-[10.5px] text-muted">{url}</span>}</div>
      <ScaledFrame width={width} scroll={scroll} className={aspect}>{children}</ScaledFrame>
    </div>
  );
}

type LiveProps = {
  t: TemplateDef;
  kind?: Kind;
  profile?: Profile;
  /** "inview": static until it scrolls into view, then plays its opening once (hover replays). "mount": play immediately. "static": never animate. */
  play?: "inview" | "mount" | "static";
  className?: string;
  /** websites only */
  device?: "phone" | "browser" | "bare";
  scroll?: boolean;
  replayOnHover?: boolean;
};

/** Any catalog template, live: bespoke Site/Card modules render because design.template = catalog id. */
export function LiveTemplate({ t, kind = "invite", profile, play = "inview", className = "", device = "phone", scroll = false, replayOnHover = true }: LiveProps) {
  const k = posterKind(t, kind);
  const p = profile ?? sampleProfile(t);
  const theme = themeById(t.theme);
  const design = sampleDesign(t, k, p);
  const { ref, seen } = useInView<HTMLDivElement>(k === "website" ? "300px" : "-8% 0px", true);
  const [run, setRun] = useState(0);
  const last = useRef(0);
  const live = play === "mount" || (play === "inview" && seen);
  useEffect(() => { if (live) last.current = Date.now(); }, [live]);
  const replay = () => {
    if (!replayOnHover || play === "static" || !live || Date.now() - last.current < 3200) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    last.current = Date.now();
    setRun((r) => r + 1);
  };

  if (k === "website") {
    const site = (live || play === "static") ? (
      <WeddingSite key={run} profile={p} theme={theme} design={design} layout={t.siteLayout} motif={t.motif} compact>
        <div className="py-6 text-center"><p className="display text-3xl">Kindly reply</p><p className="mt-2 text-sm opacity-60">Guests RSVP right here.</p></div>
      </WeddingSite>
    ) : <div className="h-full w-full" style={{ background: theme.bg }} />;
    return (
      <div ref={ref} onPointerEnter={replay} className={className}>
        {device === "phone" ? <Phone scroll={scroll}>{site}</Phone> : device === "browser" ? <Browser scroll={scroll} url={`${(p.partner1 ?? "you").toLowerCase()}.festivelle.com`}>{site}</Browser> : <ScaledFrame width={420} scroll={scroll} className="h-full w-full">{site}</ScaledFrame>}
      </div>
    );
  }
  return (
    <div ref={ref} onPointerEnter={replay} className={className}>
      <Paper key={live ? `live-${run}` : "still"} kind={k} layout={t.paperLayout} design={design} profile={p} theme={theme} animate={live} />
    </div>
  );
}
